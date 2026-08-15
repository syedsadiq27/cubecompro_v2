import { Card, Typography } from '@repo/ui';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from './solution-bridge';
import { SolutionCompare } from './solution-compare';
import { SolutionHero } from './solution-hero';
import { SolutionSection } from './solution-section';
import { ThreeDHeroDemo } from './three-d-hero-demo';

const PATH = '/3d-product-configurator';

const WITHOUT = [
  'Material swaps without a sellable state',
  'Looks the cart cannot fulfill',
  'A WebGL viewer with no commerce contract',
  'Shopper confidence that dies at checkout',
];

const WITH = [
  'Real-time materials, parts, and geometry',
  'Invalid visual combinations blocked in-scene',
  'Scene state synchronized with commerce state',
  'What they see is what they can buy',
];

export function ThreeDProductConfiguratorPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />
      <SolutionHero
        eyebrow={page.eyebrow}
        title="Configure in 3D. Buy what you see."
        lead="Let shoppers change materials, parts, and options in real time while every visual state stays tied to a valid SKU, price, inventory, and cart."
        primaryCta={{ href: '/demo', label: 'Open live demo' }}
        secondaryCta={{ href: '/#contact', label: 'Book a solution session' }}
      >
        <ThreeDHeroDemo />
      </SolutionHero>

      <SolutionSection
        title="Shoppers need confidence. Viewers only give orbit."
        description="A 3D viewer shows the product. A 3D product configurator makes every visual choice sellable."
        tone="muted"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              title: 'Pretty, not sellable',
              body: 'Materials look right in the scene while checkout still picks a default variant.',
            },
            {
              title: 'Invalid looks ship',
              body: 'Shoppers assemble combinations you cannot manufacture — and only find out later.',
            },
            {
              title: 'Confidence breaks at cart',
              body: 'If the bag does not match the look, the 3D experience was decoration.',
            },
          ].map((item) => (
            <Card
              as="article"
              key={item.title}
              variant="soft"
              padding="tight"
            >
              <Typography variant="titleSm">{item.title}</Typography>
              <Typography variant="support" className="mt-2">
                {item.body}
              </Typography>
            </Card>
          ))}
        </div>
      </SolutionSection>

      <SolutionSection
        title="Every visual choice should remain buyable."
        description="When the shopper changes the product, CubeCom updates the scene and the sellable state together."
      >
        <ol className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          {[
            'Visual Choice',
            'Scene Update',
            'Purchasable Identity',
          ].map((step, index, all) => (
            <li key={step} className="flex flex-col items-stretch md:flex-row md:items-center md:gap-2">
              <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-center text-[15px] font-medium text-[var(--ink)] md:min-w-[9rem]">
                {step}
              </div>
              {index < all.length - 1 ? (
                <span className="py-1 text-center text-[var(--text-muted)] md:py-0" aria-hidden>
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['SKU', 'Price', 'Inventory', 'Cart'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-3 py-2.5 text-center font-mono text-xs text-[var(--ink)]"
            >
              {item}
            </div>
          ))}
        </div>
        <ol className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Real-time scene change',
              body: 'Materials, colors, geometry, and parts update as shoppers configure — invalid looks are blocked before they render as a sellable promise.',
            },
            {
              step: '02',
              title: 'Scene state stays honest',
              body: 'What appears in the viewer is the same configuration identity that will resolve to commerce — not a decorative fork.',
            },
            {
              step: '03',
              title: 'Cart matches the look',
              body: 'SKU, price, and inventory follow the visual state so checkout is the product they configured.',
            },
          ].map((item) => (
            <Card
              as="li"
              key={item.step}
              variant="surface"
              padding="tight"
            >
              <Typography variant="code" tone="strong">
                {item.step}
              </Typography>
              <Typography variant="titleSm" className="mt-2">
                {item.title}
              </Typography>
              <Typography variant="support" className="mt-2">
                {item.body}
              </Typography>
            </Card>
          ))}
        </ol>
      </SolutionSection>

      <SolutionSection
        title="Change the product. The commerce state follows."
        description="Selecting Brass updates the legs in 3D — and the sellable state follows."
        tone="muted"
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {[
            {
              label: 'Visual change',
              body: 'Legs material updates in the scene immediately.',
            },
            {
              label: 'Scene state',
              body: 'Configuration identity stays tied to what is on screen.',
            },
            {
              label: 'Commerce follow',
              body: 'SKU, price, and inventory resolve for that look.',
            },
          ].map((col) => (
            <Card
              as="article"
              key={col.label}
              variant="soft"
              padding="tight"
            >
              <Typography variant="label">{col.label}</Typography>
              <Typography variant="bodyStrong" className="mt-3">
                {col.body}
              </Typography>
            </Card>
          ))}
        </div>
      </SolutionSection>

      <SolutionSection
        title="A viewer shows the product. A configurator sells it."
        tone="ink"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-5">
            <Typography variant="label" tone="ink">
              Ordinary 3D viewer
            </Typography>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>Orbit and material swap</li>
              <li>No guaranteed sellable state</li>
              <li>Cart still guesses a variant</li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-5">
            <Typography variant="label" tone="ink">
              CubeCom 3D configurator
            </Typography>
            <ul className="mt-4 space-y-2 text-sm text-white">
              <li>Visual configuration with blocked invalid looks</li>
              <li>Scene state synchronized with commerce state</li>
              <li>Cart handoff for the identity on screen</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-sm text-white/55">
          Rules and catalog modeling live in the Product Configurator engine.
          This page is the shopper-facing visual solution powered by that
          engine.
        </p>
      </SolutionSection>

      <SolutionCompare
        without={WITHOUT}
        withItems={WITH}
        title="3D without commerce is still just visualization."
      />

      <SolutionBridge
        title="3D is one surface. The underlying rules and commerce state come from the Product Configurator."
        href="/product-configurator"
        label="Product Configurator"
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
