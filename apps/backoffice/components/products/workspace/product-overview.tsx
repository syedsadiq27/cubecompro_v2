'use client';

import { ProductMetadataForm } from '@/components/products/product-metadata-form';
import { updateProductMetadataAction } from '@/actions/products';
import type { GraphDetail } from '@/lib/product-workspace';

export function EditProductDetailsDrawer({
  projectId,
  productId,
  product,
  open,
  onClose,
}: {
  projectId: string;
  productId: string;
  product: { name: string; key: string };
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 z-20 bg-black/10"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 z-30">
        <aside className="flex h-full w-[min(360px,92vw)] flex-col border-l border-[var(--bo-line)] bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between gap-2 border-b border-[var(--bo-line)] px-4 py-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                Edit details
              </p>
              <h2 className="mt-2 text-base font-semibold text-[var(--bo-ink)]">
                {product.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-[var(--bo-muted)] hover:bg-black/[0.04]"
            >
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <ProductMetadataForm
              projectId={projectId}
              productId={productId}
              defaults={{
                Name: product.name,
                key: product.key,
              }}
              action={updateProductMetadataAction}
            />
          </div>
        </aside>
      </div>
    </>
  );
}

export function ProductOverview({
  product,
  detail,
  modelCount,
  mappingCount,
  onEditDetails,
  onConfigureOptions,
  onOpen3d,
  onOpenCommerce,
}: {
  product: {
    name: string;
    key: string;
    status: string;
  };
  detail: GraphDetail | null;
  modelCount: number;
  mappingCount: number;
  onEditDetails: () => void;
  onConfigureOptions: () => void;
  onOpen3d: () => void;
  onOpenCommerce: () => void;
}) {
  const productStatus =
    product.status === 'ACTIVE'
      ? 'Active'
      : product.status === 'ARCHIVED'
        ? 'Archived'
        : 'Draft';

  const variantCount = detail?.variants.length ?? 0;
  const commerceLabel =
    variantCount > 0 ? `${variantCount} variants` : 'Mapping required';

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
          Overview
        </h2>
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--bo-line)] bg-white">
            <div className="border-b border-[var(--bo-line)] px-3 py-2.5">
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">
                Product
              </p>
            </div>
            <div className="space-y-3 px-3 py-3">
              <div>
                <p className="text-[15px] font-semibold text-[var(--bo-ink)]">
                  {product.name}
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--bo-muted)]">
                  {product.key}
                </p>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--bo-muted)]">Status</dt>
                  <dd className="font-medium text-[var(--bo-ink)]">
                    {productStatus}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={onEditDetails}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px] font-medium"
              >
                Edit details
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--bo-line)] bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--bo-line)] px-3 py-2.5">
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">
                Configuration
              </p>
              <button
                type="button"
                onClick={onConfigureOptions}
                className="text-[12px] font-medium text-[var(--bo-ink)] hover:underline"
              >
                Configure options
              </button>
            </div>
            {!detail || detail.attributes.length === 0 ? (
              <div className="px-3 py-4">
                <p className="text-sm text-[var(--bo-muted)]">
                  No options yet. Start defining customer choices.
                </p>
                <button
                  type="button"
                  onClick={onConfigureOptions}
                  className="bo-btn-primary mt-3 rounded-lg px-3 py-1.5 text-[13px] font-medium"
                >
                  Configure options
                </button>
              </div>
            ) : (
              <ul>
                {detail.attributes.map((attribute) => {
                  const values = attribute.values ?? [];
                  const preview = values
                    .slice(0, 3)
                    .map((value) => value.name)
                    .join(', ');
                  const extra =
                    values.length > 3 ? ` +${values.length - 3}` : '';
                  return (
                    <li key={attribute.id}>
                      <button
                        type="button"
                        onClick={onConfigureOptions}
                        className="flex w-full items-center gap-3 border-b border-[var(--bo-line)] px-3 py-2.5 text-left last:border-b-0 hover:bg-black/[0.02]"
                      >
                        <span className="w-[28%] shrink-0 truncate text-[13px] font-medium text-[var(--bo-ink)]">
                          {attribute.name}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--bo-muted)]">
                          {preview || 'No values'}
                          {extra}
                        </span>
                        <span className="shrink-0 text-[12px] text-[var(--bo-muted)]">
                          {values.length}{' '}
                          {values.length === 1 ? 'value' : 'values'}
                        </span>
                        <span className="shrink-0 text-[var(--bo-muted)]">
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
          Experience
        </h2>
        <div className="grid gap-2 lg:grid-cols-2">
          <button
            type="button"
            onClick={onOpen3d}
            className="rounded-xl border border-[var(--bo-line)] bg-white text-left transition hover:border-[var(--bo-ink)]/30"
          >
            <div className="border-b border-[var(--bo-line)] px-3 py-2.5">
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">3D</p>
            </div>
            <div className="space-y-2 px-3 py-3">
              <p className="text-sm text-[var(--bo-ink)]">
                {modelCount} model{modelCount === 1 ? '' : 's'}
              </p>
              <p className="text-sm text-[var(--bo-muted)]">
                {mappingCount} mapping{mappingCount === 1 ? '' : 's'}
              </p>
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">
                Open 3D Studio →
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenCommerce}
            className="rounded-xl border border-[var(--bo-line)] bg-white text-left transition hover:border-[var(--bo-ink)]/30"
          >
            <div className="border-b border-[var(--bo-line)] px-3 py-2.5">
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">
                Commerce
              </p>
            </div>
            <div className="space-y-2 px-3 py-3">
              <p className="text-sm text-[var(--bo-ink)]">
                {variantCount} variant{variantCount === 1 ? '' : 's'}
              </p>
              <p className="text-sm text-[var(--bo-muted)]">{commerceLabel}</p>
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">
                Configure commerce →
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
