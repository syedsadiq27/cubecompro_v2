'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Stage } from '@repo/ui/stage';
import { ProductInspector } from '@/components/products/product-inspector';
import {
  BrowseSearch,
  BrowseTab,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';
import type { CommerceHealth, CommerceSignals } from '@/lib/commerce-signals';
import { summarizeCatalog } from '@/lib/commerce-signals';
import {
  formatOperationalStatus,
  toOperationalStatus,
  type OperationalStatus,
} from '@/lib/product-status';

export type CatalogProduct = {
  id: string;
  name: string;
  code: string;
  statusName: string | null;
  imageUrl: string | null;
  categoryNames: string[];
  brandLabel: string | null;
  modelCount: number;
  hasModels: boolean;
  updatedLabel: string | null;
  signals: CommerceSignals;
};

type StatusFilter = 'all' | 'live' | 'draft' | 'cancelled';

function StatusPill({ statusName }: { statusName: string | null }) {
  const operational = toOperationalStatus(statusName);
  const label = formatOperationalStatus(statusName);
  const styles: Record<OperationalStatus, string> = {
    live: 'bg-[var(--bo-live-soft)] text-[var(--bo-live)]',
    draft: 'bg-[var(--bo-draft-soft)] text-[var(--bo-draft)]',
    cancelled: 'bg-[var(--bo-error-soft)] text-[var(--bo-danger)]',
    other: 'bg-[var(--bo-accent-soft)] text-[var(--bo-muted)]',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[operational]}`}
    >
      {label}
    </span>
  );
}

function CommerceDot({ health }: { health: CommerceHealth }) {
  const tone =
    health === 'ready'
      ? 'bg-[var(--bo-live)]'
      : health === 'configuration_errors'
        ? 'bg-[var(--bo-danger)]'
        : 'bg-[var(--bo-draft)]';
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${tone}`} />;
}

function productSubtitle(product: CatalogProduct) {
  if (product.brandLabel && product.code && product.code !== product.name) {
    return `${product.brandLabel} · ${product.code}`;
  }
  if (product.brandLabel) return product.brandLabel;
  if (product.code && product.code !== product.name) return product.code;
  return 'Product';
}

export function ProductsCatalog({
  projectId,
  products,
}: {
  projectId: string;
  products: CatalogProduct[];
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const summary = useMemo(() => summarizeCatalog(products), [products]);

  const counts = useMemo(() => {
    let live = 0;
    let draft = 0;
    let cancelled = 0;
    for (const product of products) {
      const operational = toOperationalStatus(product.statusName);
      if (operational === 'live') live += 1;
      else if (operational === 'draft') draft += 1;
      else if (operational === 'cancelled') cancelled += 1;
    }
    return { all: products.length, live, draft, cancelled };
  }, [products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const operational = toOperationalStatus(product.statusName);
        if (status !== 'all' && operational !== status) return false;
        if (!needle) return true;
        return (
          product.name.toLowerCase().includes(needle) ||
          product.code.toLowerCase().includes(needle) ||
          product.categoryNames.some((name) =>
            name.toLowerCase().includes(needle)
          )
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query, status]);

  const selected =
    filtered.find((product) => product.id === selectedId) ??
    products.find((product) => product.id === selectedId) ??
    null;

  return (
    <BrowseWorkspace
      title="Products"
      meta={`${summary.products} · ${summary.skus} SKUs`}
      actions={
        <Link
          href={`/${projectId}/products/new`}
          className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium"
        >
          + New
        </Link>
      }
      filters={
        <>
          <BrowseTab
            label="All"
            count={counts.all}
            active={status === 'all'}
            onClick={() => setStatus('all')}
          />
          <BrowseTab
            label="Live"
            count={counts.live}
            active={status === 'live'}
            onClick={() => setStatus('live')}
          />
          <BrowseTab
            label="Draft"
            count={counts.draft}
            active={status === 'draft'}
            onClick={() => setStatus('draft')}
          />
          <BrowseTab
            label="Archived"
            count={counts.cancelled}
            active={status === 'cancelled'}
            onClick={() => setStatus('cancelled')}
          />
        </>
      }
      search={
        <BrowseSearch
          value={query}
          onChange={setQuery}
          placeholder="Search products…"
        />
      }
      inspector={
        selected ? (
          <ProductInspector
            product={selected}
            projectId={projectId}
            onClose={() => setSelectedId(null)}
          />
        ) : null
      }
    >
      <div className="mb-3">
        <p className="text-xs text-[var(--bo-muted)]">
          {filtered.length} product{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--bo-line)] px-6 text-center">
          <p className="text-sm font-medium text-[var(--bo-ink)]">
            No products here
          </p>
          <p className="mt-1 max-w-sm text-sm text-[var(--bo-muted)]">
            Try another filter, or create a product to start configuring.
          </p>
          <Link
            href={`/${projectId}/products/new`}
            className="bo-btn-primary mt-4 rounded-lg px-3 py-1.5 text-sm font-medium"
          >
            + New product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtered.map((product) => {
            const selectedCard = selectedId === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() =>
                  setSelectedId((current) =>
                    current === product.id ? null : product.id
                  )
                }
                className={`overflow-hidden rounded-xl border text-left transition ${
                  selectedCard
                    ? 'border-[var(--bo-ink)]/45 bg-[var(--bo-ink)]/[0.02] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]'
                    : 'border-[var(--bo-line)] hover:border-[var(--bo-ink)]/30'
                }`}
              >
                <Stage
                  size="thumb"
                  product={!product.imageUrl}
                  className="aspect-square w-full rounded-none"
                  style={{ minHeight: 0 }}
                >
                  {product.imageUrl ? (
                    <div className="flex aspect-square w-full items-center justify-center p-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain drop-shadow-[0_12px_20px_rgba(16,16,16,0.12)]"
                      />
                    </div>
                  ) : null}
                </Stage>
                <div className="border-t border-[var(--bo-line)] bg-white px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--bo-ink)]">
                      {product.name}
                    </p>
                    <StatusPill statusName={product.statusName} />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] text-[var(--bo-muted)]">
                    <CommerceDot health={product.signals.health} />
                    <span className="truncate">{productSubtitle(product)}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </BrowseWorkspace>
  );
}
