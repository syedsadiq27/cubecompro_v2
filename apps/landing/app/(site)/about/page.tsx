import type { Metadata } from 'next';

import { AboutPage } from '@/components/about/about-page';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    'CubeCom Pro is product configuration infrastructure for visual commerce — why we exist, what we believe, and who is building it through Introfinity.',
};

export default function AboutRoute() {
  return <AboutPage />;
}
