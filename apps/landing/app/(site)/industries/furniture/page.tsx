import { FurnitureIndustryPage } from '@/components/industries/furniture-industry-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/industries/furniture');

export default function Page() {
  return <FurnitureIndustryPage />;
}
