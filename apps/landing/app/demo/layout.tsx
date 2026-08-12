import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Live sofa demo',
  description:
    'Configure a sofa in 3D and watch SKU, price, and inventory resolve from the same product graph — CubeCom Pro live demo.',
  alternates: {
    canonical: `${SITE_URL}/demo`,
  },
  openGraph: {
    title: `Live sofa demo · ${SITE_NAME}`,
    description:
      'Interactive sofa demo proving configuration state → SKU, price, and inventory.',
    url: `${SITE_URL}/demo`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Live sofa demo · ${SITE_NAME}`,
    description:
      'Interactive sofa demo proving configuration state → SKU, price, and inventory.',
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
