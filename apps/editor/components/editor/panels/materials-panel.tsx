'use client';

import { useEffect, useState } from 'react';
import { MATERIAL_ASSETS_QUERY, graphRequest } from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';

type MaterialRow = {
  id: string;
  name: string;
  currentRevisionId?: string | null;
};

export function MaterialsPanel() {
  const projectId = useEditorStore((state) => state.projectId);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const [materials, setMaterials] = useState<MaterialRow[]>([]);

  useEffect(() => {
    if (!projectId || !graphAuth) {
      setMaterials([]);
      return;
    }
    let cancelled = false;
    void graphRequest<{ materialAssets: MaterialRow[] }>(
      MATERIAL_ASSETS_QUERY,
      { projectId },
      graphAuth.token,
      graphAuth.apiUrl
    )
      .then((data) => {
        if (!cancelled) setMaterials(data.materialAssets);
      })
      .catch(() => {
        if (!cancelled) setMaterials([]);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth]);

  return (
    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5 select-none">
      <p className="px-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Materials ({materials.length})
      </p>
      {materials.length === 0 ? (
        <p className="px-1 text-[11px] text-[var(--text-muted)]">
          No library materials in this project yet. Create one from a selected
          mesh in the inspector.
        </p>
      ) : (
        materials.map((mat) => (
          <div
            key={mat.id}
            className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-4 w-4 shrink-0 rounded-full border border-black/10 bg-[#8A6040]" />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-[var(--ink)]">
                  {mat.name}
                </p>
                <p className="font-mono text-[10px] text-[var(--text-muted)]">
                  {mat.currentRevisionId
                    ? mat.currentRevisionId.slice(0, 10)
                    : 'No revision'}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
