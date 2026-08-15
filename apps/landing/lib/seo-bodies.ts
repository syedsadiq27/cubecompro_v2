import type { SeoFaqItem } from './seo-pages';

export type SeoSectionBody =
  | {
      kind: 'bullets';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      bullets: string[];
    }
  | {
      kind: 'columns';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      columns: Array<{ title: string; items: string[] }>;
    }
  | {
      kind: 'links';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      links: Array<{ href: string; label: string }>;
    }
  | {
      kind: 'prose';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      paragraphs: string[];
    }
  | {
      kind: 'steps';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      steps: Array<{ title: string; body: string }>;
    }
  | {
      kind: 'proof';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      configuration: Array<{ label: string; value: string }>;
      resolved: Array<{ label: string; value: string }>;
      note?: string;
    }
  | {
      kind: 'math';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      equation: string;
      left: { title: string; items: string[] };
      right: { title: string; items: string[] };
    }
  | {
      kind: 'code';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      caption?: string;
      code: string;
    }
  | {
      kind: 'demo';
      eyebrow?: string;
      title: string;
      description?: string;
      tone?: 'default' | 'muted';
      product?: 'sofa' | 'tshirt';
    };

export type SeoBody = {
  path: string;
  sections: SeoSectionBody[];
  faqs: SeoFaqItem[];
  faqTitle: string;
  faqDescription?: string;
  cta: {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
};

export const seoBodies: SeoBody[] = [
  {
    path: '/3d-product-configurator',
    sections: [],
    faqs: [
      {
        question: 'What is a 3D product configurator for ecommerce?',
        answer:
          'An interactive buying experience where shoppers change materials, parts, and options in 3D — and every visual state stays sellable. In CubeCom Pro, scene state stays synchronized with SKU, price, inventory, and cart.',
      },
      {
        question: 'How is this different from a WebGL product viewer?',
        answer:
          'A viewer shows a model. A configurator blocks invalid looks, updates the scene from real configuration state, and hands a matching commerce identity to cart — not a decorative orbit.',
      },
      {
        question: 'Can invalid option combinations be blocked in 3D?',
        answer:
          'Yes. Invalid visual combinations are blocked before they become a look shoppers think they can buy.',
      },
      {
        question: 'Does the 3D configuration match what goes into the cart?',
        answer:
          'That is the requirement. Commerce resolve follows the scene state so checkout matches what they configured.',
      },
      {
        question: 'How does this relate to the Product Configurator page?',
        answer:
          '3D is one surface. Rules, dependencies, and commerce resolution come from the Product Configurator engine. This page is the visual buying experience powered by that engine.',
      },
      {
        question: 'Where should we start?',
        answer:
          'Open the live sofa demo to feel the visual-to-commerce loop, then book a session with one product family you want shoppers to configure in 3D.',
      },
    ],
    faqTitle: '3D product configurator FAQ',
    faqDescription:
      'For teams evaluating a sellable 3D buying experience — not a standalone WebGL viewer.',
    cta: {
      title: 'Make your 3D experience sellable.',
      description:
        'Book a solution session with one SKU family, or keep exploring the live sofa.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/product-configurator',
      secondaryLabel: 'See the configuration engine',
    },
  },
  {
    path: '/product-configurator',
    sections: [],
    faqs: [
      {
        question: 'Do I need 3D to use a CubeCom product configurator?',
        answer:
          'No. This page is about configuration logic and commerce resolution. 3D is optional — the same engine powers 2D UIs, APIs, and the 3D Product Configurator when you need a visual surface.',
      },
      {
        question: 'How is this different from Shopify options or variant matrices?',
        answer:
          'Variant matrices explode and still miss cross-option constraints. CubeCom encodes dependencies and exclusions, resolves a valid state at runtime, then projects SKU, price, and inventory — without publishing every combination.',
      },
      {
        question: 'What kinds of rules can we model?',
        answer:
          'Option dependencies, exclusion rules, conditional availability, and product-family constraints — so illegal combinations never become sellable states.',
      },
      {
        question: 'What is commerce resolution?',
        answer:
          'Mapping a valid configuration to SKU, price, inventory, and cart-ready identity so every legal state is sellable across channels.',
      },
      {
        question: 'When should I look at the 3D Product Configurator?',
        answer:
          'When shoppers need to change materials, parts, or geometry visually. The 3D page is the buying experience; this page is the engine underneath.',
      },
    ],
    faqTitle: 'Product configurator FAQ',
    faqDescription:
      'For teams modeling catalog complexity — dependencies, exclusions, and sellable state — with or without 3D.',
    cta: {
      title: 'Bring the product family you’ve outgrown.',
      description:
        'We’ll map the options, constraints, and commerce resolution together.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/3d-product-configurator',
      secondaryLabel: 'Need visual 3D?',
    },
  },
  {
    path: '/headless-product-configurator',
    sections: [],
    faqs: [
      {
        question: 'Is CubeCom a headless CMS?',
        answer:
          'No. It is configuration infrastructure for sellable product state — not a content CMS or full ecommerce platform.',
      },
      {
        question: 'Can we use Next.js or a custom storefront?',
        answer:
          'Yes. You own the frontend and design system. Call resolve from your app while checkout stays on your commerce platform.',
      },
      {
        question: 'Who owns configuration rules in a headless stack?',
        answer:
          'CubeCom owns configuration truth — the product graph, constraints, and resolve. Your storefronts, sales tools, and agents consume the same sellable state instead of re-implementing rules per channel.',
      },
      {
        question: 'How does this relate to composable commerce?',
        answer:
          'CubeCom is the configuration capability in a composable stack — beside PIM, commerce engine, and storefront — not a replacement for those systems.',
      },
    ],
    faqTitle: 'Headless configurator FAQ',
    cta: {
      title: 'Walk your architecture with CubeCom.',
      description:
        'Storefront, PIM, cart, and where configuration should sit — mapped in one session.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/product-configuration-api',
      secondaryLabel: 'Product Configuration API',
    },
  },
  {
    path: '/product-configuration-api',
    sections: [],
    faqs: [
      {
        question: 'Is the API a replacement for our commerce platform?',
        answer:
          'No. It resolves configuration state. Your platform remains the system of record for checkout and orders.',
      },
      {
        question: 'Where is the OpenAPI / schema?',
        answer:
          'GraphQL schema is the primary contract (schema.gql). REST is limited to document bytes and health. See docs.cubecompro.com for current endpoints.',
      },
      {
        question: 'Can agents or MCP clients use the same product truth?',
        answer:
          'CubeCom exposes an agent-readable product interface for assistants. Prefer structured product tools over scraping marketing HTML.',
      },
      {
        question: 'Do we need CubeCom UI to use the API?',
        answer:
          'No. The UI is optional. The graph and resolution layer can power custom UIs.',
      },
    ],
    faqTitle: 'Configuration API FAQ',
    cta: {
      title: 'Bring the systems that need configuration truth.',
      description:
        'We’ll map the contract from selection to commerce.',
      primaryHref: '/#contact',
      primaryLabel: 'Discuss API access',
      secondaryHref: 'https://docs.cubecompro.com/developers/graphql',
      secondaryLabel: 'GraphQL docs',
    },
  },
  {
    path: '/integrations/shopify',
    sections: [
      {
        kind: 'prose',
        eyebrow: 'Integration preview',
        title: 'Shopify keeps checkout. CubeCom resolves the product decision.',
        paragraphs: [
          'This page describes the intended Shopify pattern: configure beside the PDP, resolve to a sellable Shopify variant or line item, keep cart and checkout on Shopify.',
          'A first-party Shopify app (theme extension, metafields sync) is not shipping yet. Treat this as early access architecture — not an installable App Store listing.',
        ],
      },
      {
        kind: 'bullets',
        eyebrow: 'What works today',
        title: 'Ship the shopper loop before the App Store listing.',
        bullets: [
          'Model options and constraints in CubeCom',
          'Resolve to a Shopify variant id / SKU you already sell',
          'Hand off to Shopify cart AJAX or Storefront API from your theme or headless storefront',
          'Use the sofa demo to validate the shopper loop before wiring catalog',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is there a Shopify App Store listing?',
        answer:
          'Not yet. Integration is available as an architecture and early access engagement — not a one-click public app.',
      },
      {
        question: 'Does CubeCom replace Shopify?',
        answer:
          'No. It sits beside Shopify and resolves configuration into sellable line items Shopify already understands.',
      },
      {
        question: 'What about Shopify’s native options?',
        answer:
          'Native options work for simple matrices. CubeCom helps when constraints, 3D, or decoration logic exceed a flat option set.',
      },
    ],
    faqTitle: 'Shopify configurator FAQ',
    cta: {
      title: 'Map your Shopify catalog (early access).',
      description: 'Bring a product family and how you sell variants today.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open live demo',
    },
  },
  {
    path: '/integrations/commercetools',
    sections: [
      {
        kind: 'prose',
        eyebrow: 'Integration preview',
        title: 'Configuration beside commercetools — not instead of it.',
        paragraphs: [
          'The intended pattern: commercetools remains catalog, cart, and checkout. CubeCom owns configuration rules and optional 3D, then hands a resolved SKU / variant into commercetools line items.',
          'This is early access / architecture guidance for composable teams. Do not expect a turnkey marketplace connector yet.',
        ],
      },
      {
        kind: 'links',
        eyebrow: 'Related',
        title: 'Headless and API',
        links: [
          {
            href: '/headless-product-configurator',
            label: 'Headless model',
          },
          {
            href: '/product-configuration-api',
            label: 'Product Configuration API',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this a commercetools marketplace connector?',
        answer:
          'Not yet. CubeCom integrates as configuration infrastructure beside commercetools — available as early access architecture, not a finished marketplace app.',
      },
      {
        question: 'Can we use CubeCom headless with commercetools?',
        answer:
          'Yes. That is the primary pattern: commercetools for commerce primitives, CubeCom for configuration truth and experience UI.',
      },
    ],
    faqTitle: 'commercetools FAQ',
    cta: {
      title: 'Talk through your commercetools architecture.',
      description: 'Frontend, catalog modeling, and where configuration should attach.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/headless-product-configurator',
      secondaryLabel: 'Headless model',
    },
  },
  {
    path: '/industries/furniture',
    sections: [
      {
        kind: 'prose',
        tone: 'muted',
        eyebrow: 'Category depth',
        title: 'Furniture catalogs explode. Photography does not scale.',
        paragraphs: [
          'The demo proves the loop on a sofa. Production furniture catalogs usually need the same graph thinking across sectionals, modular systems, chairs, tables, and case goods — with dimensions, fabrics, finishes, and dependency rules that photography cannot cover.',
          'CubeCom is not “a sofa viewer.” It is configuration infrastructure for furniture brands that need every valid look to remain a fulfillable commerce state.',
        ],
      },
      {
        kind: 'columns',
        eyebrow: 'Product types',
        title: 'Upholstery, case goods, and fulfillment constraints.',
        columns: [
          {
            title: 'Upholstery',
            items: [
              'Sectional sofas and modular seating',
              'Frames, fabrics, legs, cushions',
              'Fabric compatibility and grade rules',
            ],
          },
          {
            title: 'Case & tables',
            items: [
              'Chairs and dining sets',
              'Tables with top / base combinations',
              'Cabinets with finish and hardware options',
            ],
          },
          {
            title: 'Fulfillment concerns',
            items: [
              'Dimensions and packaging constraints',
              'Component / BOM hints for ops',
              'Custom order vs stocked variants',
            ],
          },
        ],
      },
      {
        kind: 'steps',
        tone: 'muted',
        eyebrow: 'Configuration flow',
        title: 'Structure → materials → sellable state.',
        steps: [
          {
            title: 'Choose structure',
            body: 'Frame, size, or modular arrangement — invalid sizes never unlock incompatible finishes.',
          },
          {
            title: 'Choose materials',
            body: 'Fabrics and finishes update the scene and reprice only when the graph says the state is legal.',
          },
          {
            title: 'Resolve & share',
            body: 'SKU, price, and inventory update. Sales can reopen the same configuration from a link — including showroom follow-ups.',
          },
        ],
      },
      {
        kind: 'bullets',
        eyebrow: 'Also on the roadmap for furniture teams',
        title: 'AR and custom orders still start from the same graph.',
        description:
          'AR placement and deep BOM/ERP sync vary by engagement. The product graph is designed so those surfaces consume the same configuration state.',
        bullets: [
          'AR placement on supported devices using the same configuration',
          'Custom order workflows that still start from a valid graph state',
          'Showroom + web parity via shareable configuration identity',
          'Works beside Shopify or composable checkout',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is CubeCom only for sofas?',
        answer:
          'No. Sofas are the live proof. The same model fits sectionals, chairs, tables, cabinets, modular systems, and other configurable hard goods.',
      },
      {
        question: 'Can salespeople share a configured sofa?',
        answer:
          'Yes. Shareable links restore the same graph state used for price and inventory — useful for showroom and remote selling.',
      },
      {
        question: 'How do you handle fabrics that are not available on every frame?',
        answer:
          'As constraints on the product graph. Incompatible combinations are blocked before they become a look or a cart line.',
      },
      {
        question: 'Do we need to photograph every combination?',
        answer:
          'No. That is the point of interactive configuration — show legal looks from materials and models instead of an infinite shoot list.',
      },
    ],
    faqTitle: 'Furniture configurator FAQ',
    cta: {
      title: 'Put your furniture catalog on CubeCom.',
      description: 'Start with one hero SKU family and map rules to commerce.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open sofa demo',
    },
  },
  {
    path: '/industries/apparel',
    sections: [
      {
        kind: 'proof',
        tone: 'muted',
        eyebrow: 'Resolved output',
        title: 'Color + fit + size becomes a sellable state.',
        configuration: [
          { label: 'Color', value: 'Navy' },
          { label: 'Fit', value: 'Regular' },
          { label: 'Size', value: 'M' },
        ],
        resolved: [
          { label: 'SKU', value: 'TEE-NAV-REG-M' },
          { label: 'Price', value: '$32' },
          { label: 'Inventory', value: '42 available' },
          {
            label: 'Cart payload',
            value: '{ sku, price, qty: 1, configurationId }',
          },
        ],
        note: 'Try oversized + size S in the demo — constraints rewrite the illegal combination before cart.',
      },
      {
        kind: 'steps',
        eyebrow: 'Apparel configuration flow',
        title: 'From colorway to cart line',
        steps: [
          {
            title: 'Choose merchandising options',
            body: 'Colorways, fits, and sizes update the scene. Invalid pairs are blocked in the graph.',
          },
          {
            title: 'Optional decoration',
            body: 'Logo Editor can place artwork on the same product identity when decoration changes what you sell.',
          },
          {
            title: 'Resolve commerce',
            body: 'SKU, price, and inventory update so PDP, share links, and cart stay aligned.',
          },
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Surfaces',
        title: 'Soft goods need rules, not orphaned presets.',
        columns: [
          {
            title: 'Configure',
            items: [
              'Colorways, fits, and sizes',
              'Decoration placement rules',
              'Availability constraints',
            ],
          },
          {
            title: 'Sell',
            items: [
              'Configurator embed on PDP',
              'Shareable configuration links',
              'Sellable cart handoff',
            ],
          },
        ],
      },
      {
        kind: 'links',
        eyebrow: 'Try it',
        title: 'Demos and related intents',
        links: [
          { href: '/demo/tshirt', label: 'Full tee demo' },
          { href: '/demo', label: 'Sofa demo' },
          {
            href: '/product-configurator',
            label: 'Rules & variants',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Do you support logo and print placement?',
        answer:
          'Yes. Logo Editor is a CubeCom surface for 2D decoration on the same product graph as commerce resolution.',
      },
      {
        question: 'Can apparel work without full 3D?',
        answer:
          'Yes. Use 3D where it helps, and keep rules plus decoration for categories that stay mostly 2D.',
      },
      {
        question: 'How do fit and size constraints work?',
        answer:
          'As graph rules. In the live tee demo, oversized blocks size S and heather blocks oversized — before an unsellable look reaches cart.',
      },
    ],
    faqTitle: 'Apparel configurator FAQ',
    cta: {
      title: 'Map your apparel configuration flow.',
      description: 'Bring colorways, decoration rules, and how you sell today.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/demo/tshirt',
      secondaryLabel: 'Open tee demo',
    },
  },
];

export function getSeoBody(path: string): SeoBody {
  const body = seoBodies.find((entry) => entry.path === path);
  if (!body) {
    throw new Error(`Unknown SEO body: ${path}`);
  }
  return body;
}
