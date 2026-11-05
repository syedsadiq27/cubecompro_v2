import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { ProblemCompare } from '@/components/patterns/problem-compare';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { OwnershipDiagram } from '@/components/integrations/ownership-diagram';
import { ShopifyIntegrationProof } from '@/components/integrations/shopify-integration-proof';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from '@/components/solutions/solution-bridge';
import { SolutionHero } from '@/components/solutions/solution-hero';
import { Typography } from '@repo/ui';

const PATH = '/integrations/shopify';

const MECHANISM_STEPS = [
  {
    label: 'Shopper choice',
    detail:
      'Options and constraints are modeled in CubeCom, separate from fragile theme logic.',
  },
  {
    label: 'CubeCom resolve',
    detail:
      'Valid configuration state resolves to the Shopify variant ID and SKU you have mapped.',
    accent: true,
  },
  {
    label: 'Shopify cart (planned)',
    detail:
      'Handoff to Shopify cart is planned, not available yet. Checkout, payments, and orders stay on Shopify.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'CATALOG OWNERSHIP',
    title: 'Catalog stays in Shopify',
    body: 'Inventory, collections, and variant identity remain Shopify-native. CubeCom does not replace your product catalog.',
  },
  {
    number: '02',
    tag: 'RULES RUNTIME',
    title: 'Configuration rules in CubeCom',
    body: 'Dependencies, exclusions, and grades live on the product graph so invalid combinations are blocked during configuration.',
  },
  {
    number: '03',
    tag: 'OPTIONAL 3D',
    title: 'Visual when it helps',
    body: 'Add 3D or decoration experiences where they improve certainty — still resolving to the same mapped Shopify variant.',
  },
  {
    number: '04',
    tag: 'CART HANDOFF',
    title: 'Checkout stays Shopify',
    body: 'Checkout, payments, and orders stay on Shopify, with no parallel checkout. Automated cart handoff is planned, not available yet.',
  },
];

const OUTCOMES = [
  {
    tag: 'CATALOG SCALE',
    title: 'Keep option rules in one place',
    description:
      'Model dependencies and exclusions once instead of encoding them in theme logic. Today, each sellable configuration still maps to a Shopify variant.',
  },
  {
    tag: 'CHECKOUT TRUST',
    title: 'Keep Shopify checkout',
    description:
      'CubeCom stops at the sellable variant, so once cart handoff ships, shoppers finish on the checkout and payment stack you already run.',
  },
  {
    tag: 'ONE STATE',
    title: 'One resolved configuration state',
    description:
      'Rules and variant mapping live on one product graph, so a valid selection always resolves to the same mapped variant.',
  },
];

export function ShopifyIntegrationPage() {
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
        <div className="space-y-3">
          {page.badge ? (
            <Typography variant="mono" tone="muted">
              {page.badge}
            </Typography>
          ) : null}
          <OwnershipDiagram
            leftTitle="Shopify keeps"
            leftItems={[
              'Catalog & inventory',
              'Cart & checkout',
              'Orders & payments',
            ]}
            rightTitle="CubeCom adds"
            rightItems={[
              'Configuration rules',
              '3D / decoration experiences',
              'State → sellable variant',
            ]}
          />
        </div>
      </SolutionHero>

      <ProblemCompare
        eyebrow="Integration boundary"
        title="Shopify keeps checkout. CubeCom resolves the product decision."
        description={page.reframe}
        traditionalLabel="Flat option matrix"
        traditionalTitle="Without CubeCom"
        traditionalBody="Complex furniture or soft-goods rules overflow native Shopify options. Merchants explode variants, photograph every combination, or encode fragile theme logic that drifts from inventory truth."
        cubecomLabel="Beside the PDP"
        cubecomTitle="Intended CubeCom pattern"
        cubecomBody="Configure in CubeCom and resolve to a variant ID / SKU you already sell. Store connection, import, and mapping are in early access; cart handoff is planned. Not an installable App Store listing yet."
        tone="soft"
      />

      <FullWidthVisual
        src="/images/mechanism-state-pipeline-v2.jpg"
        alt="Shopper choice flowing through CubeCom resolution into a Shopify cart line while checkout stays on Shopify"
        eyebrow="Intended integration flow"
        title="Shopify PDP → CubeCom configuration runtime → Shopify cart."
        description="Storefront presentation and checkout remain Shopify. CubeCom owns the configuration decision in the middle. The cart step is planned."
        tone="canvas"
      />

      <SignatureMechanism
        eyebrow="Shopper loop"
        title="Shopper choice → CubeCom resolve → Shopify variant → Cart (planned)."
        description="Connecting a store, importing products, and resolving to mapped variants work in early access. Cart handoff is the remaining step."
        steps={MECHANISM_STEPS}
      />

      <EditorialColumns
        eyebrow="What CubeCom owns vs Shopify"
        title="Clear ownership across the shopper journey."
        description="Catalog and checkout stay Shopify-native. Configuration rules, optional 3D, and resolved state sit in CubeCom."
        items={CAPABILITIES}
        tone="canvas"
      />

      <ShopifyIntegrationProof />

      <OutcomeGrid
        eyebrow="Commercial outcomes"
        title="Why the boundary matters for Shopify brands."
        description="Scale configurable catalogs without abandoning the checkout merchants already trust."
        items={OUTCOMES}
        tone="soft"
      />

      <SolutionBridge
        title="Need the visual commerce model Shopify merchants usually search for? See the 3D Product Configurator."
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
