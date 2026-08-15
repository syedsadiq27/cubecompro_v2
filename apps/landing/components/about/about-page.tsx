import {
  Button,
  Eyebrow,
  Heading,
  Lede,
  List,
  ListItem,
  PageHero,
  Section,
  Stack,
  Typography,
} from '@repo/ui';
import Link from 'next/link';

import { EditorialColumns } from '@/components/patterns/editorial-columns';
import { FullWidthVisual } from '@/components/patterns/full-width-visual';
import { SignatureMechanism } from '@/components/patterns/signature-mechanism';
import { SeoCta } from '@/components/seo/seo-cta';
import { DOCS_URL } from '@/lib/site';

const SURFACES = [
  {
    label: 'Product Configurator',
    detail:
      'Rules, options, and commerce resolve — configuration logic without requiring 3D.',
  },
  {
    label: '3D Product Configurator',
    detail:
      'Visual state that stays locked to the same sellable SKU, price, and inventory.',
    accent: true,
  },
  {
    label: 'Headless Runtime',
    detail:
      'Keep your frontend and design system. Run configuration as shared infrastructure.',
  },
  {
    label: 'Configuration API',
    detail:
      'Validate selections and return deterministic commerce projection for any channel.',
  },
];

const PRINCIPLES = [
  {
    number: '01',
    tag: 'COMMERCE',
    title: 'Commerce stays commerce.',
    body: 'CubeCom should complement Shopify, commercetools, and other commerce systems — not replace catalog, cart, checkout, or orders.',
  },
  {
    number: '02',
    tag: 'TRUTH',
    title: 'Configuration truth lives once.',
    body: 'Rules should not be rewritten across storefronts, viewers, middleware, and sales tools. One graph powers every surface.',
  },
  {
    number: '03',
    tag: 'SELLABLE',
    title: 'Visual state must remain sellable.',
    body: 'What the shopper sees should resolve to a valid commerce state — SKU, price, inventory, and cart identity aligned.',
  },
  {
    number: '04',
    tag: 'INTEGRITY',
    title: 'Real integrations before marketing claims.',
    body: 'We would rather ship a smaller real capability than advertise an App Store listing or marketplace connector that does not exist yet.',
  },
];

const STATUS_ITEMS = [
  {
    label: 'Early access',
    body: 'Founding plans for teams ready to map one product family.',
  },
  {
    label: 'Founding customers',
    body: 'Early brands hardening the shopper loop before packaging claims.',
  },
  {
    label: 'Commerce integrations',
    body: 'Shopify and commercetools ship as candid early-access architecture.',
  },
  {
    label: 'Docs & API',
    body: 'Developer docs and GraphQL contracts are available now.',
  },
];

export function AboutPage() {
  return (
    <>
      <PageHero layout="solo" density="roomy">
        <PageHero.Copy className="max-w-3xl">
          <Eyebrow>About</Eyebrow>
          <Heading as="h1" variant="pageWide" spacing="eyebrow">
            Built for products that change before they’re bought.
          </Heading>
          <Lede variant="hero" className="mt-5 max-w-2xl">
            CubeCom Pro is product configuration infrastructure for visual
            commerce. We’re building the layer that keeps product rules, visual
            state, SKU, price, inventory, and cart aligned as a product changes.
          </Lede>
          <PageHero.Actions>
            <Button as={Link} href="/#contact" variant="primary" size="lg">
              Book a solution session
            </Button>
            <Button as={Link} href="/solutions" variant="secondary" size="lg">
              Explore solutions
            </Button>
          </PageHero.Actions>
        </PageHero.Copy>
      </PageHero>

      <Section tone="soft" spacing="default">
        <Section.Header
          eyebrow="Why CubeCom exists"
          title="Product complexity outgrew variant catalogs."
        />
        <Section.Body>
          <Stack gap="md" className="max-w-3xl">
            <Lede>
              Ecommerce platforms are excellent at catalog, inventory, checkout,
              and orders. But highly configurable products introduce another
              problem: what combinations are valid, what the shopper is actually
              building, and what that state means to commerce.
            </Lede>
            <Typography variant="body">
              CubeCom exists to own that layer — connecting product rules,
              visual state, commerce identity, and cart handoff through one
              shared configuration model.
            </Typography>
          </Stack>
        </Section.Body>
      </Section>

      <FullWidthVisual
        src="/images/product-configurator-architecture-v2.jpg"
        alt="Rules, visual state, SKU, price, inventory, and cart resolving into one configuration"
        eyebrow="Our thesis"
        title="One product graph. Every experience resolves from the same truth."
        description="Rules, 3D / visual state, SKU, price, inventory, and cart — down to one resolved configuration."
        tone="canvas"
      />

      <SignatureMechanism
        eyebrow="What we’re building"
        title="Configuration as infrastructure, not another storefront plugin."
        description="Four surfaces. One configuration model. Commerce systems keep what they already do well."
        steps={SURFACES}
      />

      <EditorialColumns
        eyebrow="How we build"
        title="A few short principles."
        description="These guide product decisions more than slogans — especially while integrations are still early."
        items={PRINCIPLES}
        tone="canvas"
      />

      <Section tone="soft" spacing="default" className="md:!py-24">
        <Section.Body>
          <div className="relative max-w-3xl border-l-2 border-[var(--stage-violet)] pl-6 md:pl-10">
            <Typography
              variant="mono"
              tone="accent"
              className="font-semibold"
            >
              Company
            </Typography>
            <Heading
              as="h2"
              variant="section"
              className="mt-3 text-[clamp(1.75rem,3.2vw,2.35rem)]"
            >
              Built through Introfinity.
            </Heading>
            <Stack gap="md" className="mt-6">
              <Lede>
                CubeCom Pro is being built through Introfinity — a
                company-building studio focused on creating and operating its
                own products.
              </Lede>
              <Typography variant="body">
                CubeCom Pro is its first launched product. Introfinity explains
                ownership and origin; CubeCom remains the product and the
                protagonist.
              </Typography>
            </Stack>
          </div>
        </Section.Body>
      </Section>

      <Section tone="canvas" spacing="default">
        <Section.Header
          eyebrow="Where we are"
          title="Early, deliberately."
          description="The core platform is being built now across configuration, 3D authoring, commerce resolution, APIs, and integrations."
        />
        <Section.Body>
          <List
            gap="md"
            className="max-w-4xl md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8"
          >
            {STATUS_ITEMS.map((item) => (
              <ListItem
                key={item.label}
                className="border-t border-[var(--line)] pt-4"
              >
                <Typography variant="mono" tone="muted">
                  {item.label}
                </Typography>
                <Typography variant="body" className="mt-1.5">
                  {item.body}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Stack direction="row" gap="sm" wrap className="mt-10">
            <Button as={Link} href="/pricing" variant="secondary" size="md">
              Founding pricing
            </Button>
            <Button
              as={Link}
              href="/integrations/shopify"
              variant="secondary"
              size="md"
            >
              Shopify pattern
            </Button>
            <Button
              as="a"
              href={DOCS_URL}
              variant="secondary"
              size="md"
              rel="noopener noreferrer"
            >
              Documentation
            </Button>
          </Stack>
        </Section.Body>
      </Section>

      <SeoCta
        title="Bring us the product your catalog has outgrown."
        description="One product family, your rules, and how you sell today — we’ll show where CubeCom should sit."
        primaryHref="/#contact"
        primaryLabel="Book a solution session"
        secondaryHref="/demo"
        secondaryLabel="Open live demo"
      />
    </>
  );
}
