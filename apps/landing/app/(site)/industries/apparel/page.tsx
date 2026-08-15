import { ApparelIndustryPage } from '@/components/industries/apparel-industry-page';
import { createSeoMetadata } from '@/lib/seo-pages';

export const metadata = createSeoMetadata('/industries/apparel');

export default function Page() {
  return <ApparelIndustryPage />;
}
