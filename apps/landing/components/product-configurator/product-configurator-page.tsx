import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { SolutionBridge } from '@/components/solutions/solution-bridge';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { PcHero } from './pc-hero';
import { PcOptionGraph } from './pc-option-graph';
import { PcStatement } from './pc-statement';
import { PcVariantExplosion } from './pc-variant-explosion';
import { Section } from '@repo/ui';

const PATH = '/product-configurator';

const CAPABILITIES = [
  {
    number: '01',
    tag: 'DEPENDENCIES',
    title: 'Option dependencies',
    body: 'Choosing one value changes what else is legal — dimensions constrain fabrics, finishes constrain hardware.',
  },
  {
    number: '02',
    tag: 'EXCLUSIONS',
    title: 'Exclusion rules',
    body: 'Hard blocks for combinations you will never manufacture or stock, without deleting options from the master family.',
  },
  {
    number: '03',
    tag: 'AVAILABILITY',
    title: 'Conditional availability',
    body: 'Options appear, hide, or rewrite dynamically at runtime based on the shopper’s current selections.',
  },
  {
    number: '04',
    tag: 'FAMILIES',
    title: 'Product-family modeling',
    body: 'One graph for a full product line: shared attributes, per-SKU commerce references, and central rules governance.',
  },
];

const OUTCOMES = [
  {
    tag: 'PREVENT ERRORS',
    title: 'Prevent invalid configurations before cart',
    description: 'Impossible product combinations are rejected or rewritten in real time, preventing unfulfillable custom orders from reaching checkout.',
  },
  {
    tag: 'CATALOG EFFICIENCY',
    title: 'Eliminate static variant bloat',
    description: 'Stop pre-generating thousands of static SKU variations in your commerce platform. Define dimensions and resolve sellable states on demand.',
  },
  {
    tag: 'COMMERCE TRUTH',
    title: 'Instant price and inventory projection',
    description: 'Every valid selection map deterministically projects to the exact line item SKU, dynamic pricing tier, and inventory status.',
  },
];

export function ProductConfiguratorPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />

      {/* 1. Position / Hero */}
      <PcHero />

      {/* 2. Problem / Tension */}
      <PcVariantExplosion />

      {/* 3. Full-width Visual (Explanatory System Graphic) */}
      <FullWidthVisual
        src="/images/product-configurator-architecture-v2.jpg"
        alt="Storefront presentation, configuration runtime, and commerce outputs separated into connected architecture layers"
        eyebrow="System Architecture"
        title="Configuration logic separated from storefront presentation."
        description="A singular rules engine evaluates constraints before resolving to SKU, price, and inventory."
        tone="canvas"
      />

      {/* 4. Mechanism (Dark Signature Section) */}
      <PcStatement />

      {/* 5. Capabilities (Editorial Columns) */}
      <EditorialColumns
        eyebrow="Engine Capabilities"
        title="Stop managing combinations. Start modeling the product."
        description="Define dependencies, exclusions, and availability once. CubeCom resolves the legal sellable state at runtime."
        items={CAPABILITIES}
        tone="canvas"
      />

      {/* 6. Real Product Proof */}
      <Section tone="soft" spacing="default">
        <Section.Header
          eyebrow="Interactive Proof"
          title="Test the live option graph."
          description="Try selecting Brass legs with Charcoal fabric below — the engine automatically catches the exclusion and rewrites to a valid configuration."
        />
        <Section.Body>
          <div className="mx-auto max-w-4xl">
            <PcOptionGraph />
          </div>
        </Section.Body>
      </Section>

      {/* 7. Commercial & Operational Outcomes */}
      <OutcomeGrid
        eyebrow="Business Outcomes"
        title="What improves with configuration infrastructure."
        description="Move from brittle variant management to reliable runtime resolution."
        items={OUTCOMES}
        tone="canvas"
      />

      {/* 8. Decision Support */}
      <SolutionBridge
        title="Need the configuration to be visual? See the 3D Product Configurator."
        href="/3d-product-configurator"
        label="3D Product Configurator"
        tone="soft"
      />
      <SeoFaq
        items={body.faqs}
        title={body.faqTitle}
        description={body.faqDescription}
        compact
      />

      {/* 9. Final CTA */}
      <SeoCta {...body.cta} />
    </>
  );
}
