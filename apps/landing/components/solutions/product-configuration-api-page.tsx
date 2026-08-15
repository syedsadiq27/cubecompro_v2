import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { MediaSlot } from '@/components/patterns/media-slot';
import { OutcomeGrid } from '@/components/patterns/outcome-grid';
import { ProblemCompare } from '@/components/patterns/problem-compare';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { DOCS_URL } from '@/lib/site';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from './solution-bridge';
import { SolutionHero } from './solution-hero';
import { Card, Section, Typography } from '@repo/ui';

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
    "selections": {
      "frame": "walnut",
      "fabric": "beige",
      "legs": "brass"
    }
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

const MECHANISM_STEPS = [
  {
    label: 'Request',
    detail: 'Client submits selection parameters for a product family.',
  },
  {
    label: 'Validate & Resolve',
    detail: 'Engine checks constraints and resolves to a valid configuration identity.',
    accent: true,
  },
  {
    label: 'Commerce Response',
    detail: 'Returns exact line item SKU, dynamic pricing tier, and inventory status.',
  },
];

const CAPABILITIES = [
  {
    number: '01',
    tag: 'TYPE-SAFE SCHEMA',
    title: 'Strongly-typed contracts',
    body: 'Predictable GraphQL schemas and REST endpoints eliminate guesswork when integrating custom frontends or ERP pipelines.',
  },
  {
    number: '02',
    tag: 'CONSTRAINT EVALUATION',
    title: 'Machine-readable validity',
    body: 'Violations return structured error codes and auto-rewrite suggestions that client applications can handle gracefully.',
  },
  {
    number: '03',
    tag: 'COMMERCE PROJECTION',
    title: 'Dynamic pricing & SKU resolution',
    body: 'The API projects multi-dimensional option combinations directly into standard commerce line items ready for checkout.',
  },
  {
    number: '04',
    tag: 'INTEGRATION AGILITY',
    title: 'Omnichannel API delivery',
    body: 'One configuration endpoint serves Next.js web applications, native iOS/Android apps, point-of-sale tools, and AI agents.',
  },
];

const OUTCOMES = [
  {
    tag: 'SHARED CONTRACT',
    title: 'Faster integration through a shared contract',
    description: 'Engineering teams connect to clean GraphQL and REST endpoints instead of writing complex custom rule matrices in code.',
  },
  {
    tag: 'CENTRALIZED TRUTH',
    title: 'Zero backend rule duplication',
    description: 'Pricing logic, dependency graphs, and inventory mappings are maintained once in CubeCom and consumed anywhere.',
  },
  {
    tag: 'AGENT READY',
    title: 'Machine-readable for automated commerce',
    description: 'Structured input/output contracts allow AI shopping agents and middleware pipelines to programmatically validate and price custom products.',
  },
];

function CodePanel({
  label,
  code,
  tone = 'light',
}: {
  label: string;
  code: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        dark
          ? 'border-white/15 bg-[var(--ink)]'
          : 'border-[var(--line)] bg-[var(--surface-pure)]'
      }`}
      data-surface-tone={dark ? 'ink' : 'surface'}
    >
      <div
        className={`border-b font-mono tracking-[0.1em] px-4 py-2.5 text-[11px] ${
          dark
            ? 'border-white/10 text-white/45'
            : 'border-[var(--line)] text-[var(--text-muted)]'
        }`}
      >
        {label}
      </div>
      <pre
        className={`overflow-x-auto p-4 text-[12px] md:text-[13px] leading-relaxed ${
          dark ? 'text-white/80' : 'text-[var(--ink)]'
        }`}
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

      {/* 1. Position / Hero */}
      <SolutionHero
        eyebrow={page.eyebrow}
        title="Send configuration state. Get a sellable result."
        lead="Validate option selections, resolve SKU, price, inventory, and return a commerce-ready line payload through one predictable API contract."
        primaryCta={{ href: '/#contact', label: 'Request API access' }}
        secondaryCta={{
          href: `${DOCS_URL}/developers/graphql`,
          label: 'GraphQL documentation',
        }}
        visualPriority
      >
        <MediaSlot
          src="/images/product-configurator-architecture-v2.jpg"
          alt="Configuration request flowing through validation and resolution into commerce outputs"
          aspectRatio="aspect-[16/9]"
          priority
          className="rounded-2xl border border-[var(--ink)]/15"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </SolutionHero>

      {/* 2. Problem / Tension */}
      <ProblemCompare
        eyebrow="Integration Bottleneck"
        title="Stop hardcoding product rules into multiple backend microservices."
        description="When custom product options are handled by ad-hoc scripts, pricing and fulfillment rules break as the catalog scales."
        traditionalLabel="Custom Script Glue"
        traditionalTitle="Without CubeCom"
        traditionalBody="Backend teams build fragile middleware to validate selections. Rules live in multiple databases, and checkout APIs have no machine-readable validity contract."
        cubecomLabel="Configuration API"
        cubecomTitle="With CubeCom"
        cubecomBody="A single API mutation evaluates full constraint graphs and returns valid commerce projection data (SKU, price, stock) in one round-trip."
        tone="soft"
      />

      {/* 3. Full-width Visual — blank placeholder until API schema asset ships */}
      <FullWidthVisual
        eyebrow="Schema Architecture"
        title="Request → Validate → Resolve → Project Commerce → Response"
        description="Structured JSON contracts guarantee deterministic commerce handoffs for every selection."
        tone="canvas"
      />

      {/* 4. Mechanism (Dark Signature Section) */}
      <SignatureMechanism
        eyebrow="API Pipeline"
        title="Deterministic resolution across every channel."
        description="How CubeCom resolves selection maps into verified commerce line items."
        steps={MECHANISM_STEPS}
      />

      {/* 5. Capabilities (Editorial Columns) */}
      <EditorialColumns
        eyebrow="Developer Capabilities"
        title="Built for engineering teams and composable stacks."
        description="Integrate configuration intelligence into any custom storefront, CMS, or enterprise OMS."
        items={CAPABILITIES}
        tone="canvas"
      />

      {/* 6. Real Product Proof */}
      <Section tone="soft" spacing="default">
        <Section.Header
          eyebrow="Interactive Contract Proof"
          title="The resolveConfiguration query & payload."
          description="Submit option state on the left — receive verified validity, calculated price, and line SKU on the right."
        />
        <Section.Body gap="lg">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <CodePanel label="QUERY · resolveConfiguration" code={QUERY} tone="dark" />
              <CodePanel label="VARIABLES" code={VARIABLES} />
            </div>
            <div>
              <CodePanel label="RESPONSE · deterministic commerce output" code={RESPONSE} tone="dark" />
            </div>
          </div>
        </Section.Body>
      </Section>

      {/* 7. Commercial & Operational Outcomes */}
      <OutcomeGrid
        eyebrow="Engineering & Commercial Outcomes"
        title="The value of an API-first configuration layer."
        description="Unify configuration logic across your entire digital infrastructure."
        items={OUTCOMES}
        tone="canvas"
      />

      {/* 8. Decision Support */}
      <SolutionBridge
        title="Building a custom frontend on top of this API? See the Headless Product Configurator."
        href="/headless-product-configurator"
        label="Headless Product Configurator"
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
