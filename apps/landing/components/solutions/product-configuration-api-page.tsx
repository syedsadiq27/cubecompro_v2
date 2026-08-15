import Link from 'next/link';
import { Compare, Heading, Typography } from '@repo/ui';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { DOCS_URL } from '@/lib/site';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionCompare } from './solution-compare';
import { SolutionHero } from './solution-hero';
import { SolutionSection } from './solution-section';

const PATH = '/product-configuration-api';

const QUERY = `query ResolveSofa($input: ConfigurationStateInput!) {
  resolveConfiguration(input: $input) {
    valid
    violations { code message }
    commerce {
      sku
      price
      currency
      inventory
    }
  }
}`;

const VARIABLES = `{
  "input": {
    "productId": "sofa-01",
    "selectionsJson": "{\\"frame\\":\\"walnut\\",\\"fabric\\":\\"beige\\",\\"legs\\":\\"brass\\"}"
  }
}`;

const RESPONSE = `{
  "data": {
    "resolveConfiguration": {
      "valid": true,
      "violations": [],
      "commerce": {
        "sku": "SOFA-WAL-BEI-BRA",
        "price": 2399,
        "currency": "USD",
        "inventory": 4
      }
    }
  }
}`;

const WITHOUT = [
  'Cart layer guesses variants',
  'Rules duplicated in clients',
  'No machine-readable validity contract',
  'Agents invent state',
];

const WITH = [
  'One resolve contract',
  'Validity + commerce together',
  'Machine-readable response contract',
  'Same truth for UI, middleware, agents',
];

const CREDIBILITY = [
  'Schema-first',
  'Typed responses',
  'Agent-compatible',
  'GraphQL available',
] as const;

const MECHANISM = [
  'Request',
  'Validate',
  'Resolve',
  'Project commerce',
  'Response',
] as const;

const SYSTEM_STEPS = [
  {
    title: 'Selection JSON',
    fragment: '{ fabric, size, legs }',
  },
  {
    title: 'Validation result',
    fragment: 'valid: true',
  },
  {
    title: 'Resolved state',
    fragment: 'sku · price · stock',
  },
  {
    title: 'Commerce payload',
    fragment: '{ line, qty }',
  },
] as const;

const PROOF = [
  {
    label: 'Input',
    tone: 'light' as const,
    rows: [
      ['frame', 'walnut'],
      ['fabric', 'beige'],
      ['legs', 'brass'],
    ],
  },
  {
    label: 'Resolved',
    tone: 'ink' as const,
    rows: [
      ['valid', 'true'],
      ['sku', 'SOFA-WAL-BEI-BRA'],
      ['price', '2399'],
      ['inventory', '4'],
    ],
  },
  {
    label: 'Handoff',
    tone: 'light' as const,
    rows: [
      ['line', 'variant'],
      ['qty', '1'],
      ['cart', 'ready'],
    ],
  },
] as const;

