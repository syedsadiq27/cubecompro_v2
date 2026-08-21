'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button, useToast } from '@repo/ui';
import {
  TEXTURE_SEMANTIC_SLOT_LABELS,
  type TextureSemanticSlot,
} from '@repo/product-graph';
import { listMaterialRevisionsAction } from '@/actions/assets';

type RevisionRow = {
  id: string;
  version: number;
  status?: string;
  contentHash: string;
  frozenAt: string;
  textureUsages: Array<{
    slot: string;
    textureAssetRevisionId: string;
    textureName?: string | null;
    wrapS?: string | null;
    wrapT?: string | null;
  }>;
};

export function MaterialRevisionsPanel({
  projectId,
  materialAssetId,
  refreshKey = 0,
}: {
  projectId: string;
  materialAssetId: string;
  refreshKey?: number;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [revisions, setRevisions] = useState<RevisionRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      const result = await listMaterialRevisionsAction(
        projectId,
        materialAssetId
      );
      if (cancelled) return;
      if (!result.ok) {
        toast.error(result.error || 'Could not load revisions');
        setRevisions([]);
        return;
      }
      setRevisions(result.revisions);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId, materialAssetId, refreshKey]);

  const tip = revisions.length
    ? revisions.reduce((best, row) =>
        row.version > best.version ? row : best
      )
    : null;

  return (
    <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
          Revisions
        </h3>
      </div>
      <p className="text-[11px] text-[var(--text-secondary)]">
        Draft edits overwrite the working tip until you publish. Product pins
        keep their frozen published revision.
      </p>
      {pending && revisions.length === 0 ? (
        <p className="text-[12px] text-[var(--text-muted)]">Loading…</p>
      ) : revisions.length === 0 ? (
        <p className="text-[12px] text-[var(--text-muted)]">No revisions yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {[...revisions].reverse().map((row) => {
            const isDraft = row.status === 'DRAFT';
            const isPublished = row.status === 'PUBLISHED';
            const isWorkingTip = tip?.id === row.id;
            const frozen = new Date(row.frozenAt);
            return (
              <li
                key={row.id}
                className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-2.5 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-[var(--ink)]">
                    v{row.version}
                    {isDraft ? (
                      <span className="ml-1.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-900">
                        Draft
                      </span>
                    ) : null}
                    {isPublished ? (
                      <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
                        Published
                      </span>
                    ) : null}
                    {isWorkingTip && !isDraft ? (
                      <span className="ml-1.5 rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                        Tip
                      </span>
                    ) : null}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {row.contentHash.slice(0, 8)}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                  {row.textureUsages.length} map
                  {row.textureUsages.length === 1 ? '' : 's'}
                  {Number.isFinite(frozen.getTime())
                    ? ` · ${frozen.toLocaleString()}`
                    : ''}
                </p>
                {row.textureUsages.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5">
                    {row.textureUsages.map((usage) => (
                      <li
                        key={`${row.id}-${usage.slot}`}
                        className="text-[10px] text-[var(--text-muted)]"
                      >
                        <span className="font-medium text-[var(--text-secondary)]">
                          {TEXTURE_SEMANTIC_SLOT_LABELS[
                            usage.slot as TextureSemanticSlot
                          ] || usage.slot}
                        </span>
                        {' · '}
                        {usage.textureName || usage.textureAssetRevisionId.slice(0, 8)}
                        {usage.wrapS || usage.wrapT
                          ? ` · wrap ${usage.wrapS || '—'} / ${usage.wrapT || '—'}`
                          : ''}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
