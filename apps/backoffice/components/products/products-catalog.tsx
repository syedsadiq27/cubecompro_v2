'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { EmptyState } from '@repo/ui/empty-state';
import { Stage } from '@repo/ui/stage';
import { softDeleteProductAction } from '@/actions/products';
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

type ViewMode = 'grid' | 'list';
type SortMode = 'name' | 'status' | 'commerce' | 'variants';

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

function CommercePill({ health, label }: { health: CommerceHealth; label: string }) {
  const tone =
    health === 'ready'
      ? 'text-[var(--bo-live)]'
      : health === 'configuration_errors'
        ? 'text-[var(--bo-danger)]'
        : 'text-[var(--bo-draft)]';
  const dot =
    health === 'ready'
      ? 'bg-[var(--bo-live)]'
      : health === 'configuration_errors'
        ? 'bg-[var(--bo-danger)]'
        : 'bg-[var(--bo-draft)]';

  const display =
    health === 'ready'
      ? 'Ready'
      : health === 'configuration_errors'
        ? 'Error'
        : 'Incomplete';

  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-[var(--bo-ink)]/85">{display}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function OverflowMenu({
  projectId,
  productId,
}: {
  projectId: string;
  productId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative" onClick={(event) => event.preventDefault()}>
      <button
        type="button"
        aria-label="Product actions"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="rounded-md px-1.5 py-1 text-[var(--bo-muted)] hover:bg-black/[0.04] hover:text-[var(--bo-ink)]"
      >
        •••
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close menu"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-[var(--bo-line)] bg-white py-1 shadow-[var(--bo-shadow)]">
            <Link
              href={`/${projectId}/products/${productId}`}
              className="block px-3 py-1.5 text-[13px] hover:bg-black/[0.03]"
              onClick={() => setOpen(false)}
            >
              Edit metadata
            </Link>
            <Link
              href={`/${projectId}/products/${productId}?tab=options`}
              className="block px-3 py-1.5 text-[13px] hover:bg-black/[0.03]"
              onClick={() => setOpen(false)}
            >
              Configure options
            </Link>
            <button
              type="button"
              disabled={pending}
              className="block w-full px-3 py-1.5 text-left text-[13px] text-[var(--bo-danger)] hover:bg-red-50 disabled:opacity-60"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!confirm('Archive this product?')) return;
                startTransition(async () => {
                  await softDeleteProductAction(projectId, productId);
                  setOpen(false);
                });
              }}
            >
              {pending ? 'Archiving…' : 'Archive'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function productSubtitle(product: CatalogProduct) {
  if (product.brandLabel && product.code && product.code !== product.name) {
    return `${product.brandLabel} · ${product.code}`;
  }
  if (product.brandLabel) return product.brandLabel;
  if (product.code && product.code !== product.name) return `SKU ${product.code}`;
  return null;
}

function ProductThumb({
  product,
  size = 48,
}: {
  product: CatalogProduct;
  size?: number;
}) {
  return (
    <Stage
      size="thumb"
      product={!product.imageUrl}
      className="shrink-0 overflow-hidden rounded-[8px]"
      style={{ width: size, height: size, minHeight: size }}
    >
      {product.imageUrl ? (
        <div
          className="flex items-center justify-center p-1.5"
          style={{ width: size, height: size }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(16,16,16,0.12)]"
          />
        </div>
      ) : null}
    </Stage>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium tracking-[0.06em] text-[var(--bo-muted)] uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-[16px] font-semibold tracking-tight text-[var(--bo-ink)] tabular-nums sm:text-[18px]">
        {value}
      </p>
    </div>
  );
}

function GhostSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border-0 bg-transparent px-1.5 text-[13px] text-[var(--bo-ink)]/80 outline-none hover:bg-black/[0.03] focus:bg-black/[0.03]"
    >
      {children}
    </select>
  );
}

