import { ThreeDProductConfiguratorPage } from '@/components/solutions/three-d-product-configurator-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/3d-product-configurator');

export default function Page() {
  return <ThreeDProductConfiguratorPage />;
}
