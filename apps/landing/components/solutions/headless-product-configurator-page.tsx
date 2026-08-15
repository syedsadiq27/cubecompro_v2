import { Card, Typography } from '@repo/ui';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { HeadlessArchitectureDiagram } from './headless-architecture-diagram';
import { HeadlessStatePipeline } from './headless-state-pipeline';
import { SolutionBridge } from './solution-bridge';
import { SolutionCompare } from './solution-compare';
import { SolutionFlow } from './solution-flow';
import { SolutionHero } from './solution-hero';
import { SolutionSection } from './solution-section';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';

const PATH = '/headless-product-configurator';

const WITHOUT = [
  'Rules duplicated in every frontend',
  'Platform plugins that own your UX',
  'Channel-specific rule implementations',
  'Different truth for web vs sales tools',
];

const WITH = [
  'One graph behind every surface',
  'You keep storefront and design system',
  'Resolve returns sellable state',
  'One configuration truth across every channel',
];

export function HeadlessProductConfiguratorPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />
      <SolutionHero
        eyebrow={page.eyebrow}
        title="Keep your frontend. Run configuration as infrastructure."
        lead="You own presentation. CubeCom owns configuration truth — product graph, constraints, and commerce resolve."
        primaryCta={{ href: '/#contact', label: 'Discuss your architecture' }}
        secondaryCta={{
          href: '/product-configuration-api',
          label: 'See the configuration API',
        }}
        visualPriority
      >
        <HeadlessArchitectureDiagram />
      </SolutionHero>

      <SolutionSection
        title="Headless commerce still needs a source of configuration truth."
        description="Composable stacks separate UI, CMS, checkout, and commerce. Product rules still need one place to live."
        tone="muted"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              title: 'Plugin lock-in',
              body: 'Platform plugins force their UI and crowd out your design system.',
            },
            {
              title: 'Frontend rule drift',
              body: 'Rules copied into React break when other channels need the same truth.',
            },
            {
              title: 'Channel inconsistency',
              body: 'Storefronts, sales tools, and agents resolve configuration differently.',
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
        title="Presentation stays yours. Sellable state stays shared."
        description="Ownership stays explicit at every step."
      >
        <ol className="grid gap-2.5 md:grid-cols-3 md:gap-3">
          {[
            {
              step: '01',
              title: 'Author graph',
              owner: 'CubeCom owns configuration truth.',
            },
            {
              step: '02',
              title: 'Render your UI',
              owner: 'You own components, UX, and design system.',
            },
            {
              step: '03',
              title: 'Hand off commerce',
              owner: 'Resolved state goes to cart, ERP, or commerce platform.',
            },
          ].map((item) => (
            <li
              key={item.step}
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 md:rounded-2xl md:p-5"
            >
              <Typography variant="code" tone="strong">
                {item.step}
              </Typography>
              <Typography variant="titleSm" className="mt-1.5 md:mt-2">
                {item.title}
              </Typography>
              <Typography variant="support" className="mt-2 md:mt-3">
                {item.owner}
              </Typography>
            </li>
          ))}
        </ol>
      </SolutionSection>

      <SolutionSection
        title="Your storefront captures intent. CubeCom turns it into something sellable."
        description="Example: Next.js storefront → CubeCom resolve → Shopify cart. The same ownership flow works with other storefronts and commerce platforms."
        tone="muted"
      >
        <HeadlessStatePipeline />
      </SolutionSection>

      <SolutionSection
        title="One runtime between experience and commerce."
        tone="ink"
      >
        <SolutionFlow
          steps={[
            'Frontend',
            'CubeCom Runtime',
            'Product Graph',
            'Valid State',
            'Commerce Projection',
            'Cart',
          ]}
        />
      </SolutionSection>

      <SolutionCompare
        without={WITHOUT}
        withItems={WITH}
        title="Own your frontend without owning the rule engine twice."
      />

      <SolutionBridge
        title="Need a visual surface on top of this engine? The 3D Product Configurator still resolves to the same sellable state."
        href="/3d-product-configurator"
        label="See 3D Product Configurator"
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
