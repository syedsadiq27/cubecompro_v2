'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button } from '@repo/ui';
import {
  disconnectShopifyAction,
  startShopifyOAuthAction,
  type ShopifyConnection,
} from '@/actions/shopify';
import {
  BackofficePageHeader,
  EmptyState,
  FormField,
  PageBody,
  StatusBadge,
  TextInput,
} from '@/components/bo';
import { StoreIcon } from '@/components/bo/icons';

export function ShopifyIntegrationsScreen({
  projectId,
  connections,
  connected,
  errorMessage,
}: {
  projectId: string;
  connections: ShopifyConnection[];
  connected?: boolean;
  errorMessage?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(errorMessage ?? null);
  const connection = connections[0] ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title="Shopify"
        description="Connect a Shopify shop with OAuth, then import products into CubeCom."
        actions={
          connection ? (
            <Button
              as={Link}
              href={`/${projectId}/integrations/shopify/import`}
              size="sm"
              className="ui:text-[13px]"
            >
              Import from Shopify
            </Button>
          ) : null
        }
      />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-4">
          {connected ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
              Shopify shop connected.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          ) : null}

          {connection ? (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                    <StoreIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[var(--ink)] truncate">
                      {connection.displayName || connection.externalAccountId}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[var(--text-secondary)] font-mono truncate">
                      {connection.externalAccountId}
                    </p>
                  </div>
                </div>
                <StatusBadge role="published" label="Connected" />
              </div>

              <dl className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider text-[10px] font-semibold">
                    API version
                  </dt>
                  <dd className="mt-1 font-mono text-[var(--ink)]">
                    {connection.apiVersion}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider text-[10px] font-semibold">
                    Token
                  </dt>
                  <dd className="mt-1 text-[var(--ink)]">
                    {connection.hasAccessToken ? 'Stored securely' : 'Missing'}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                <Button
                  as={Link}
                  href={`/${projectId}/integrations/shopify/import`}
                  size="sm"
                >
                  Import products
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      const result = await disconnectShopifyAction(
                        projectId,
                        connection.id
                      );
                      if (!result.ok) {
                        setError(result.error ?? 'Disconnect failed.');
                        return;
                      }
                      window.location.reload();
                    });
                  }}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs space-y-4">
              <EmptyState
                title="No Shopify shop connected"
                description="Authorize CubeCom against your Shopify Admin store. Access tokens are never shown in this UI."
              />
              <form
                className="space-y-3"
                action={(formData) => {
                  startTransition(async () => {
                    setError(null);
                    const result = await startShopifyOAuthAction(
                      projectId,
                      formData
                    );
                    if (result && !result.ok) {
                      setError(result.error ?? 'OAuth failed.');
                    }
                  });
                }}
              >
                <FormField
                  label="Shop domain"
                  htmlFor="shop"
                  required
                  helperText="example.myshopify.com"
                >
                  <TextInput
                    id="shop"
                    name="shop"
                    placeholder="your-store.myshopify.com"
                    required
                    disabled={pending}
                  />
                </FormField>
                <Button type="submit" size="sm" disabled={pending}>
                  {pending ? 'Redirecting…' : 'Connect Shopify'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </PageBody>
    </div>
  );
}