export function ProductsCatalog({
  projectId,
  products,
}: {
  projectId: string;
  products: CatalogProduct[];
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [commerce, setCommerce] = useState('all');
  const [channel, setChannel] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortMode>('name');
  const [view, setView] = useState<ViewMode>('list');

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const product of products) {
      for (const name of product.categoryNames) names.add(name);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const channels = useMemo(() => {
    const names = new Set<string>();
    for (const product of products) {
      if (product.signals.channel) names.add(product.signals.channel);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const showChannelColumn = useMemo(() => {
    const unique = new Set(
      products.map((product) => product.signals.channel || '')
    );
    return unique.size > 1;
  }, [products]);

  const summary = useMemo(() => summarizeCatalog(products), [products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = products.filter((product) => {
      const operational = formatOperationalStatus(
        product.statusName
      ).toLowerCase();
      if (status !== 'all' && operational !== status) return false;
      if (commerce !== 'all' && product.signals.health !== commerce) return false;
      if (
        channel !== 'all' &&
        (product.signals.channel || '').toLowerCase() !== channel.toLowerCase()
      ) {
        return false;
      }
      if (
        category !== 'all' &&
        !product.categoryNames.some((name) => name === category)
      ) {
        return false;
      }
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        product.code.toLowerCase().includes(needle) ||
        product.categoryNames.some((name) =>
          name.toLowerCase().includes(needle)
        )
      );
    });

    next.sort((a, b) => {
      if (sort === 'variants') return b.modelCount - a.modelCount;
      if (sort === 'status') {
        return formatOperationalStatus(a.statusName).localeCompare(
          formatOperationalStatus(b.statusName)
        );
      }
      if (sort === 'commerce') {
        return a.signals.healthLabel.localeCompare(b.signals.healthLabel);
      }
      return a.name.localeCompare(b.name);
    });

    return next;
  }, [products, query, status, commerce, channel, category, sort]);

  return (
    <div
      data-fill-page
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden"
    >
      <div className="shrink-0 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <h1 className="type-page text-[26px] sm:text-[32px]">Products</h1>
              <p className="type-meta">
                {summary.products} · {summary.skus} SKUs
              </p>
            </div>
          </div>
          <Link
            href={`/${projectId}/products/new`}
            className="inline-flex shrink-0 items-center bo-btn-primary rounded-lg px-3 py-1.5 text-[12px] font-medium"
          >
            + New
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2 border-b border-[var(--bo-line)] pb-3 sm:flex sm:gap-6">
          <Metric label="Live" value={summary.live} />
          <Metric label="Draft" value={summary.draft} />
          <Metric label="Ready" value={summary.commerceReady} />
          <Metric label="Issues" value={summary.issues} />
        </div>

        <div className="space-y-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products…"
            className="h-9 w-full max-w-xl rounded-lg border border-[var(--bo-line)] bg-white px-3 text-[13px] outline-none placeholder:text-[var(--bo-muted)] focus:border-[var(--bo-line-strong)]"
          />
          <div className="-mx-1 flex items-center gap-0.5 overflow-x-auto px-1 pb-0.5">
            <GhostSelect value={status} onChange={setStatus}>
              <option value="all">Status</option>
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </GhostSelect>
            <GhostSelect value={commerce} onChange={setCommerce}>
              <option value="all">Commerce</option>
              <option value="ready">Ready</option>
              <option value="mapping_required">Incomplete</option>
              <option value="pricing_missing">Pricing missing</option>
              <option value="configuration_errors">Error</option>
            </GhostSelect>
            {channels.length > 0 ? (
              <GhostSelect value={channel} onChange={setChannel}>
                <option value="all">Channel</option>
                {channels.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </GhostSelect>
            ) : null}
            <GhostSelect value={category} onChange={setCategory}>
              <option value="all">Category</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </GhostSelect>
            <GhostSelect
              value={sort}
              onChange={(value) => setSort(value as SortMode)}
            >
              <option value="name">Sort: Name</option>
              <option value="status">Sort: Status</option>
              <option value="commerce">Sort: Commerce</option>
              <option value="variants">Sort: Variants</option>
            </GhostSelect>
            <div className="ml-auto flex shrink-0 overflow-hidden rounded-md bg-black/[0.03] p-0.5 text-[12px] font-medium">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={`rounded px-2 py-1 ${
                  view === 'grid'
                    ? 'bg-white text-[var(--bo-ink)] shadow-sm'
                    : 'text-[var(--bo-muted)]'
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`rounded px-2 py-1 ${
                  view === 'list'
                    ? 'bg-white text-[var(--bo-ink)] shadow-sm'
                    : 'text-[var(--bo-muted)]'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState
            stage
            title="No products match"
            description="Try clearing filters, or create a product to place it on the stage."
            action={
              <Link
                href={`/${projectId}/products/new`}
                className="inline-flex items-center bo-btn-primary rounded-[7px] px-3 py-1.5 text-[12px] font-medium"
              >
                + New product
              </Link>
            }
          />
        ) : view === 'grid' ? (
          <div className="grid gap-3 pb-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((product) => {
              const subtitle = productSubtitle(product);
              return (
                <Link
                  key={product.id}
                  href={`/${projectId}/products/${product.id}`}
                  className="group overflow-hidden rounded-[10px] border border-[var(--bo-line)] bg-white transition hover:border-[var(--bo-line-strong)]"
                >
                  <Stage
                    size="thumb"
                    product={!product.imageUrl}
                    className="aspect-[2/1] w-full rounded-none"
                    style={{ minHeight: 0 }}
                  >
                    {product.imageUrl ? (
                      <div className="flex aspect-[2/1] w-full items-center justify-center px-8 py-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="max-h-full max-w-[72%] object-contain drop-shadow-[0_20px_32px_rgba(16,16,16,0.14)]"
                        />
                      </div>
                    ) : null}
                  </Stage>
                  <div className="space-y-3 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-[14px] font-semibold tracking-tight">
                            {product.name}
                          </h3>
                          <StatusPill statusName={product.statusName} />
                        </div>
                        {subtitle ? (
                          <p className="mt-0.5 truncate text-[12px] text-[var(--bo-muted)]">
                            {subtitle}
                          </p>
                        ) : null}
                      </div>
                      <OverflowMenu
                        projectId={projectId}
                        productId={product.id}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-[var(--bo-muted)]">
                      <span>
                        {product.signals.mappedCount}/
                        {product.signals.configurationCount} mapped
                      </span>
                      <span className="text-right text-[var(--bo-ink)]">
                        {product.signals.priceLabel}
                      </span>
                      <CommercePill
                        health={product.signals.health}
                        label={product.signals.healthLabel}
                      />
                      {showChannelColumn ? (
                        <span className="text-right">
                          {product.signals.channelLabel}
                        </span>
                      ) : (
                        <span className="text-right">
                          {product.signals.skuCount} SKUs
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[10px] border border-[var(--bo-line)] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="sticky top-0 z-[1] bg-white">
                  <tr className="border-b border-[var(--bo-line)]">
                    {(
                      [
                        'Product',
                        'Status',
                        'Configuration',
                        'Commerce',
                        'Price',
                        ...(showChannelColumn ? ['Channel'] : []),
                        'Updated',
                        '',
                      ] as const
                    ).map((header) => (
                      <th
                        key={header || 'actions'}
                        className="px-3 py-3 text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap text-[var(--bo-muted)] uppercase sm:px-4"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const subtitle = productSubtitle(product);
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-[var(--bo-line)] last:border-b-0 hover:bg-[#fafaf8]"
                      >
                        <td className="px-3 py-2.5 sm:px-4">
                          <Link
                            href={`/${projectId}/products/${product.id}`}
                            className="flex items-center gap-3"
                          >
                            <ProductThumb product={product} />
                            <span className="min-w-0">
                              <span className="block max-w-[12rem] truncate text-[14px] font-semibold text-[var(--bo-ink)] sm:max-w-none">
                                {product.name}
                              </span>
                              {subtitle ? (
                                <span className="block max-w-[12rem] truncate text-[12px] text-[var(--bo-muted)] sm:max-w-none">
                                  {subtitle}
                                </span>
                              ) : null}
                            </span>
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 sm:px-4">
                          <StatusPill statusName={product.statusName} />
                        </td>
                        <td className="px-3 py-2.5 text-[13px] whitespace-nowrap text-[var(--bo-muted)] sm:px-4">
                          {product.signals.mappedCount}/
                          {product.signals.configurationCount} mapped
                        </td>
                        <td className="px-3 py-2.5 sm:px-4">
                          <CommercePill
                            health={product.signals.health}
                            label={product.signals.healthLabel}
                          />
                        </td>
                        <td className="px-3 py-2.5 text-[13px] whitespace-nowrap text-[var(--bo-muted)] sm:px-4">
                          {product.signals.hasPrice
                            ? product.signals.priceLabel
                            : '—'}
                        </td>
                        {showChannelColumn ? (
                          <td className="px-3 py-2.5 text-[13px] whitespace-nowrap text-[var(--bo-muted)] sm:px-4">
                            {product.signals.channelLabel}
                          </td>
                        ) : null}
                        <td className="px-3 py-2.5 text-[13px] whitespace-nowrap text-[var(--bo-muted)] sm:px-4">
                          {product.updatedLabel || '—'}
                        </td>
                        <td className="px-3 py-2.5 text-right sm:px-4">
                          <OverflowMenu
                            projectId={projectId}
                            productId={product.id}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
