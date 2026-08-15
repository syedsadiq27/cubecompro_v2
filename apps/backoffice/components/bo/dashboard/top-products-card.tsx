'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RowActionMenu } from '@/components/bo/actions/overflow-menu';
import { StatusBadge } from '@/components/bo/states/operational-states';

export type TopProductItem = {
  id: string;
  name: string;
  code: string;
  status: 'published' | 'draft';
  statusLabel: string;
  imageUrl?: string | null;
  configMapped: number;
  configTotal: number;
  commerceMapped: number;
  commerceTotal: number;
  updatedDate: string;
  updatedTime: string;
};

export function TopProductsCard({
  projectId,
  title = 'Top products',
  viewAllHref,
  products,
}: {
  projectId: string;
  title?: string;
  viewAllHref?: string;
  products: TopProductItem[];
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter((p) => p.status === statusFilter);
  }, [products, statusFilter]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <h3 className="text-[14px] font-semibold text-[var(--ink)]">
            {title}
          </h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[12px] font-medium text-[var(--ink)] outline-none"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-[12px] font-medium text-[#665CFF] hover:underline"
          >
            View all products
          </Link>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead className="border-b border-[var(--line)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <tr>
              <th className="h-9 px-5">Product</th>
              <th className="h-9 px-4">Status</th>
              <th className="h-9 px-4 text-center">Config</th>
              <th className="h-9 px-4 text-center">Commerce</th>
              <th className="h-9 px-4">Updated</th>
              <th className="h-9 px-4 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]/60">
            {filtered.map((product) => {
              const isConfigComplete = product.configMapped === product.configTotal;
              const isCommerceComplete =
                product.commerceMapped === product.commerceTotal && product.commerceTotal > 0;
              const isCommerceMissing = product.commerceMapped === 0;

              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-[var(--canvas)]/40 cursor-pointer"
                  onClick={() => router.push(`/${projectId}/products/${product.id}`)}
                >
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--canvas)]">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-[var(--text-muted)]">—</span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[var(--ink)] leading-snug">
                          {product.name}
                        </p>
                        <p className="truncate text-[11px] text-[var(--text-muted)]">
                          {product.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2.5">
                    <StatusBadge
                      role={product.status === 'published' ? 'published' : 'draft'}
                      label={product.statusLabel}
                    />
                  </td>

                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 font-medium tabular-nums text-[var(--ink)]">
                      <span>{product.configMapped}/{product.configTotal}</span>
                      {isConfigComplete ? (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                          ▲
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 font-medium tabular-nums text-[var(--ink)]">
                      <span>{product.commerceMapped}/{product.commerceTotal}</span>
                      {isCommerceComplete ? (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          ✓
                        </span>
                      ) : isCommerceMissing ? (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-100 text-red-700 text-[9px] font-bold">
                          !
                        </span>
                      ) : (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                          ▲
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="text-[12px] text-[var(--ink)]">{product.updatedDate}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{product.updatedTime}</div>
                  </td>

                  <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <RowActionMenu
                      label={`Actions for ${product.name}`}
                      items={[
                        {
                          id: 'view',
                          label: 'Open product details',
                          onClick: () => router.push(`/${projectId}/products/${product.id}`),
                        },
                        {
                          id: 'configure',
                          label: 'Configure product options',
                          onClick: () =>
                            router.push(`/${projectId}/products/${product.id}?tab=options`),
                        },
                        {
                          id: 'commerce',
                          label: 'Map commerce channels',
                          onClick: () =>
                            router.push(`/${projectId}/products/${product.id}?tab=commerce`),
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
