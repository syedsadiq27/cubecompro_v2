import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Sofa on Stage — live demo',
  description:
    'Configure a sofa on the CubeCom Pro Stage — watch SKU, price, and inventory resolve from the same product graph.',
  alternates: {
    canonical: `${SITE_URL}/demo`,
  },
  openGraph: {
    title: `Sofa on Stage · ${SITE_NAME}`,
    description:
      'Interactive sofa demo proving Stage state → SKU, price, and inventory.',
    url: `${SITE_URL}/demo`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Sofa on Stage · ${SITE_NAME}`,
    description:
      'Interactive sofa demo proving Stage state → SKU, price, and inventory.',
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
