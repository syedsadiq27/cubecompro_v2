import { SolutionsHubPage } from '@/components/solutions/solutions-hub-page';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Solutions | ${SITE_NAME}`,
    description:
      'One configuration engine. Every way you sell — rules, 3D, headless, and API paths that converge on the same sellable product state.',
    alternates: { canonical: `${SITE_URL}/solutions` },
    openGraph: {
      title: `Solutions | ${SITE_NAME}`,
      description:
        'One configuration engine. Every way you sell — rules, visual, headless, and API.',
      url: `${SITE_URL}/solutions`,
    },
  };

export default function SolutionsPage() {
  return <SolutionsHubPage />;
}