function CodePanel({
  label,
  code,
  tone = 'light',
  compact = false,
}: {
  label: string;
  code: string;
  tone?: 'light' | 'dark';
  compact?: boolean;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        dark
          ? 'border-white/15 bg-[#0c0c0f]'
          : 'border-[var(--line)] bg-[var(--surface-pure)]'
      }`}
    >
      <div
        className={`border-b font-mono tracking-[0.1em] ${
          compact ? 'px-3.5 py-2 text-[10px]' : 'px-4 py-2.5 text-[11px]'
        } ${
          dark
            ? 'border-white/10 text-white/45'
            : 'border-[var(--line)] text-[var(--text-muted)]'
        }`}
      >
        {label}
      </div>
      <pre
        className={`overflow-x-auto leading-relaxed ${
          compact
            ? 'max-h-[11.5rem] overflow-y-auto p-3.5 text-[11px] md:text-[12px]'
            : 'p-4 text-[12px] md:text-[13px]'
        } ${dark ? 'text-white/80' : 'text-[var(--ink)]'}`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ProductConfigurationApiPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />
      <SolutionHero
        eyebrow={page.eyebrow}
        title="Send configuration state. Get a sellable result."
        lead="Validate selections, resolve SKU, price, inventory, and return a commerce-ready payload through one configuration contract."
        primaryCta={{ href: '/#contact', label: 'Request API access discussion' }}
        secondaryCta={{
          href: `${DOCS_URL}/developers/graphql`,
          label: 'GraphQL docs',
        }}
        visualPriority
      >
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--ink)] px-4 py-5 text-[var(--canvas)] md:px-5">
            <Typography variant="code" tone="ink">
              CORE CONTRACT
            </Typography>
            <p className="mt-2 font-mono text-[clamp(1.2rem,2.6vw,1.55rem)] tracking-tight">
              resolveConfiguration()
            </p>
            <p className="mt-2 font-mono text-[12px] text-white/55 md:text-[13px]">
              selection → valid state → commerce payload
            </p>
          </div>
          <CodePanel label="REQUEST · variables" code={VARIABLES} compact />
          <CodePanel
            label="RESPONSE · resolveConfiguration"
            code={RESPONSE}
            tone="dark"
            compact
          />
        </div>
      </SolutionHero>

      <SolutionSection
        title="Ecommerce stacks need a configuration contract, not another UI"
        description="Without one shared resolve path, every channel invents its own sellable state."
        tone="muted"
      >
        <Compare
          density="compact"
          left={{
            label: 'Without a configuration contract',
            items: [
              'Validation duplicated across clients',
              'Cart layer guesses variants',
              'Storefront and middleware disagree',
            ],
          }}
          right={{
            label: 'With CubeCom',
            items: [
              'One request shape',
              'One validity contract',
              'Same payload for UI, middleware, and agents',
            ],
          }}
        />
      </SolutionSection>

      <SolutionSection
        title="Ask once. Get the product state every system can trust."
        description="Validate the selection, resolve commerce identity, and return one contract for storefronts, middleware, agents, and services."
      >
        <ol className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          {MECHANISM.map((step, index) => (
            <li
              key={step}
              className="flex flex-col items-stretch md:flex-row md:items-center md:gap-2"
            >
              <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-center text-[15px] font-medium text-[var(--ink)] md:min-w-[8.5rem]">
                {step}
              </div>
              {index < MECHANISM.length - 1 ? (
                <span
                  className="py-1 text-center text-[var(--text-muted)] md:py-0"
                  aria-hidden
                >
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Typography variant="label" className="mb-3">
            Example · GraphQL
          </Typography>
          <CodePanel label="QUERY · resolveConfiguration" code={QUERY} tone="dark" />
        </div>
      </SolutionSection>

      <SolutionSection
        title="Turn shopper intent into a commerce-ready line."
        description="The API equivalent of a visual configure loop: input state in, commerce handoff out."
        tone="muted"
      >
        <div className="overflow-hidden rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--surface-pure)] shadow-[0_24px_60px_-40px_rgba(16,16,16,0.35)]">
          <div className="flex flex-col gap-0 p-5 md:flex-row md:items-stretch md:gap-0 md:p-8 lg:p-10">
            {PROOF.map((stage, index) => (
              <div key={stage.label} className="flex flex-col md:flex-row md:items-center">
                <div
                  className={`min-w-0 flex-1 rounded-2xl border px-5 py-6 md:min-w-[15rem] md:px-7 md:py-7 ${
                    stage.tone === 'ink'
                      ? 'border-white/15 bg-[var(--ink)] text-[var(--canvas)]'
                      : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
                  }`}
                >
                  <Typography
                    variant="mono"
                    tone={stage.tone === 'ink' ? 'ink' : 'muted'}
                  >
                    {stage.label}
                  </Typography>
                  <dl className="mt-5 space-y-3 font-mono text-[13px] md:text-[15px]">
                    {stage.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt
                          className={
                            stage.tone === 'ink'
                              ? 'text-white/45'
                              : 'text-[var(--text-muted)]'
                          }
                        >
                          {k}
                        </dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {index < PROOF.length - 1 ? (
                  <div
                    className="flex items-center justify-center py-3.5 text-[var(--ink)] md:px-4 md:py-0"
                    aria-hidden
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--surface-pure)] text-lg font-medium md:h-12 md:w-12 md:text-xl">
                      <span className="md:hidden">↓</span>
                      <span className="hidden md:inline">→</span>
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </SolutionSection>

      <SolutionSection
        title="From configuration input to commerce contract."
        tone="ink"
      >
        <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch md:gap-2">
          {SYSTEM_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col md:flex-row md:items-center md:gap-2"
            >
              <div className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-4 md:min-w-[10rem]">
                <Typography variant="bodyStrong" tone="ink">
                  {step.title}
                </Typography>
                <Typography variant="code" tone="ink" className="mt-2">
                  {step.fragment}
                </Typography>
              </div>
              {index < SYSTEM_STEPS.length - 1 ? (
                <span className="py-1 text-center text-white/40 md:py-0" aria-hidden>
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm text-white/55">
          Checkout and orders stay on your commerce platform. CubeCom resolves
          configuration — it is not a replacement cart.{' '}
          <Link
            href={`${DOCS_URL}/guides/resolve-sku`}
            className="underline decoration-white/30 underline-offset-2 hover:decoration-white"
          >
            Resolve → SKU guide
          </Link>
        </p>
      </SolutionSection>

      <section className="border-t border-[var(--line)] bg-[var(--canvas)]">
        <div className="mx-auto max-w-[90rem] px-5 py-10 md:px-8 md:py-12">
          <Heading as="h2" variant="section">
            Designed for systems, not screens.
          </Heading>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
            {CREDIBILITY.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 font-mono text-[12px] text-[var(--ink)] md:text-[13px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SolutionCompare
        without={WITHOUT}
        withItems={WITH}
        title="One resolve contract instead of custom logic everywhere."
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
