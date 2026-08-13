'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { softDeleteProductAction } from '@/actions/products';
import type { CatalogProduct } from '@/components/products/products-catalog';
import {
  formatOperationalStatus,
  toOperationalStatus,
} from '@/lib/product-status';

export function ProductInspector({
  product,
  projectId,
  onClose,
}: {
  product: CatalogProduct;
  projectId: string;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const operational = toOperationalStatus(product.statusName);

  return (
    <>
      <button
        type="button"
        aria-label="Close inspector"
        className="absolute inset-0 z-20 bg-black/10 lg:bg-transparent"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 z-30">
        <aside className="flex h-full w-[min(320px,92vw)] flex-col border-l border-[var(--bo-line)] bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.06)]">
          <div className="border-b border-[var(--bo-line)] px-4 py-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  Inspector
                </p>
                <h2 className="mt-2 truncate text-base font-semibold text-[var(--bo-ink)]">
                  {product.name}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--bo-muted)]">
                  {product.code || 'Product'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-2 py-1 text-sm text-[var(--bo-muted)] hover:bg-black/[0.04]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[var(--bo-line)] bg-[radial-gradient(circle_at_50%_35%,#f7f4ef,#d9d4cc)]">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt=""
                  className="max-h-[70%] max-w-[70%] object-contain"
                />
              ) : (
                <p className="text-[11px] tracking-wide text-[#5c564e] uppercase">
                  Product
                </p>
              )}
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="Status" value={formatOperationalStatus(product.statusName)} />
              <Row label="Key" value={product.code || '—'} />
              <Row
                label="Configuration"
                value={`${product.signals.mappedCount}/${product.signals.configurationCount} mapped`}
              />
              <Row label="Commerce" value={product.signals.healthLabel} />
              <Row
                label="Price"
                value={product.signals.hasPrice ? product.signals.priceLabel : '—'}
              />
              <Row
                label="SKUs"
                value={String(product.signals.skuCount)}
              />
              {product.categoryNames.length > 0 ? (
                <Row
                  label="Categories"
                  value={product.categoryNames.join(', ')}
                />
              ) : null}
            </dl>

            <div className="mt-6 grid gap-2">
              <Link
                href={`/${projectId}/products/${product.id}`}
                className="bo-btn-primary inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium"
              >
                Open product
              </Link>
              <Link
                href={`/${projectId}/products/${product.id}?tab=3d`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--bo-line)] px-3 py-2.5 text-sm font-medium"
              >
                Open in 3D Studio
              </Link>
              <Link
                href={`/${projectId}/products/${product.id}?tab=options`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--bo-line)] px-3 py-2.5 text-sm font-medium"
              >
                Configure options
              </Link>
              {operational !== 'cancelled' ? (
                <button
                  type="button"
                  disabled={pending}
                  className="inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--bo-danger)] hover:bg-red-50 disabled:opacity-60"
                  onClick={() => {
                    if (!confirm('Archive this product?')) return;
                    startTransition(async () => {
                      await softDeleteProductAction(projectId, product.id);
                      onClose();
                    });
                  }}
                >
                  {pending ? 'Archiving…' : 'Archive'}
                </button>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[var(--bo-muted)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-[var(--bo-ink)]">
        {value}
      </dd>
    </div>
  );
}
