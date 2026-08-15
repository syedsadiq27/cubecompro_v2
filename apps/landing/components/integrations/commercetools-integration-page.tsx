import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { ProblemCompare } from '@/components/patterns/problem-compare';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { CommercetoolsIntegrationProof } from '@/components/integrations/commercetools-integration-proof';
import { OwnershipDiagram } from '@/components/integrations/ownership-diagram';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from '@/components/solutions/solution-bridge';
import { SolutionHero } from '@/components/solutions/solution-hero';
import { Typography } from '@repo/ui';

const PATH = '/integrations/commercetools';

const MECHANISM_STEPS = [
  {
    label: 'Frontend state',
    detail:
      'Your composable storefront captures option selections in your own UI and design system.',
  },
  {
    label: 'Validate → Resolve',
    detail:
      'CubeCom evaluates constraints and resolves a valid configuration identity with commerce fields.',
    accent: true,
  },
  {
    label: 'commercetools cart',
    detail:
      'Projection becomes a commercetools line item / cart update. Catalog, order, and OMS stay on commercetools.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'COMPOSABLE UI',
    title: 'Frontend ownership stays yours',
    body: 'Build configuration UX in your design system. CubeCom is infrastructure behind the storefront — not a forced widget skin.',
  },
  {
    number: '02',
    tag: 'SHARED TRUTH',
    title: 'One configuration runtime',
    body: 'Product graph and constraints live once, so web, apps, and sales tools do not reimplement divergent rules.',
  },
  {
    number: '03',
    tag: 'COMMERCE PROJECTION',
    title: 'Sellable state for commercetools',
    body: 'Resolved SKU, price, and inventory project into cart and order flows commercetools already runs.',
  },
  {
    number: '04',
    tag: 'API / HEADLESS',
    title: 'Headless-first integration',
    body: 'Primary pattern for early access: call configuration APIs from your stack, then hand off to commercetools primitives.',
  },
];

const OUTCOMES = [
  {
    tag: 'NO RULE DRIFT',
    title: 'No duplicated frontend rules',
    description:
      'Stop copying constraint matrices into React components that drift from catalog and OMS truth.',
  },
  {
    tag: 'CHANNEL PARITY',
    title: 'One runtime across channels',
    description:
      'The same resolve path serves storefront, mobile, and associate tools while commercetools remains the commerce system of record.',
  },
  {
    tag: 'CLEAN COMPOSABLE',
    title: 'Cleaner composable architecture',
    description:
      'Clear split: your frontend, CubeCom configuration truth, commercetools catalog/cart/order — without a faux marketplace connector.',
  },
];

export function CommercetoolsIntegrationPage() {
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
            leftTitle="commercetools keeps"
            leftItems={[
              'Catalog & cart',
              'Your frontend & design system',
              'OMS / fulfillment',
            ]}
            rightTitle="CubeCom adds"
            rightItems={[
              'Constraint-aware configuration',
              'Optional 3D experiences',
              'Shareable configuration state',
            ]}
          />
        </div>
      </SolutionHero>

      <ProblemCompare
        eyebrow="Integration boundary"
        title="Configuration beside commercetools — not instead of it."
        description={page.reframe}
        traditionalLabel="Rules in the frontend"
        traditionalTitle="Without CubeCom"
        traditionalBody="Composable teams hardcode option logic across storefronts. Validity, pricing, and cart projection diverge — and every channel reimplements the same fragile matrix."
        cubecomLabel="Configuration infrastructure"
        cubecomTitle="Intended CubeCom pattern"
        cubecomBody="commercetools remains catalog, cart, and checkout. CubeCom owns configuration rules and optional 3D, then hands a resolved SKU / variant into commercetools line items. Early access architecture — not a turnkey marketplace connector."
        tone="soft"
      />

      <FullWidthVisual
        src="/images/headless-architecture-hero.png"
        alt="Custom storefront connected to CubeCom configuration runtime projecting into commercetools product, cart, and order flows"
        eyebrow="Composable architecture"
        title="Custom storefront → CubeCom runtime → commercetools product / cart / order."
        description="Your frontend stays yours. CubeCom resolves configuration state. commercetools remains the commerce system of record."
        tone="canvas"
      />

      <SignatureMechanism
        eyebrow="Runtime pipeline"
        title="Frontend state → Validate → Resolve → Commerce projection → commercetools cart."
        description="Architecture guidance for early-access engagements — ship the contract before expecting a packaged connector."
        steps={MECHANISM_STEPS}
      />

      <EditorialColumns
        eyebrow="Composable capabilities"
        title="Built for teams that already own the storefront."
        description="CubeCom attaches as configuration infrastructure beside commercetools — API and headless first."
        items={CAPABILITIES}
        tone="canvas"
      />

      <CommercetoolsIntegrationProof />

      <OutcomeGrid
        eyebrow="Architectural outcomes"
        title="What a clean commercetools boundary unlocks."
        description="Keep composable ownership clear while configuration truth stops leaking into every frontend."
        items={OUTCOMES}
        tone="soft"
      />

      <SolutionBridge
        title="This pattern sits on the Headless Product Configurator and Configuration API."
        href="/headless-product-configurator"
        label="Headless product configurator"
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
