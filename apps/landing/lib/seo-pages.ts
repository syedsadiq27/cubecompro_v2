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
      'Let shoppers configure products in 3D while every visual state stays tied to a valid SKU, price, inventory, and cart — a sellable experience, not just a WebGL viewer.',
    eyebrow: '3D Product Configurator',
    h1: '3D Product Configurator for Ecommerce',
    lead: 'How do you let shoppers visually configure a product while keeping every visual choice sellable? Real-time 3D that stays synchronized with commerce state.',
    reframe:
      'Unlike a typical 3D viewer, CubeCom Pro binds scene state to the Product Configurator engine — so materials, parts, and looks resolve to SKU, price, inventory, and cart.',
    primaryCta: { href: '/demo', label: 'Open live demo' },
    secondaryCta: { href: '/#contact', label: 'Book a solution session' },
    related: [
      {
        href: '/product-configurator',
        label: 'Product configurator',
        blurb: 'The rules engine and commerce resolution behind the 3D surface.',
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
      'Model product options, dependencies, and exclusions once. Resolve every valid configuration to SKU, price, inventory, and cart — without exploding your catalog. 3D optional.',
    eyebrow: 'Product Configurator',
    h1: 'Product Configurator for Ecommerce',
    lead: 'How do you model options, dependencies, exclusions, and valid sellable states without exploding your catalog? Encode rules once; resolve commerce on every legal state.',
    reframe:
      'CubeCom Pro is the configuration engine: product graph, rules, and commerce projection. 3D is optional — the same engine powers 2D UIs, APIs, and the 3D Product Configurator surface.',
    primaryCta: { href: '/#contact', label: 'Book a solution session' },
    secondaryCta: {
      href: '/3d-product-configurator',
      label: 'Need visual 3D?',
    },
    related: [
      {
        href: '/3d-product-configurator',
        label: '3D product configurator',
        blurb: 'The visual buying experience powered by this engine.',
      },
      {
        href: '/headless-product-configurator',
        label: 'Headless product configurator',
        blurb: 'Separate the configuration engine from your storefront UI.',
      },
      {
        href: '/product-configuration-api',
        label: 'Product configuration API',
        blurb: 'Call the same resolve path from services and agents.',
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
      'Send configuration state. Get a sellable result — validate selections and resolve SKU, price, and inventory through one configuration contract.',
    eyebrow: 'Product Configuration API',
    h1: 'Product Configuration API',
    lead: 'Send configuration state. Get a sellable result. One resolve contract for storefronts, middleware, and agents.',
    reframe:
      'CubeCom Pro exposes configuration as an API-backed contract — selection in, validity plus commerce payload out — so every caller shares the same sellable state.',
    primaryCta: { href: '/#contact', label: 'Request API access discussion' },
    secondaryCta: {
      href: 'https://docs.cubecompro.com/developers/graphql',
      label: 'GraphQL docs',
    },
    related: [
      {
        href: '/headless-product-configurator',
        label: 'Headless product configurator',
        blurb: 'Ownership boundaries when your frontend calls resolve.',
      },
      {
        href: '/product-configurator',
        label: 'Product configurator',
        blurb: 'The rules engine behind the configuration contract.',
      },
      {
        href: '/3d-product-configurator',
        label: '3D product configurator',
        blurb: 'Visual surfaces that call the same resolve path.',
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
    primaryCta: { href: '/#contact', label: 'Book a solution session' },
    secondaryCta: { href: '/demo', label: 'Open live demo' },
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
    primaryCta: { href: '/#contact', label: 'Book a solution session' },
    secondaryCta: {
      href: '/headless-product-configurator',
      label: 'Headless model',
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
    secondaryCta: { href: '/#contact', label: 'Book a solution session' },
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
