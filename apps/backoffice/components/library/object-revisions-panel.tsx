'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button, useToast } from '@repo/ui';
import { listObjectRevisionsAction } from '@/actions/assets';
import { formatBytes } from './types';

type RevisionRow = {
  id: string;
  version: number;
  contentHash: string;
  format?: string | null;
  sizeBytes?: number | null;
  frozenAt: string;
};

export function ObjectRevisionsPanel({
  projectId,
  objectAssetId,
  onUpload,
  refreshKey = 0,
}: {
  projectId: string;
  objectAssetId: string;
  onUpload: () => void;
  refreshKey?: number;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [revisions, setRevisions] = useState<RevisionRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      const result = await listObjectRevisionsAction(projectId, objectAssetId);
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
  }, [projectId, objectAssetId, refreshKey]);

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
        <Button type="button" size="sm" variant="secondary" onClick={onUpload}>
          Upload new
        </Button>
      </div>
      <p className="text-[11px] text-[var(--text-secondary)]">
        Library tip is the latest revision. Product pins keep their frozen
        revision until changed on a draft.
      </p>
      {pending && revisions.length === 0 ? (
        <p className="text-[12px] text-[var(--text-muted)]">Loading…</p>
      ) : revisions.length === 0 ? (
        <p className="text-[12px] text-[var(--text-muted)]">No revisions yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {[...revisions].reverse().map((row) => {
            const isTip = tip?.id === row.id;
            const frozen = new Date(row.frozenAt);
            return (
              <li
                key={row.id}
                className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-2.5 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-[var(--ink)]">
                    v{row.version}
                    {isTip ? (
                      <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
                        Tip
                      </span>
                    ) : null}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {row.contentHash.slice(0, 8)}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                  {(row.format || 'glb').toUpperCase()}
                  {row.sizeBytes != null
                    ? ` · ${formatBytes(row.sizeBytes)}`
                    : ''}
                  {Number.isFinite(frozen.getTime())
                    ? ` · ${frozen.toLocaleString()}`
                    : ''}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
