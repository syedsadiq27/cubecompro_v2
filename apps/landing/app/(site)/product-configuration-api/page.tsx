import { ProductConfigurationApiPage } from '@/components/solutions/product-configuration-api-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/product-configuration-api');

export default function Page() {
  return <ProductConfigurationApiPage />;
}
