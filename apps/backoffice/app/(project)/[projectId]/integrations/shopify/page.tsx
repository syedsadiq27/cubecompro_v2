import {
  getShopifyConnectionsAction,
} from '@/actions/shopify';
import { ShopifyIntegrationsScreen } from '@/components/integrations/shopify-integrations-screen';

export default async function ShopifyIntegrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ connected?: string; shopify_error?: string }>;
}) {
  const { projectId } = await params;
  const { connected, shopify_error } = await searchParams;
  const { connections, error } = await getShopifyConnectionsAction(projectId);

  return (
    <ShopifyIntegrationsScreen
      projectId={projectId}
      connections={connections}
      connected={connected === '1'}
      errorMessage={shopify_error ?? error}
    />
  );
}
