import { SeoMarketingPage } from '../../../../components/seo/seo-marketing-page';
import { createSeoMetadata } from '../../../../lib/seo-pages';

export const metadata = createSeoMetadata('/integrations/commercetools');

export default function Page() {
  return <SeoMarketingPage path="/integrations/commercetools" />;
}
