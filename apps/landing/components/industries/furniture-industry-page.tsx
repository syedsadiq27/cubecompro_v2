import Image from 'next/image';
import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { ProblemCompare } from '@/components/patterns/problem-compare';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from '@/components/solutions/solution-bridge';
import { SolutionHero } from '@/components/solutions/solution-hero';
import { FurnitureConfiguratorProof } from './furniture-configurator-proof';

const PATH = '/industries/furniture';

const MECHANISM_STEPS = [
  {
    label: 'Choose structure',
    detail:
      'Frame, size, or modular arrangement — invalid sizes never unlock incompatible finishes.',
  },
  {
    label: 'Choose materials',
    detail:
      'Fabrics and finishes update the scene and reprice only when the graph says the state is legal.',
    accent: true,
  },
  {
    label: 'Resolve & share',
    detail:
      'SKU, price, and inventory update. Sales can reopen the same configuration from a link — including showroom follow-ups.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'UPHOLSTERY',
    title: 'Sectionals and modular seating',
    body: 'Frames, fabrics, legs, and cushions with fabric compatibility and grade rules on one graph.',
  },
  {
    number: '02',
    tag: 'CASE & TABLES',
    title: 'Chairs, dining, and cabinets',
    body: 'Top/base combinations, finishes, and hardware options that stay manufacturable.',
  },
  {
    number: '03',
    tag: 'FULFILLMENT',
    title: 'Dimensions and ops constraints',
    body: 'Packaging limits, BOM hints, and custom-vs-stocked variants resolve with the look — not after checkout.',
  },
];

const OUTCOMES = [
  {
    tag: 'AR SURFACE',
    title: 'Same configuration in room placement',
    description:
      'AR on supported devices consumes the identical graph state shoppers and sales already resolved.',
  },
  {
    tag: 'CUSTOM ORDERS',
    title: 'Custom still starts from a valid state',
    description:
      'Deep BOM and ERP sync vary by engagement — the product graph is designed so those surfaces inherit sellable state.',
  },
  {
    tag: 'CHANNEL PARITY',
    title: 'Showroom and web stay aligned',
    description:
      'Shareable configuration identity keeps quotes, PDPs, and follow-ups on one commerce truth beside Shopify or composable checkout.',
  },
];

export function FurnitureIndustryPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />

      <SolutionHero
        eyebrow={page.eyebrow}
        title={page.h1}
        lead={page.lead}
        primaryCta={page.primaryCta}
        secondaryCta={page.secondaryCta}
        visualPriority
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--ink)]/15 bg-[var(--surface-pure)] shadow-[0_24px_56px_-16px_rgba(14,15,18,0.2)]">
          <Image
            src="/images/three-d-configurator-hero-v2.jpg"
            alt="Resolved modular sofa with material and component choices locked to a valid commerce state"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover select-none"
          />
        </div>
      </SolutionHero>

      <ProblemCompare
        eyebrow="Industry problem"
        title="Furniture variation without catalog explosion."
        description="Every fabric × frame × leg combination does not need a photoshoot — and invalid looks should never reach the PDP."
        traditionalLabel="Catalog photography"
        traditionalTitle="Without CubeCom"
        traditionalBody="Every fabric × frame × leg combination becomes a photoshoot. Invalid looks reach the PDP before ops can stop them. Showroom quotes and web PDPs disagree on what is sellable."
        cubecomLabel="Configuration infrastructure"
        cubecomTitle="With CubeCom"
        cubecomBody="Legal looks render from materials and models. Constraints block incompatible combinations before cart. Shareable state keeps showroom and web on one graph."
        tone="soft"
      />

      <FurnitureConfiguratorProof />

      <SignatureMechanism
        eyebrow="Configuration flow"
        title="Structure → materials → sellable state."
        description="CubeCom is not a sofa viewer. It is configuration infrastructure for furniture brands that need every valid look to remain a fulfillable commerce state."
        steps={MECHANISM_STEPS}
      />

      <EditorialColumns
        eyebrow="Product types"
        title="Upholstery, case goods, and fulfillment constraints."
        description="The demo proves the loop on a sofa. Production catalogs need the same graph thinking across sectionals, chairs, tables, and case goods."
        items={CAPABILITIES}
        tone="canvas"
      />

      <OutcomeGrid
        eyebrow="Surfaces & outcomes"
        title="AR and custom orders still start from the same graph."
        description="AR placement and deep BOM/ERP sync vary by engagement. The product graph is designed so those surfaces consume the same configuration state."
        items={OUTCOMES}
        tone="soft"
      />

      <SolutionBridge
        title="Furniture is one industry surface. The underlying rules and 3D model come from the Product Configurator and 3D Product Configurator."
        href="/3d-product-configurator"
        label="3D product configurator"
        tone="soft"
      />
      <SeoFaq
        items={body.faqs}
        title={body.faqTitle}
        description={body.faqDescription}
        compact
      />

      <SeoCta {...body.cta} />
    </>
  );
}
