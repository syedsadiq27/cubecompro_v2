import { HeadlessProductConfiguratorPage } from '@/components/solutions/headless-product-configurator-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/headless-product-configurator');

export default function Page() {
  return <HeadlessProductConfiguratorPage />;
}
