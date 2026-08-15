'use client';

import Link from 'next/link';
import { Button, DataTable } from '@repo/ui';
import type { ShopifyImportProof } from '@/actions/shopify';
import {
  BackofficePageHeader,
  PageBody,
  StatusBadge,
} from '@/components/bo';

function displayShopifyId(id: string): string {
  const match = /\/(\d+)$/.exec(id.trim());
  return match?.[1] ?? id;
}

export function ShopifyImportProofScreen({
  projectId,
  proof,
  errorMessage,
}: {
  projectId: string;
  proof: ShopifyImportProof | null;
  errorMessage?: string;
}) {
  if (!proof) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
        <BackofficePageHeader title="Import proof" />
        <PageBody>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {errorMessage ?? 'Proof unavailable.'}
          </div>
        </PageBody>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title={`Imported: ${proof.productName}`}
        description="CubeCom ProductRevision + CommerceMappingSet created from Shopify. UNMAPPED identities are catalog gaps, not invalid configurations."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              as={Link}
              href={`/${projectId}/products/${proof.productId}?tab=commerce`}
              size="sm"
              className="ui:text-[13px]"
            >
              Open commerce tab
            </Button>
            <Button
              as={Link}
              href={`/${projectId}/products/${proof.productId}`}
              size="sm"
              variant="secondary"
              className="ui:text-[13px]"
            >
              Open product
            </Button>
          </div>
        }
      />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-4">
          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">
              ProductRevision
            </h3>
            {proof.choices.length === 0 ? (
              <p className="text-[13px] text-[var(--text-secondary)]">
                Default identity (no option dimensions).
              </p>
            ) : (
              <ul className="space-y-3">
                {proof.choices.map((choice) => (
                  <li key={choice.key}>
                    <p className="text-[13px] font-semibold text-[var(--ink)]">
                      {choice.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {choice.values.map((value) => (
                        <span
                          key={value.key}
                          className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--canvas)] px-2 py-0.5 text-[12px] text-[var(--ink)]"
                        >
                          {value.name}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">
              CommerceMappingSet
            </h3>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                identityChoices
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {proof.identityChoiceNames.length > 0 ? (
                  proof.identityChoiceNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--canvas)] px-2 py-0.5 text-[12px] font-medium text-[var(--ink)]"
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-[var(--text-secondary)]">
                    Default
                  </span>
                )}
              </div>
            </div>
            <p className="text-[13px] text-[var(--ink)]">
              mappings:{' '}
              <span className="font-semibold">{proof.mappingCount}</span>
            </p>
            <p className="text-[13px] text-[var(--ink)]">
              constraints created:{' '}
              <span className="font-semibold">{proof.constraintCount}</span>
              {proof.constraintCount === 0 ? (
                <span className="ml-2 text-[12px] text-emerald-700">
                  (UNMAPPED ≠ INVALID)
                </span>
              ) : null}
            </p>
          </section>

          <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
            <div className="border-b border-[var(--line)] px-5 py-4">
              <h3 className="text-[13px] font-semibold text-[var(--ink)]">
                resolveCommerce
              </h3>
              <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                Exact lookup against the imported mapping set.
              </p>
            </div>
            <div className="overflow-x-auto">
              <DataTable variant="fill" minWidth={560}>
                <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  <tr>
                    <DataTable.HeaderCell>Selection</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                    <DataTable.HeaderCell>External ID</DataTable.HeaderCell>
                  </tr>
                </DataTable.Header>
                <DataTable.Body>
                  {proof.resolutions.map((row, index) => (
                    <DataTable.Row key={`${row.label}-${index}`}>
                      <DataTable.Cell className="font-medium">
                        {row.label}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {row.status === 'RESOLVED' ? (
                          <StatusBadge role="published" label="RESOLVED" />
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
          </section>
        </div>
      </PageBody>
    </div>
  );
}
