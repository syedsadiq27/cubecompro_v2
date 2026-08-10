'use client';

import type { ResolvedConfiguration } from './types';

type CommercePanelProps = {
  resolved: ResolvedConfiguration;
  shareId: string;
  copied: boolean;
  addedToCart: boolean;
  onCopyShareLink: () => void;
  onAddToCart: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function CommercePanel({
  resolved,
  shareId,
  copied,
  addedToCart,
  onCopyShareLink,
  onAddToCart,
}: CommercePanelProps) {
  const inStock = resolved.inventory > 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="type-nav-label">Resolved commerce</p>
        <dl className="mt-3 space-y-2.5 font-mono text-sm">
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2">
            <dt className="text-[var(--text-muted)]">SKU</dt>
            <dd>{resolved.sku}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2">
            <dt className="text-[var(--text-muted)]">Price</dt>
            <dd className="text-lg font-semibold">{formatPrice(resolved.price)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2">
            <dt className="text-[var(--text-muted)]">Inventory</dt>
            <dd
              className={
                inStock ? 'text-[var(--success)]' : 'text-[var(--danger)]'
              }
            >
              {inStock ? `${resolved.inventory} available` : 'Out of stock'}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[var(--text-muted)]">Config</dt>
            <dd className="text-right">
              {resolved.labels.frame} · {resolved.labels.fabric} ·{' '}
              {resolved.labels.legs}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5">
        <p className="type-nav-label">Shareable state</p>
        <p className="mt-1 truncate font-mono text-xs text-[var(--text-secondary)]">
          /demo?c={shareId}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onCopyShareLink}
          className="flex-1 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-pure)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--ink)]"
        >
          {copied ? 'Link copied' : 'Copy share link'}
        </button>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!inStock}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            !inStock
              ? 'cursor-not-allowed bg-[var(--line)] text-[var(--text-muted)]'
              : addedToCart
                ? 'bg-[var(--success)] text-white'
                : 'bg-[var(--ink)] text-white hover:bg-[var(--ink)]/90'
          }`}
        >
          {!inStock
            ? 'Unavailable'
            : addedToCart
              ? 'Added to cart'
              : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
