import { ShopifyIntegrationPage } from '@/components/integrations/shopify-integration-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/integrations/shopify');

export default function Page() {
  return <ShopifyIntegrationPage />;
}
