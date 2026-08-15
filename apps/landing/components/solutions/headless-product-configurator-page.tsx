import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { MediaSlot } from '@/components/patterns/media-slot';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { ProblemCompare } from '@/components/patterns/problem-compare';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { HeadlessStatePipeline } from './headless-state-pipeline';
import { SolutionBridge } from './solution-bridge';
import { SolutionHero } from './solution-hero';
import { Section } from '@repo/ui';

const PATH = '/headless-product-configurator';

const MECHANISM_STEPS = [
  {
    label: 'Custom Frontend',
    detail: 'Your React, Next.js, or Vue UI captures shopper option selections.',
  },
  {
    label: 'CubeCom Runtime',
    detail: 'Evaluates constraint graph, blocks invalid combinations, and resolves valid state.',
    accent: true,
  },
  {
    label: 'Commerce Projection',
    detail: 'Projects deterministic SKU, calculated price, and inventory directly to cart or OMS.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'PRESENTATION FREEDOM',
    title: 'Complete UI ownership',
    body: 'Build custom configurator components in your design system without third-party iframe or plugin constraints.',
  },
  {
    number: '02',
    tag: 'CENTRAL GOVERNANCE',
    title: 'Single rules authority',
    body: 'Product dependencies and exclusions live in one engine, preventing rule drift across multiple storefronts.',
  },
  {
    number: '03',
    tag: 'STATE RESOLUTION',
    title: 'Runtime constraint evaluation',
    body: 'Validate complex multi-dimensional choices on the fly, guaranteeing every selection resolves to a legal state.',
  },
  {
    number: '04',
    tag: 'OMNICHANNEL TRUTH',
    title: 'Multi-surface consistency',
    body: 'Share the identical configuration logic across web storefronts, in-store sales associate tools, and mobile apps.',
  },
];

const OUTCOMES = [
  {
    tag: 'INTEGRATION AGILITY',
    title: 'Faster integration through a shared contract',
    description: 'Frontend developers query simple, structured endpoints instead of reimplementing hundreds of custom validation rules.',
  },
  {
    tag: 'ZERO CODE DRIFT',
    title: 'Eliminate duplicated frontend logic',
    description: 'When manufacturing rules or option dependencies change in CubeCom, every frontend updates immediately without code deployments.',
  },
  {
    tag: 'CLEAN ARCHITECTURE',
    title: 'Clear separation of concerns',
    description: 'Frontend teams focus on customer experience; merchandising teams control catalog logic and commerce mappings.',
  },
];

export function HeadlessProductConfiguratorPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />

      {/* 1. Position / Hero */}
      <SolutionHero
        eyebrow={page.eyebrow}
        title="Keep your frontend. Run configuration as infrastructure."
        lead="You own presentation and customer experience. CubeCom owns configuration truth — product graph, constraints, and deterministic commerce resolve."
        primaryCta={{ href: '/#contact', label: 'Discuss your architecture' }}
        secondaryCta={{
          href: '/product-configuration-api',
          label: 'See the configuration API',
        }}
        visualPriority
      >
        <MediaSlot
          src="/images/headless-architecture-hero.png"
          alt="Headless storefront connected to CubeCom configuration runtime and commerce outputs"
          aspectRatio="aspect-[16/9]"
          priority
          className="rounded-2xl border border-[var(--ink)]/15"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </SolutionHero>

      {/* 2. Problem / Tension */}
      <ProblemCompare
        eyebrow="Architectural Tension"
        title="Headless commerce still needs a source of configuration truth."
        description="Composable stacks separate UI, CMS, checkout, and ERP. Without a dedicated configuration runtime, product logic ends up hardcoded across multiple frontends."
        traditionalLabel="Hardcoded Frontends"
        traditionalTitle="Without CubeCom"
        traditionalBody="Rules copied directly into React components drift over time. Merchandising updates require frontend deployments, and mobile or sales tools enforce different logic than the web."
        cubecomLabel="Headless Runtime"
        cubecomTitle="With CubeCom"
        cubecomBody="One centralized graph powers every surface. Frontends stay light, querying the runtime to validate choices and resolve deterministic line items."
        tone="soft"
      />

      {/* 3. Full-width Visual (Explanatory System Graphic) */}
      <FullWidthVisual
        src="/images/headless-architecture-hero.png"
        alt="Headless product configuration architecture and runtime truth"
        eyebrow="System Architecture"
        title="Frontend presentation decoupled from configuration logic."
        description="A lightweight runtime sits between your composable storefront and your commerce platform."
        tone="canvas"
      />

      {/* 4. Mechanism (Dark Signature Section) */}
      <SignatureMechanism
        eyebrow="Runtime Architecture"
        title="One configuration runtime between experience and commerce."
        description="Frontend → CubeCom Runtime → Valid State → Commerce Projection."
        steps={MECHANISM_STEPS}
      />

      {/* 5. Capabilities (Editorial Columns) */}
      <EditorialColumns
        eyebrow="Headless Capabilities"
        title="Engineered for modern composable architecture."
        description="Connect any frontend framework to a high-performance configuration runtime."
        items={CAPABILITIES}
        tone="canvas"
      />

      {/* 6. Real Product Proof — runtime pipeline only */}
      <Section tone="soft" spacing="default">
        <Section.Header
          eyebrow="Deterministic Handoff Proof"
          title="See the runtime state pipeline in action."
          description="How customer intent translates from a custom Next.js storefront to verified line items in Shopify checkout."
        />
        <Section.Body>
          <div className="mx-auto max-w-4xl">
            <HeadlessStatePipeline />
          </div>
        </Section.Body>
      </Section>

      {/* 7. Commercial & Operational Outcomes */}
      <OutcomeGrid
        eyebrow="Engineering & Merchandising Outcomes"
        title="The benefits of headless configuration infrastructure."
        description="Empower engineering agility while giving merchandising teams full control."
        items={OUTCOMES}
        tone="canvas"
      />

      {/* 8. Decision Support */}
      <SolutionBridge
        title="Need to interact with this runtime directly over GraphQL or REST? See the Product Configuration API."
        href="/product-configuration-api"
        label="Product Configuration API"
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
