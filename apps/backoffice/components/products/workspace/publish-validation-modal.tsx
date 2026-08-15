'use client';

import { Button } from '@repo/ui';
import { StatusBadge } from '@/components/bo/states/operational-states';
import type { StatusGrammarRole } from '@/lib/status-vocabulary';
import {
  buildPublishDependencyGraph,
  publishDependencyActionLabel,
  type PublishDependencyAction,
  type PublishDependencyNode,
} from '@/lib/publish-dependency-graph';
import type {
  GraphDetail,
  MaterialAssetOption,
  ObjectAssetOption,
} from '@/lib/product-workspace';

function actionRole(action: PublishDependencyAction): StatusGrammarRole {
  switch (action) {
    case 'publish':
    case 'freeze':
    case 'include':
      return 'published';
    case 'advance_tip':
      return 'needs_attention';
    case 'missing':
    case 'blocked':
      return 'error';
    default:
      return 'neutral';
  }
}

function DependencyRow({
  node,
  depth = 0,
}: {
  node: PublishDependencyNode;
  depth?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className="flex items-start justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--canvas)]/50 px-3 py-2"
        style={{ marginLeft: depth * 12 }}
      >
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--ink)]">
              {node.label}
            </span>
            <span className="rounded border border-[var(--line)] bg-white px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--text-muted)]">
              {node.kind.replace('_', ' ')}
            </span>
          </div>
          {node.detail ? (
            <p className="text-[11px] text-[var(--text-secondary)]">
              {node.detail}
            </p>
          ) : null}
        </div>
        <StatusBadge
          role={actionRole(node.action)}
          label={publishDependencyActionLabel(node.action)}
        />
      </div>
      {node.children?.map((child) => (
        <DependencyRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function PublishValidationModal({
  isOpen,
  onClose,
  onConfirmPublish,
  productName,
  versionNumber,
  isPublishing,
  detail,
  objectAssets = [],
  materialAssets = [],
  hasUnsavedChanges = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  productName: string;
  versionNumber: number;
  isPublishing: boolean;
  detail: GraphDetail | null;
  objectAssets?: ObjectAssetOption[];
  materialAssets?: MaterialAssetOption[];
  hasUnsavedChanges?: boolean;
}) {
  if (!isOpen) return null;

  if (!detail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 shadow-2xl space-y-4">
          <h3 className="text-[16px] font-bold text-[var(--ink)]">
            Nothing to publish
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Start a draft configuration before publishing.
          </p>
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const graph = buildPublishDependencyGraph({
    productName,
    detail,
    objectAssets,
    materialAssets,
  });

  const blockers = [
    ...(hasUnsavedChanges
      ? ['Save pending draft changes before publishing']
      : []),
    ...graph.blockers,
  ];
  const canPublish = blockers.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150 select-none">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-[var(--line)] px-6 py-4">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--ink)]">
              Publish dependency resolver
            </h3>
            <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
              What becomes live when you publish{' '}
              <strong>{productName}</strong> (Draft v{versionNumber})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-lg font-bold text-[var(--text-muted)] hover:text-[var(--ink)]"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--canvas)]/30 p-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Dependency graph
            </p>
            <DependencyRow node={graph.root} />
          </div>

          {graph.tipAdvances > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-[12px] text-amber-950">
              <p className="font-semibold">
                {graph.tipAdvances} object pin
                {graph.tipAdvances === 1 ? '' : 's'} will advance to library tip
              </p>
              <p className="mt-0.5 text-[11px] text-amber-900/90">
                Publishing freezes the tip revision on this product. Older pins
                on this draft are updated first.
              </p>
            </div>
          ) : null}

          {blockers.length > 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50/70 px-3 py-2.5 text-[12px] text-red-950">
              <p className="font-semibold">Cannot publish yet</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px]">
                {blockers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-[12px] text-emerald-900">
              <span className="font-bold">Ready to publish.</span> Product
              revision, option graph, rules, variants, mappings, and pinned
              object revisions will go live together.
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[var(--line)] px-6 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isPublishing}
            className="ui:text-[12px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!canPublish || isPublishing}
            onClick={onConfirmPublish}
            className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:text-[12px] ui:font-semibold"
          >
            {isPublishing
              ? 'Publishing…'
              : `Publish Draft v${versionNumber}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
