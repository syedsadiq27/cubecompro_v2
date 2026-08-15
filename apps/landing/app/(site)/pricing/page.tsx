import { Container, Eyebrow, Heading, Lede } from '@repo/ui';
import type { Metadata } from 'next';

import { Pricing } from '@/components/landing/pricing';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Pricing | ${SITE_NAME}`,
  description:
    'CubeCom Pro founding pricing for product configuration infrastructure — Starter, Pro, and Enterprise.',
};

export default function PricingPage() {
  return (
    <div className="border-b border-[var(--line)]">
      <Container className="pt-12 md:pt-16">
        <Eyebrow>Pricing</Eyebrow>
        <Heading as="h1" variant="pageWide" spacing="eyebrow">
          Plans for configuration infrastructure
        </Heading>
        <Lede className="max-w-2xl">
          Founding rates while we’re early. Lock in before regular pricing —
          decorations and image generation stay modular.
        </Lede>
      </Container>
      <Pricing compact />
    </div>
  );
}
