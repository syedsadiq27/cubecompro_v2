'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { StatusBadge } from '@/components/bo/states/operational-states';

export type PublishedRevisionItem = {
  revisionId: string;
  versionNumber: number;
  publishedAt: string;
  publishedBy: string;
  isLive: boolean;
  changesSummary: string;
  rulesCount: number;
  mappingsCount: number;
};

const SAMPLE_REVISIONS: PublishedRevisionItem[] = [
  {
    revisionId: 'rev-03',
    versionNumber: 3,
    publishedAt: 'Today at 10:45 AM',
    publishedBy: 'lead.designer@acme.com',
    isLive: true,
    changesSummary: 'Added Oak Wood frame material & updated pricing matrix for XL sizes.',
    rulesCount: 2,
    mappingsCount: 4,
  },
  {
    revisionId: 'rev-02',
    versionNumber: 2,
    publishedAt: 'Yesterday at 4:20 PM',
    publishedBy: 'product.manager@acme.com',
    isLive: false,
    changesSummary: 'Introduced White Leather swatch & rule constraint (No White Leather on Metal frame).',
    rulesCount: 2,
    mappingsCount: 3,
  },
  {
    revisionId: 'rev-01',
    versionNumber: 1,
    publishedAt: 'May 14, 2025',
    publishedBy: 'admin@acme.com',
    isLive: false,
    changesSummary: 'Initial product release with standard Walnut frame and Black Leather.',
    rulesCount: 1,
    mappingsCount: 2,
  },
];

export function VersionHistoryDialog({
  isOpen,
  onClose,
  productName,
  onRollback,
  isRollingBack,
}: {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onRollback: (targetRevisionId: string, versionNum: number) => void;
  isRollingBack?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-[var(--line)] pb-3">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--ink)]">Revision History &amp; Rollback</h3>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Published storefront revisions for <strong>{productName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Revisions Stream */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {SAMPLE_REVISIONS.map((rev) => (
            <div
              key={rev.revisionId}
              className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                rev.isLive
                  ? 'border-[#665CFF] bg-violet-50/20 shadow-xs'
                  : 'border-[var(--line)] bg-[var(--canvas)]/40 hover:bg-[var(--canvas)]/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-[var(--ink)]">
                    Revision #{rev.versionNumber}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    ({rev.revisionId})
                  </span>
                  {rev.isLive ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.2 font-mono text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
                      ● Live Storefront
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">{rev.publishedAt}</span>
              </div>

              <p className="text-[12px] text-[var(--text-secondary)]">{rev.changesSummary}</p>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]/60 text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <span>Author: <strong className="text-[var(--ink)]">{rev.publishedBy}</strong></span>
                  <span>·</span>
                  <span>{rev.rulesCount} rules · {rev.mappingsCount} 3D bindings</span>
                </div>

                {!rev.isLive && (
                  <button
                    type="button"
                    disabled={isRollingBack}
                    onClick={() => onRollback(rev.revisionId, rev.versionNumber)}
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors cursor-pointer"
                  >
                    Rollback to v{rev.versionNumber} ↺
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[12px] text-[var(--text-muted)]">
          <p className="text-[11px]">
            Revisions are immutable. Rolling back safely redirects storefront traffic to the selected revision snapshot.
          </p>
          <Button type="button" variant="secondary" size="sm" onClick={onClose} className="ui:text-[12px]">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
