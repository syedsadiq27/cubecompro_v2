import { ProductConfiguratorPage } from '@/components/product-configurator/product-configurator-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/product-configurator');

export default function Page() {
  return <ProductConfiguratorPage />;
}
