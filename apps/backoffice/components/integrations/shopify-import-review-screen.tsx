'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button, DataTable } from '@repo/ui';
import {
  confirmShopifyImportAction,
  type ShopifyImportPreview,
} from '@/actions/shopify';
import {
  BackofficePageHeader,
  PageBody,
  StatusBadge,
} from '@/components/bo';

type ReviewRow = {
  label: string;
  status: 'mapped' | 'unmapped' | string;
  sku?: string;
  externalId?: string;
};

function displayShopifyId(id: string): string {
  const match = /\/(\d+)$/.exec(id.trim());
  return match?.[1] ?? id;
}

export function ShopifyImportReviewScreen({
  projectId,
  shopifyProductId,
  preview,
  errorMessage,
}: {
  projectId: string;
  shopifyProductId: string;
  preview: ShopifyImportPreview | null;
  errorMessage?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(errorMessage ?? null);

  let rows: ReviewRow[] = [];
  if (preview?.reviewJson) {
    try {
      const parsed = JSON.parse(preview.reviewJson) as { rows?: ReviewRow[] };
      rows = parsed.rows ?? [];
    } catch {
      rows = [];
    }
  }

  const identityNames =
    preview?.identityChoiceNames?.length
      ? preview.identityChoiceNames
      : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title={preview?.productName ?? 'Import review'}
        description="Compare Shopify variants to the CubeCom mapping proposal. Missing combinations stay UNMAPPED — not invalid."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              as={Link}
              href={`/${projectId}/integrations/shopify/import`}
              size="sm"
              variant="secondary"
              className="ui:text-[13px]"
            >
              Back
            </Button>
            {preview ? (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                className="ui:text-[13px]"
                onClick={() => {
                  startTransition(async () => {
                    setError(null);
                    const result = await confirmShopifyImportAction(
                      projectId,
                      shopifyProductId,
                      preview.connectionId
                    );
                    if (result && !result.ok) {
                      setError(result.error ?? 'Import failed.');
                    }
                  });
                }}
              >
                {pending ? 'Importing…' : 'Confirm import'}
              </Button>
            ) : null}
          </div>
        }
      />

      <PageBody>
        <div className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          ) : null}

          {preview ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <MetaCard label="Shop" value={preview.shop} mono />
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-3 shadow-xs">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Identity dimensions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {identityNames.length > 0 ? (
                      identityNames.map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--canvas)] px-2 py-0.5 text-[12px] font-medium text-[var(--ink)]"
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] font-medium text-[var(--ink)]">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <MetaCard
                  label="Mapped"
                  value={String(preview.mappedCount)}
                />
                <MetaCard
                  label="Unmapped"
                  value={String(preview.unmappedCount)}
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
                <DataTable variant="fill" minWidth={640}>
                  <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    <tr>
                      <DataTable.HeaderCell>Configuration</DataTable.HeaderCell>
                      <DataTable.HeaderCell>Mapping</DataTable.HeaderCell>
                      <DataTable.HeaderCell>SKU</DataTable.HeaderCell>
                      <DataTable.HeaderCell>Variant ID</DataTable.HeaderCell>
                    </tr>
                  </DataTable.Header>
                  <DataTable.Body>
                    {rows.map((row, index) => (
                      <DataTable.Row key={`${row.label}-${index}`}>
                        <DataTable.Cell className="font-medium">
                          {row.label}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {row.status === 'mapped' ? (
                            <StatusBadge role="published" label="Mapped" />
                          ) : (
                            <div className="space-y-0.5">
                              <StatusBadge
                                role="needs_attention"
                                label="UNMAPPED"
                              />
                              <p className="text-[11px] text-[var(--text-muted)]">
                                No Shopify variant exists for this identity.
                              </p>
                            </div>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {row.sku ? (
                            <span className="font-mono text-[12px]">
                              {row.sku}
                            </span>
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
            </>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error ?? 'Preview unavailable.'}
            </div>
          )}
        </div>
      </PageBody>
    </div>
  );
}

function MetaCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-3 shadow-xs">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p
        className={`mt-1 text-[13px] font-medium text-[var(--ink)] ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
