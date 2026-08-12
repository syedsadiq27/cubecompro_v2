import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/3d-product-configurator');

export default function Page() {
  return <SeoMarketingPage path="/3d-product-configurator" />;
}
