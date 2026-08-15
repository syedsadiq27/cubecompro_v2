import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { ProblemCompare } from '@/components/patterns/problem-compare';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from './solution-bridge';
import { SolutionHero } from './solution-hero';
import { ThreeDHeroDemo } from './three-d-hero-demo';
import { Section } from '@repo/ui';
import Image from 'next/image';

const PATH = '/3d-product-configurator';

const MECHANISM_STEPS = [
  {
    label: 'Visual Choice',
    detail: 'Shoppers customize materials, colors, and parts directly in the 3D scene.',
  },
  {
    label: 'Valid Scene State',
    detail: 'Rules engine verifies legal combinations and blocks unmanufacturable looks in-scene.',
    accent: true,
  },
  {
    label: 'Commerce Lock',
    detail: 'The scene state projects to an exact purchasable line item SKU, price, and inventory.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'REAL-TIME PBR',
    title: 'Real-time materials and finishes',
    body: 'Photoreal lighting, physically-based shaders, and accurate microtextures update instantly with zero reload latency.',
  },
  {
    number: '02',
    tag: 'GEOMETRY & PARTS',
    title: 'Dynamic modular assembly',
    body: 'Swap legs, add modules, or alter spatial dimensions while maintaining geometric constraint integrity.',
  },
  {
    number: '03',
    tag: 'RULE ENFORCEMENT',
    title: 'In-scene invalid combination blocking',
    body: 'Combinations you cannot manufacture are blocked before they render as an unfulfillable commercial promise.',
  },
  {
    number: '04',
    tag: 'COMMERCE ALIGNMENT',
    title: 'Visual state equals cart state',
    body: 'Every visual state resolves directly to SKU, price tier, and inventory. What shoppers see is what they buy.',
  },
];

const OUTCOMES = [
  {
    tag: 'PURCHASE CERTAINTY',
    title: 'Eliminate visual-to-cart disconnect',
    description: 'Shoppers inspect every detail in 3D, knowing the exact configuration in the viewer is the physical item shipped.',
  },
  {
    tag: 'OPERATIONAL CLARITY',
    title: 'Prevent unfulfillable custom orders',
    description: 'Rules engine guardrails prevent shoppers from assembling combinations your manufacturing line cannot produce.',
  },
  {
    tag: 'UNIFIED ASSETS',
    title: 'One 3D model across all surfaces',
    description: 'Reuse the same 3D assets for interactive PDPs, spatial room placement, and headless visual commerce applications.',
  },
];

export function ThreeDProductConfiguratorPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />

      {/* 1. Position / Hero */}
      <SolutionHero
        eyebrow={page.eyebrow}
        title="Configure in 3D. Buy what you see."
        lead="Let shoppers customize materials, parts, and options in real time while every visual state stays locked to a valid SKU, price, inventory, and cart."
        primaryCta={{ href: '/demo', label: 'Open live demo' }}
        secondaryCta={{ href: '/#contact', label: 'Book a solution session' }}
        visualPriority
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--ink)]/15 bg-[var(--surface-pure)] shadow-[0_24px_56px_-16px_rgba(14,15,18,0.2)]">
          <Image
            src="/images/three-d-configurator-hero-v2.jpg"
            alt="A resolved modular sofa with physical material and component choices connected to its validated visual state"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover select-none"
          />
        </div>
      </SolutionHero>

      {/* 2. Problem / Tension */}
      <ProblemCompare
        eyebrow="The 3D Disconnect"
        title="A 3D viewer shows the product. A 3D configurator sells it."
        description="Traditional 3D viewers let shoppers orbit a model without tying the visuals to a sellable commerce state."
        traditionalLabel="Standard 3D Viewer"
        traditionalTitle="Without CubeCom"
        traditionalBody="Material swaps look impressive in the browser, but the cart still guesses a default SKU. Unfulfillable visual combinations slip through, leading to customer disappointment at checkout."
        cubecomLabel="Visual Commerce Stage"
        cubecomTitle="With CubeCom"
        cubecomBody="Every material swap and geometry change resolves through the configuration engine. What the shopper sees is guaranteed to match the exact SKU, price, and inventory passed to checkout."
        tone="soft"
      />

      {/* 3. Full-width Visual (Explanatory System Graphic) */}
      <FullWidthVisual
        src="/images/three-d-configurator-architecture-v2.jpg"
        alt="Material and component choices passing through one validated 3D scene into product identity, price, inventory, and cart outputs"
        eyebrow="Visual Architecture"
        title="Interactive 3D geometry backed by singular rules truth."
        description="Render real-time materials and modular dimensions while maintaining strict commerce synchronization."
        tone="canvas"
      />

      {/* 4. Mechanism (Dark Signature Section) */}
      <SignatureMechanism
        eyebrow="Core Transformation"
        title="From visual customization to guaranteed commerce handoff."
        description="CubeCom connects WebGL shader state directly to rules resolution and line item projection."
        steps={MECHANISM_STEPS}
      />

      {/* 5. Capabilities (Editorial Columns) */}
      <EditorialColumns
        eyebrow="3D Engine Capabilities"
        title="Engineered for high-fidelity visual commerce."
        description="Deliver fast, interactive 3D experiences across mobile and desktop without sacrificing catalog precision."
        items={CAPABILITIES}
        tone="canvas"
      />

      {/* 6. Real Product Proof */}
      <Section tone="soft" spacing="default">
        <Section.Header
          eyebrow="Interactive Proof"
          title="Test real-time 3D state synchronization."
          description="Switch upholstery and wood finishes in the live WebGL scene below — notice how the SKU, price, and inventory update deterministically."
        />
        <Section.Body>
          <div className="mx-auto max-w-5xl">
            <ThreeDHeroDemo />
          </div>
        </Section.Body>
      </Section>

      {/* 7. Commercial & Operational Outcomes */}
      <OutcomeGrid
        eyebrow="Business Outcomes"
        title="The impact of verified 3D visual commerce."
        description="Improve customer certainty and eliminate custom manufacturing errors."
        items={OUTCOMES}
        tone="canvas"
      />

      {/* 8. Decision Support */}
      <SolutionBridge
        title="3D is one surface. The underlying rules and commerce state come from the Product Configurator."
        href="/product-configurator"
        label="Product Configurator"
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
