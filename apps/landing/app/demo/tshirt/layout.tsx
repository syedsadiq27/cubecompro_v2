import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'T-shirt configurator demo',
  description:
    'Configure a t-shirt in 3D with color, fit, and size rules that resolve to SKU, price, and inventory.',
  alternates: {
    canonical: `${SITE_URL}/demo/tshirt`,
  },
  openGraph: {
    title: `T-shirt configurator demo · ${SITE_NAME}`,
    description:
      'Live tee configurator proving configuration rules → commerce sync.',
    url: `${SITE_URL}/demo/tshirt`,
    type: 'website',
  },
};

export default function TshirtDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
