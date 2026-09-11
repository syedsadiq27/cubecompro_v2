'use client';

import { useState, useTransition } from 'react';
import { Button, useToast } from '@repo/ui';
import {
  resolveCommerceLiveAction,
  type CommerceLivePreview,
} from '@/actions/commerce-live';
import { StatusBadge } from '@/components/bo';
import type { GraphDetail } from '@/lib/product-workspace';

function defaultSelection(detail: GraphDetail): Record<string, string> {
  const selection: Record<string, string> = {};
  for (const choice of detail.choices) {
    const preferred = choice.defaultValueId
      ? choice.values.find((value) => value.id === choice.defaultValueId)
      : undefined;
    const value = preferred ?? choice.values[0];
    if (value) {
      selection[choice.key] = value.key;
    }
  }
  return selection;
}

function formatPrice(
  amount?: string | null,
  currency?: string | null
): string {
  if (!amount) return '—';
  return currency ? `${amount} ${currency}` : amount;
}

function formatAvailability(preview: CommerceLivePreview): string {
  if (preview.inventoryTracked === false) return 'Not tracked';
  if (preview.inventoryAvailable == null) return '—';
  return String(preview.inventoryAvailable);
}

export function LiveCommerceProof({
  projectId,
  detail,
}: {
  projectId: string;
  detail: GraphDetail;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<CommerceLivePreview | null>(null);
  const [selection] = useState(() => defaultSelection(detail));

  const runPreview = () => {
    startTransition(async () => {
      const result = await resolveCommerceLiveAction(projectId, {
        productRevisionId: detail.id,
        selection,
      });
      if (result.error || !result.preview) {
        toast.error(result.error ?? 'Live resolve failed');
        setPreview(null);
        return;
      }
      setPreview(result.preview);
      toast.success('Live commerce resolved');
    });
  };

  let identityLabel = '—';
  if (preview?.identityJson) {
    try {
      identityLabel = JSON.stringify(JSON.parse(preview.identityJson));
    } catch {
      identityLabel = preview.identityJson;
    }
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">
            Live commerce preview
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 max-w-xl">
            Resolves this revision through CubeCom API → commerce-core →
            hosted engine. Merchants never call Medusa from the browser.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={runPreview}
          disabled={pending || Object.keys(selection).length === 0}
        >
          {pending ? 'Resolving…' : 'Configure / Preview'}
        </Button>
      </div>

      <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 px-3 py-2 text-[12px]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Selection
        </p>
        <p className="mt-1 font-mono text-[12px] text-[var(--ink)] break-all">
          {Object.keys(selection).length > 0
            ? JSON.stringify(selection)
            : 'No choices on this revision'}
        </p>
      </div>

      {preview ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-[12px]">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Resolved identity
            </p>
            <p className="font-mono text-[12px] text-[var(--ink)] break-all">
              {identityLabel}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preview.resolutionStatus === 'RESOLVED' ? (
                <StatusBadge role="published" label="RESOLVED" />
              ) : (
                <StatusBadge role="needs_attention" label="UNMAPPED" />
              )}
              {preview.canPurchase ? (
                <StatusBadge role="published" label="canPurchase" />
              ) : (
                <StatusBadge role="needs_attention" label="blocked" />
              )}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Price
            </p>
            <p className="text-[13px] font-medium text-[var(--ink)]">
              {formatPrice(preview.priceAmount, preview.priceCurrencyCode)}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {preview.sellabilityStatus ?? 'No live state'}
              {preview.unsellableReason
                ? ` · ${preview.unsellableReason}`
                : ''}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Availability
            </p>
            <p className="text-[13px] font-medium text-[var(--ink)]">
              {formatAvailability(preview)}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              eval {preview.evaluationValid ? 'valid' : 'invalid'} ·{' '}
              {preview.evaluationComplete ? 'complete' : 'incomplete'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Connection
            </p>
            <p className="font-mono text-[12px] text-[var(--ink)] break-all">
              {preview.connectionRef ?? '—'}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {preview.externalSku
                ? `sku ${preview.externalSku}`
                : preview.externalId
                  ? `ref ${preview.externalId}`
                  : 'No external ref'}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[12px] text-[var(--text-secondary)]">
          Run Configure / Preview to fetch identity, price, availability, and
          canPurchase for the default selection.
        </p>
      )}
    </div>
  );
}
