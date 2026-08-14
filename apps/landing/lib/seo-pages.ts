import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './site';

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoPageDef = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  badge?: string;
  h1: string;
  lead: string;
  reframe: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  related: Array<{ href: string; label: string; blurb: string }>;
};

export const seoPages: SeoPageDef[] = [
  {
    path: '/3d-product-configurator',
    title: `3D Product Configurator for Ecommerce | ${SITE_NAME}`,
    description:
      'A 3D product configurator for ecommerce that connects visual choices to SKU, price, inventory, and cart — not just a pretty 3D viewer. Live sofa demo, architecture, and implementation options.',
    eyebrow: '3D Product Configurator',
    h1: '3D Product Configurator for Ecommerce',
    lead: 'Let shoppers configure products in 3D and buy what they see — materials, options, and combinations that stay sellable.',
    reframe:
      'Unlike a typical 3D configurator focused on visualization, CubeCom Pro binds every configuration state to SKU, pricing, inventory, and cart on one product graph.',
    primaryCta: { href: '/demo', label: 'Open live demo' },
    secondaryCta: { href: '/#contact', label: 'Book a solution session' },
    related: [
      {
        href: '/product-configurator',
        label: 'Product configurator',
        blurb: 'Rules, variants, and sellable combinations beyond the 3D surface.',
      },
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'How CubeCom Pro coexists with Shopify cart and inventory.',
      },
      {
        href: '/product-configuration-api',
        label: 'Product configuration API',
        blurb: 'Resolve configuration state to commerce data in your stack.',
      },
    ],
  },
  {
    path: '/product-configurator',
    title: `Product Configurator Software for Ecommerce | ${SITE_NAME}`,
    description:
      'Product configurator software for ecommerce. Model dependency rules, prevent invalid combinations, and resolve each configuration to SKU, price, inventory, and cart.',
    eyebrow: 'Product Configurator',
    h1: 'Product Configurator for Ecommerce',
    lead: 'Stop pre-generating thousands of variants. Encode dependency rules once, block invalid combinations, and resolve every legal state to SKU, price, and inventory — with or without 3D.',
    reframe:
      'CubeCom Pro treats the configurator as a commerce surface on a product graph: rules prevent invalid states, and every valid state resolves to SKU, price, inventory, and cart actions — without a variant matrix of every combination.',
    primaryCta: { href: '/#contact', label: 'Book a solution session' },
    secondaryCta: { href: '/demo', label: 'Open live demo' },
    related: [
      {
        href: '/3d-product-configurator',
        label: '3D product configurator',
        blurb: 'When the experience needs interactive 3D, not only option pickers.',
      },
      {
        href: '/headless-product-configurator',
        label: 'Headless product configurator',
        blurb: 'Separate the configuration engine from your storefront UI.',
      },
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'Configure products without replacing Shopify checkout.',
      },
    ],
  },
  {
    path: '/headless-product-configurator',
    title: `Headless Product Configurator | ${SITE_NAME}`,
    description:
      'Headless product configurator architecture: you own the frontend and design system; CubeCom owns the product graph, constraints, and SKU/price/inventory resolve for composable commerce.',
    eyebrow: 'Headless Product Configurator',
    h1: 'Headless Product Configurator',
    lead: 'Keep your storefront, CMS, and design system. Run configuration rules and commerce resolution as infrastructure behind the experience — embed, SDK, or API.',
    reframe:
      'CubeCom Pro is built as commerce infrastructure: the product graph, constraint engine, and SKU/price/inventory sync stay headless while you render UI — 3D, 2D, or fully custom — in your app.',
    primaryCta: {
      href: '/product-configuration-api',
      label: 'See the configuration API',
    },
    secondaryCta: { href: '/#contact', label: 'Discuss your architecture' },
    related: [
      {
        href: '/product-configuration-api',
        label: 'Product configuration API',
        blurb: 'Endpoints and patterns for resolving state to commerce outcomes.',
      },
      {
        href: '/3d-product-configurator',
        label: '3D product configurator',
        blurb: 'Optional 3D surfaces on top of the same headless graph.',
      },
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'Headless or theme-embedded experiences that still use Shopify cart.',
      },
      {
        href: '/integrations/commercetools',
        label: 'commercetools integration',
        blurb: 'Configuration for commercetools storefronts.',
      },
    ],
  },
  {
    path: '/product-configuration-api',
    title: `Product Configuration API | ${SITE_NAME}`,
    description:
      'Product configuration API contracts: resolve configuration state to SKU, price, inventory, and cart-ready payloads — with example GraphQL requests and responses for engineers.',
    eyebrow: 'Product Configuration API',
    h1: 'Product Configuration API',
    lead: 'Engineer-facing contracts for resolve: selection input in, validity + commerce + scene effects out. Same truth for storefronts, middleware, and agents.',
    reframe:
      'CubeCom Pro exposes configuration as an API-backed product graph — not a closed plugin UI — so your services, storefronts, and agents can call the same truth layer shoppers see in the experience.',
    primaryCta: { href: '/#contact', label: 'Request API access discussion' },
    secondaryCta: {
      href: '/headless-product-configurator',
      label: 'Headless architecture',
    },
    related: [
      {
        href: '/headless-product-configurator',
        label: 'Headless product configurator',
        blurb: 'Where the API sits relative to your frontend and commerce platform.',
      },
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'How resolved SKUs land in Shopify cart flows.',
      },
      {
        href: '/integrations/commercetools',
        label: 'commercetools integration',
        blurb: 'Product configuration on commercetools storefronts.',
      },
      {
        href: '/product-configurator',
        label: 'Product configurator',
        blurb: 'Business rules and buyer outcomes the API is encoding.',
      },
    ],
  },
  {
    path: '/integrations/shopify',
    title: `Shopify 3D Product Configurator | ${SITE_NAME}`,
    description:
      'Early-access Shopify product configurator pattern: resolve configuration to Shopify variants while cart and checkout stay on Shopify.',
    eyebrow: 'Shopify integration',
    badge: 'Integration preview · Early access',
    h1: 'Shopify 3D Product Configurator',
    lead: 'Add configuration and 3D experiences to Shopify without ripping out cart, checkout, or inventory — as an early-access architecture, not a finished App Store listing.',
    reframe:
      'CubeCom Pro sits beside Shopify: your catalog and checkout stay Shopify; CubeCom enforces configuration rules and resolves configuration state to the Shopify variant or line item you can actually sell.',
    primaryCta: { href: '/demo', label: 'See live demo' },
    secondaryCta: { href: '/#contact', label: 'Map your Shopify catalog' },
    related: [
      {
        href: '/integrations/commercetools',
        label: 'commercetools integration',
        blurb: 'Configuration for commercetools and composable stacks.',
      },
      {
        href: '/3d-product-configurator',
        label: '3D product configurator',
        blurb: 'The ecommerce configurator model Shopify merchants usually search for.',
      },
      {
        href: '/product-configuration-api',
        label: 'Product configuration API',
        blurb: 'How resolution payloads feed cart and middleware.',
      },
    ],
  },
  {
    path: '/integrations/commercetools',
    title: `commercetools Product Configurator | ${SITE_NAME}`,
    description:
      'Early-access product configurator pattern for commercetools — configure complex products with optional 3D, then hand off to catalog and cart on commercetools.',
    eyebrow: 'commercetools integration',
    badge: 'Integration preview · Early access',
    h1: 'commercetools Product Configurator',
    lead: 'Add product configuration to your commercetools storefront while catalog, cart, and checkout stay on commercetools — currently offered as early-access architecture.',
    reframe:
      'CubeCom Pro supports commercetools alongside Shopify and other commerce platforms — configuration experiences that work with the tools you already run.',
    primaryCta: { href: '/#contact', label: 'Talk about commercetools' },
    secondaryCta: {
      href: '/integrations/shopify',
      label: 'Shopify integration',
    },
    related: [
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'Configuration and 3D with Shopify cart.',
      },
      {
        href: '/product-configuration-api',
        label: 'Product configuration API',
        blurb: 'API patterns for configuration and cart handoff.',
      },
      {
        href: '/headless-product-configurator',
        label: 'Headless product configurator',
        blurb: 'Keep your storefront UI; run configuration behind it.',
      },
    ],
  },
  {
    path: '/industries/furniture',
    title: `3D Furniture Configurator for Ecommerce | ${SITE_NAME}`,
    description:
      '3D furniture configurator for sofas, sectionals, chairs, tables, and cabinets — fabrics, dimensions, dependency rules, and live resolve to SKU, price, and inventory.',
    eyebrow: 'Furniture',
    h1: '3D Furniture Configurator for Ecommerce',
    lead: 'Configure sofas, sectionals, chairs, tables, and case goods in 3D — with fabric rules, dimensions, and combinations that stay sellable.',
    reframe:
      'CubeCom Pro is not only a furniture viewer. Frame, fabric, legs, and modular options become configuration state that resolves to SKU, price, and inventory on one product graph.',
    primaryCta: { href: '/demo', label: 'Open sofa demo' },
    secondaryCta: { href: '/#contact', label: 'Map a furniture catalog' },
    related: [
      {
        href: '/3d-product-configurator',
        label: '3D product configurator',
        blurb: 'The general ecommerce 3D configurator model.',
      },
      {
        href: '/industries/apparel',
        label: 'Apparel',
        blurb: 'Soft-goods configuration patterns.',
      },
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'Furniture PDPs that still check out on Shopify.',
      },
    ],
  },
  {
    path: '/industries/apparel',
    title: `Apparel Product Configurator | ${SITE_NAME}`,
    description:
      'Apparel and accessories product configurator for ecommerce — colors, materials, and styles with SKU-aligned configuration — with CubeCom Pro, the Digital Product Stage.',
    eyebrow: 'Apparel',
    h1: 'Apparel Product Configurator',
    lead: 'Configure apparel and accessories with rules that keep merchandising choices aligned to what you can stock and sell.',
    reframe:
      'CubeCom Pro treats apparel options as configuration state on a product graph — so colorways, materials, and styles resolve to commerce outcomes instead of orphaned visual presets.',
    primaryCta: { href: '/demo/tshirt', label: 'Open tee demo' },
    secondaryCta: { href: '/#contact', label: 'Book a solution session' },
    related: [
      {
        href: '/industries/furniture',
        label: 'Furniture',
        blurb: 'Hard-goods configuration with material and component rules.',
      },
      {
        href: '/product-configurator',
        label: 'Product configurator',
        blurb: 'Rules-first configurator model for complex catalogs.',
      },
      {
        href: '/integrations/shopify',
        label: 'Shopify integration',
        blurb: 'Apparel configuration that lands in Shopify cart.',
      },
    ],
  },
];

export function getSeoPage(path: string): SeoPageDef {
  const page = seoPages.find((entry) => entry.path === path);
  if (!page) {
    throw new Error(`Unknown SEO page: ${path}`);
  }
  return page;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function createSeoMetadata(path: string): Metadata {
  const page = getSeoPage(path);
  const url = absoluteUrl(page.path);
  const ogImagePath =
    path === '/product-configurator'
      ? '/product-configurator/opengraph-image'
      : '/opengraph-image';
  const ogImage = {
    url: ogImagePath,
    width: 1200,
    height: 630,
    alt: page.h1,
  };

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [ogImage.url],
    },
    robots: { index: true, follow: true },
  };
}
