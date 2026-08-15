import { Container, Eyebrow, Heading, Lede } from '@repo/ui';
import type { Metadata } from 'next';

import { Pricing } from '@/components/landing/pricing';
import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SolutionBridge } from '@/components/solutions/solution-bridge';
import { pricingFaqs } from '@/lib/content';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Pricing | ${SITE_NAME}`,
  description:
    'CubeCom Pro founding pricing for product configuration infrastructure — Starter, Pro, and Enterprise.',
};

const ROLLOUT_GUIDE = [
  {
    number: '01',
    tag: 'STARTER',
    title: 'Prove the model on one catalog',
    body: 'Use Starter when you need one product graph to validate rules, resolve, and embed before committing production commerce sync.',
  },
  {
    number: '02',
    tag: 'PRO',
    title: 'Operate configuration in production',
    body: 'Choose Pro when live storefronts need constraints, shareable state, commerce sync, and API access across a small set of graphs.',
  },
  {
    number: '03',
    tag: 'ENTERPRISE',
    title: 'Multi-brand / custom infrastructure',
    body: 'Go Enterprise for multiple brands, PIM/ERP ingestion, SSO, dedicated environments, SLAs, and implementation support.',
  },
];

export default function PricingPage() {
  return (
    <>
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

      <EditorialColumns
        eyebrow="How to choose"
        title="Which plan fits your rollout?"
        description="Same configuration model on every tier — capacity, surfaces, and operating depth change as you move from pilot to production to multi-brand."
        items={ROLLOUT_GUIDE}
        tone="soft"
      />

      <SolutionBridge
        title="Pricing is capacity around one product model — rules, resolve, and sellable state."
        href="/product-configurator"
        label="Product Configurator"
        tone="default"
      />

      <SeoFaq
        items={[...pricingFaqs]}
        title="Pricing FAQ"
        description="How graphs, 3D, API access, upgrades, and founding rates work — before you pick a tier."
        compact
        tone="canvas"
        ctaHref="/#contact"
        ctaLabel="Book a solution session"
      />

      <SeoCta
        title="Not sure where to start? Bring one product family."
        description="We’ll map your catalog, rules, and commerce path — then recommend Starter, Pro, or Enterprise."
        primaryHref="/#contact"
        primaryLabel="Book a solution session"
        secondaryHref="/demo"
        secondaryLabel="Open live demo"
      />
    </>
  );
}
