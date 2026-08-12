import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/product-configuration-api');

export default function Page() {
  return <SeoMarketingPage path="/product-configuration-api" />;
}
