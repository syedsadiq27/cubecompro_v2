import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/industries/furniture');

export default function Page() {
  return <SeoMarketingPage path="/industries/furniture" />;
}
