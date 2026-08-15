'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, DataTable, useToast } from '@repo/ui';
import type { ShopifyCommerceView } from '@/actions/shopify';
import { StatusBadge } from '@/components/bo';
import { CheckIcon, CopyIcon, StoreIcon } from '@/components/bo/icons';
import type { GraphDetail } from '@/lib/product-workspace';

function displayShopifyId(id: string): string {
  const match = /\/(\d+)$/.exec(id.trim());
  return match?.[1] ?? id;
}

export function CommerceTab({
  projectId,
  productId,
  detail,
  editable,
  shopifyCommerce,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
  shopifyCommerce?: ShopifyCommerceView | null;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  void editable;
  void detail;
  void productId;

  const view = shopifyCommerce ?? null;

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied');
    setTimeout(() => setCopied(false), 1600);
  };

  if (!view) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 shadow-xs space-y-3">
        <h2 className="text-[15px] font-semibold text-[var(--ink)]">Commerce</h2>
        <p className="text-[13px] text-[var(--text-secondary)] max-w-xl">
          This product is not linked to a Shopify import yet. Connect a shop and
          import a catalog product to create identity dimensions and mappings.
        </p>
        <Button
          as={Link}
          href={`/${projectId}/integrations/shopify`}
          size="sm"
        >
          Open Shopify integration
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4 py-1">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--ink)]">
            Commerce
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            Shopify identity for this product revision.
          </p>
        </div>
        <div className="text-right text-[11px]">
          <div className="flex items-center justify-end gap-1.5 font-medium text-emerald-700">
            <StoreIcon size={13} />
            <span className="font-mono text-[var(--ink)]">
              {view.displayName || view.shop}
            </span>
            <CheckIcon size={13} />
            <span>Connected</span>
          </div>
          <p className="text-[var(--text-secondary)] mt-0.5">
            {view.mappedCount + view.unmappedCount} configurations
          </p>
          <p className="text-[var(--text-muted)]">
            {view.mappedCount} mapped · {view.unmappedCount} unmapped
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">
            Commerce identity
          </h3>
          <Button
            as={Link}
            href={`/${projectId}/integrations/shopify/import/proof?productId=${productId}`}
            size="sm"
            variant="secondary"
            className="ui:h-8 ui:text-[12px]"
          >
            View import proof
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-[12px]">
          <div>
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Shop
            </p>
            <p className="mt-1.5 font-mono text-[13px] text-[var(--ink)]">
              {view.shop}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              External product
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="font-mono text-[13px] text-[var(--ink)]"
                title={view.externalProductId}
              >
                {displayShopifyId(view.externalProductId)}
              </span>
              <button
                type="button"
                title="Copy product id"
                onClick={() => handleCopy(view.externalProductId)}
                className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
              >
                <CopyIcon size={13} />
              </button>
              {copied ? (
                <span className="text-[11px] text-emerald-700">Copied</span>
              ) : null}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Identity dimensions
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(view.identityChoiceNames?.length
                ? view.identityChoiceNames
                : []
              ).length > 0 ? (
                view.identityChoiceNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--canvas)] px-2 py-0.5 text-[12px] font-medium text-[var(--ink)]"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-[13px] text-[var(--ink)]">Default</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[var(--line)]">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">
            Mapping table
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            Observed Shopify variants and missing combinations (UNMAPPED ≠
            INVALID).
          </p>
        </div>
        <div className="overflow-x-auto">
          <DataTable variant="fill" minWidth={560}>
            <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <tr>
                <DataTable.HeaderCell>Configuration</DataTable.HeaderCell>
                <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                <DataTable.HeaderCell>SKU</DataTable.HeaderCell>
                <DataTable.HeaderCell>Variant ID</DataTable.HeaderCell>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {view.rows.map((row, index) => (
                <DataTable.Row key={`${row.label}-${index}`}>
                  <DataTable.Cell className="font-medium">
                    {row.label}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {row.status === 'mapped' ? (
                      <StatusBadge role="published" label="Mapped" />
                    ) : (
                      <div className="space-y-0.5">
                        <StatusBadge role="needs_attention" label="UNMAPPED" />
                        <p className="text-[11px] text-[var(--text-muted)]">
                          No Shopify variant exists for this identity.
                        </p>
                      </div>
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {row.sku ? (
                      <span className="font-mono text-[12px]">{row.sku}</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {row.externalId ? (
                      <span
                        className="font-mono text-[12px]"
                        title={row.externalId}
                      >
                        {displayShopifyId(row.externalId)}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
