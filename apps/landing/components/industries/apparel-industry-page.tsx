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
import { ApparelConfiguratorProof } from './apparel-configurator-proof';

const PATH = '/industries/apparel';

const MECHANISM_STEPS = [
  {
    label: 'Choose merchandising options',
    detail:
      'Colorways, fits, and sizes update the scene. Invalid pairs are blocked in the graph.',
  },
  {
    label: 'Optional decoration',
    detail:
      'Logo Editor can place artwork on the same product identity when decoration changes what you sell.',
    accent: true,
  },
  {
    label: 'Resolve commerce',
    detail:
      'SKU, price, and inventory update so PDP, share links, and cart stay aligned.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'CONFIGURE',
    title: 'Colorways, fits, and sizes',
    body: 'Merchandising choices stay stockable — availability and fit rules rewrite illegal combinations before cart.',
  },
  {
    number: '02',
    tag: 'DECORATION',
    title: 'Placement on the same identity',
    body: 'Decoration attaches to the sellable state instead of living as an orphaned visual preset.',
  },
  {
    number: '03',
    tag: 'SELL',
    title: 'Embed, share, and hand off',
    body: 'Configurator on PDP, shareable configuration links, and a cart line that matches what the shopper configured.',
  },
];

const OUTCOMES = [
  {
    tag: 'STOCKABLE',
    title: 'Options that remain inventory-backed',
    description:
      'Color + fit + size resolve to SKU and inventory so merchandising never invents unsellable looks.',
  },
  {
    tag: 'RULES FIRST',
    title: 'Soft goods without tribal knowledge',
    description:
      'Fit and size constraints live on the graph — not in spreadsheets or floor-staff memory.',
  },
  {
    tag: 'CHECKOUT ALIGNED',
    title: 'Decoration that cart understands',
    description:
      'When decoration changes what you sell, it attaches to the same configuration identity as price and inventory.',
  },
];

export function ApparelIndustryPage() {
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
            src="/images/product-proof-demo.jpg"
            alt="Apparel configuration resolving merchandising choices to a stockable commerce state"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover select-none"
          />
        </div>
      </SolutionHero>

      <ProblemCompare
        eyebrow="Industry problem"
        title="Apparel options that stay stockable and sellable."
        description="Colorways are not visual presets — they are merchandising choices that must remain inventory-backed and cart-ready."
        traditionalLabel="Orphaned presets"
        traditionalTitle="Without CubeCom"
        traditionalBody="Colorways treated as visual presets with no commerce identity. Fit and size rules live in tribal knowledge. Decoration changes what you sell — but not what cart knows."
        cubecomLabel="Sellable state"
        cubecomTitle="With CubeCom"
        cubecomBody="Color + fit + size resolve to SKU, price, and inventory. Constraints rewrite illegal combinations before cart. Decoration attaches to the same sellable state."
        tone="soft"
      />

      <ApparelConfiguratorProof />

      <SignatureMechanism
        eyebrow="Apparel configuration flow"
        title="From colorway to cart line."
        description="Merchandising options, optional decoration, and commerce resolution share one product graph — so soft goods stay stockable."
        steps={MECHANISM_STEPS}
      />

      <EditorialColumns
        eyebrow="Surfaces"
        title="Soft goods need rules, not orphaned presets."
        description="Configure, decorate, and sell from the same configuration identity — whether the surface is 3D, 2D, or PDP embed."
        items={CAPABILITIES}
        tone="canvas"
      />

      <OutcomeGrid
        eyebrow="Commercial outcomes"
        title="What stockable apparel configuration unlocks."
        description="Keep merchandising flexible without inventing unsellable variants or disconnecting decoration from cart."
        items={OUTCOMES}
        tone="soft"
      />

      <SolutionBridge
        title="Apparel is one industry surface. Rules and variants start on the Product Configurator."
        href="/product-configurator"
        label="Product configurator"
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
