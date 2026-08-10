import { SeoMarketingPage } from '../../../../components/seo/seo-marketing-page';
import { createSeoMetadata } from '../../../../lib/seo-pages';

export const metadata = createSeoMetadata('/industries/apparel');

export default function Page() {
  return <SeoMarketingPage path="/industries/apparel" />;
}
