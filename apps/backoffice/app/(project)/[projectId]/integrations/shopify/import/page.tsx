import Link from 'next/link';
import { Button } from '@repo/ui';
import {
  getShopifyCatalogAction,
  getShopifyConnectionsAction,
} from '@/actions/shopify';
import { ShopifyImportBrowseScreen } from '@/components/integrations/shopify-import-browse-screen';
import { BackofficePageHeader, EmptyState, PageBody } from '@/components/bo';

export default async function ShopifyImportPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { projectId } = await params;
  const { q } = await searchParams;
  const { connections } = await getShopifyConnectionsAction(projectId);
  if (connections.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
        <BackofficePageHeader title="Import from Shopify" />
        <PageBody>
          <EmptyState
            title="Connect Shopify first"
            description="Authorize a shop before browsing the Admin catalog."
            action={
              <Button as={Link} href={`/${projectId}/integrations/shopify`} size="sm">
                Open Shopify integration
              </Button>
            }
          />
        </PageBody>
      </div>
    );
  }

  const { products, error } = await getShopifyCatalogAction(projectId, q);
  return (
    <ShopifyImportBrowseScreen
      projectId={projectId}
      products={products}
      initialQuery={q}
      errorMessage={error}
    />
  );
}
