'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, DataTable } from '@repo/ui';
import type { ShopifyCatalogProduct } from '@/actions/shopify';
import {
  BackofficePageHeader,
  EmptyState,
  FormField,
  PageBody,
  StatusBadge,
  TextInput,
} from '@/components/bo';

export function ShopifyImportBrowseScreen({
  projectId,
  products,
  initialQuery,
  errorMessage,
}: {
  projectId: string;
  products: ShopifyCatalogProduct[];
  initialQuery?: string;
  errorMessage?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery ?? '');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title="Import from Shopify"
        description="Search the connected shop catalog, then review the CubeCom proposal before confirming."
        actions={
          <Button
            as={Link}
            href={`/${projectId}/integrations/shopify`}
            size="sm"
            variant="secondary"
            className="ui:text-[13px]"
          >
            Back to Shopify
          </Button>
        }
      />

      <PageBody>
        <div className="space-y-4">
          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              startTransition(() => {
                const params = new URLSearchParams();
                if (query.trim()) params.set('q', query.trim());
                const suffix = params.toString();
                router.push(
                  `/${projectId}/integrations/shopify/import${suffix ? `?${suffix}` : ''}`
                );
              });
            }}
          >
            <FormField
              label="Search catalog"
              htmlFor="q"
              className="min-w-[16rem] flex-1"
              helperText="Uses Shopify Admin products query syntax (title:, sku:, status:)."
            >
              <TextInput
                id="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="title:hoodie OR status:active"
                disabled={pending}
              />
            </FormField>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Searching…' : 'Search'}
            </Button>
          </form>

          {products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try a broader search, or confirm the Shopify catalog has active products."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
              <DataTable variant="fill" minWidth={720}>
                <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  <tr>
                    <DataTable.HeaderCell>Product</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Options</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Variants</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                    <DataTable.HeaderCell align="right">
                      Action
                    </DataTable.HeaderCell>
                  </tr>
                </DataTable.Header>
                <DataTable.Body>
                  {products.map((product) => (
                    <DataTable.Row key={product.id}>
                      <DataTable.Cell>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--ink)] truncate">
                            {product.title}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                            {product.handle}
                          </p>
                        </div>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {product.options.length > 0
                          ? product.options.join(' · ')
                          : 'Default'}
                      </DataTable.Cell>
                      <DataTable.Cell>{product.variantCount}</DataTable.Cell>
                      <DataTable.Cell>
                        <StatusBadge
                          role={
                            product.status.toLowerCase() === 'active'
                              ? 'published'
                              : 'draft'
                          }
                          label={product.status}
                        />
                      </DataTable.Cell>
                      <DataTable.ActionsCell>
                        <Button
                          as={Link}
                          href={`/${projectId}/integrations/shopify/import/${product.id}`}
                          size="sm"
                          variant="secondary"
                        >
                          Review
                        </Button>
                      </DataTable.ActionsCell>
                    </DataTable.Row>
                  ))}
                </DataTable.Body>
              </DataTable>
            </div>
          )}
        </div>
      </PageBody>
    </div>
  );
}
