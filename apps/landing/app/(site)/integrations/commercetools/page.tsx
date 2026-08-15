import { CommercetoolsIntegrationPage } from '@/components/integrations/commercetools-integration-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/integrations/commercetools');

export default function Page() {
  return <CommercetoolsIntegrationPage />;
}
