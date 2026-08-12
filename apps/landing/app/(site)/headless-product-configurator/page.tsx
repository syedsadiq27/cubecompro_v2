import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/headless-product-configurator');

export default function Page() {
  return <SeoMarketingPage path="/headless-product-configurator" />;
}
