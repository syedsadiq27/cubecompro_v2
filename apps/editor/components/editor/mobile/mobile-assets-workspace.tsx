'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MATERIAL_ASSETS_QUERY,
  OBJECT_ASSETS_QUERY,
  TEXTURE_ASSETS_QUERY,
  graphRequest,
} from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';

type AssetTab = 'objects' | 'materials' | 'textures' | 'environments';

type AssetRow = {
  id: string;
  name: string;
  currentRevisionId?: string | null;
};

const TABS: Array<{ key: AssetTab; label: string }> = [
  { key: 'objects', label: 'Objects' },
  { key: 'materials', label: 'Materials' },
  { key: 'textures', label: 'Textures' },
  { key: 'environments', label: 'Environments' },
];

export function MobileAssetsWorkspace() {
  const projectId = useEditorStore((state) => state.projectId);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const visualDocument = useEditorStore((state) => state.visualDocument);

  const [tab, setTab] = useState<AssetTab>('materials');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !graphAuth) {
      setRows([]);
      return;
    }
    if (tab === 'environments') {
      setRows([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const query =
      tab === 'objects'
        ? OBJECT_ASSETS_QUERY
        : tab === 'textures'
          ? TEXTURE_ASSETS_QUERY
          : MATERIAL_ASSETS_QUERY;

    const resultKey =
      tab === 'objects'
        ? 'objectAssets'
        : tab === 'textures'
          ? 'textureAssets'
          : 'materialAssets';

    void graphRequest<Record<string, AssetRow[]>>(
      query,
      { projectId },
      graphAuth.token,
      graphAuth.apiUrl
    )
      .then((data) => {
        if (!cancelled) setRows(data[resultKey] ?? []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth, tab]);

  const linkedKeys = useMemo(() => {
    const role =
      tab === 'objects'
        ? 'OBJECT'
        : tab === 'textures'
          ? 'TEXTURE'
          : tab === 'materials'
            ? 'MATERIAL'
            : null;
    if (!role || !visualDocument) return new Set<string>();
    return new Set(
      visualDocument.linkedAssets
        .filter((asset) => asset.role === role)
        .map((asset) => asset.key)
    );
  }, [visualDocument, tab]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const query = search.toLowerCase();
    return rows.filter((row) => row.name.toLowerCase().includes(query));
  }, [rows, search]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setTab(item.key);
              setSearch('');
            }}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium ${
              tab === item.key
                ? 'bg-[#665CFF] text-white'
                : 'bg-white/5 text-white/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="shrink-0 px-3 pt-3">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[11px] text-white outline-none placeholder:text-white/40"
        />
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {tab === 'environments' ? (
          <p className="py-4 text-center text-[11px] text-white/40">
            Environment library is not available in this revision yet.
          </p>
        ) : loading ? (
          <p className="py-4 text-center text-[11px] text-white/40">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="py-4 text-center text-[11px] text-white/40">
            No {tab} in this project yet.
          </p>
        ) : (
          filtered.map((row) => {
            const linked = linkedKeys.has(row.name) || linkedKeys.has(row.id);
            return (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white">
                    {row.name}
                  </p>
                  <p className="truncate font-mono text-[9px] text-white/40">
                    {row.currentRevisionId
                      ? row.currentRevisionId.slice(0, 12)
                      : 'No revision'}
                  </p>
                </div>
                {linked ? (
                  <span className="shrink-0 rounded-full bg-[#665CFF]/25 px-2 py-0.5 font-mono text-[9px] text-[#9D95FF]">
                    Linked
                  </span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
