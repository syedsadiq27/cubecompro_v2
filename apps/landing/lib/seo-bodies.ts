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
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'What shoppers need',
        title: 'Configure on Stage. Buy the exact configuration.',
        description:
          'Merchants search for 3D product configurators because static pages cannot show finish and combination. The ecommerce requirement is that every visual choice remains a sellable product state.',
        bullets: [
          'Interactive materials, finishes, and components in a 3D scene',
          'Option changes that update the shopper-facing product state immediately',
          'Shareable Stage views for sales, PDPs, and support',
          'AR placement on supported devices using the same configuration state',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'The CubeCom difference',
        title: 'Visual state is not enough.',
        description:
          'Most 3D configurators optimize for rendering. CubeCom Pro optimizes for the commerce loop: change the product → understand the state → update SKU, price, inventory, and cart.',
        columns: [
          {
            title: 'Typical 3D configurator focus',
            items: [
              'Model loading and camera controls',
              'Material swaps and option panels',
              'Embeddable viewer experiences',
            ],
          },
          {
            title: 'CubeCom Pro adds',
            items: [
              'Configuration rules that block invalid states',
              'Stage state → SKU / variant resolution',
              'Price and inventory synced to the same state',
              'Cart-ready outcomes for ecommerce checkout',
            ],
          },
        ],
      },
      {
        kind: 'links',
        eyebrow: 'Proof',
        title: 'Live Stage demo',
        description:
          'Change options and watch SKU, price, and inventory update — the loop a production 3D product configurator needs.',
        links: [{ href: '/demo', label: 'Sofa on Stage' }],
      },
    ],
    faqs: [
      {
        question: 'What is a 3D product configurator for ecommerce?',
        answer:
          'An interactive experience that lets shoppers change product options in 3D and purchase a specific configuration. In CubeCom Pro, that Stage state must resolve to SKU, price, and inventory before checkout.',
      },
      {
        question: 'Is CubeCom Pro only a 3D viewer?',
        answer:
          'No. The 3D surface is one interface. CubeCom Pro is the Digital Product Stage — configuration rules, 3D state, SKU, pricing, inventory, and cart stay synchronized.',
      },
      {
        question: 'Can invalid option combinations be blocked in 3D?',
        answer:
          'Yes. The constraint engine can disable or rewrite incompatible choices so shoppers cannot build unsellable states.',
      },
      {
        question: 'Does the 3D configuration match what goes into the cart?',
        answer:
          'That is the core requirement. CubeCom Pro resolves the visible configuration to commerce data so the cart line reflects the same SKU and price the shopper configured.',
      },
    ],
    faqTitle: '3D product configurator FAQ',
    faqDescription:
      'Answers for merchants evaluating 3D configurators for ecommerce storefronts.',
    cta: {
      title: 'See a Stage configuration resolve to commerce data.',
      description: 'Book a CubeCom session or open the live sofa demo first.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open sofa demo',
    },
  },
  {
    path: '/product-configurator',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'Configuration as commerce',
        title: 'Rules first. Pretty UI second.',
        description:
          'A product configurator only helps if invalid combinations never become orders. CubeCom encodes constraints on the product graph, then exposes Stage or custom UI on top.',
        bullets: [
          'Material, size, accessory, and region rules in one graph',
          'Valid states resolve to SKU, price, and inventory',
          'Works with 3D Stage, 2D decoration, or headless UI',
          'Shareable configuration state for sales and support',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Where teams get stuck',
        title: 'Option pickers without a product graph fail quietly.',
        columns: [
          {
            title: 'Without CubeCom',
            items: [
              'Frontend rules drift from catalog truth',
              'Sales quotes mismatch the website',
              'Invalid combos reach checkout or ERP',
            ],
          },
          {
            title: 'With CubeCom',
            items: [
              'One graph for Stage and commerce',
              'Blocked options before cart',
              'Same state restored from a share link',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need 3D to use a CubeCom product configurator?',
        answer:
          'No. 3D is a Stage surface. The same product graph can power 2D UI, embeds, and APIs — with optional 3D when the category needs it.',
      },
      {
        question: 'How is this different from Shopify options or variant matrices?',
        answer:
          'Variant matrices explode and still miss cross-option constraints. CubeCom encodes rules and resolves sellable state instead of pre-generating every combination.',
      },
      {
        question: 'Can we keep our existing storefront?',
        answer:
          'Yes. CubeCom sits beside your storefront and PIM. Configuration runs in the experience layer; resolved SKUs hand off to cart.',
      },
    ],
    faqTitle: 'Product configurator FAQ',
    cta: {
      title: 'Map your catalog rules onto Stage.',
      description:
        'Bring one product family. We show what belongs in the graph versus the storefront.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/demo',
      secondaryLabel: 'See Stage demo',
    },
  },
  {
    path: '/headless-product-configurator',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'Composable commerce',
        title: 'Keep your frontend. Stage the product graph behind it.',
        description:
          'Headless teams need configuration without adopting a closed theme plugin. CubeCom exposes rules and resolution as infrastructure.',
        bullets: [
          'Product graph and constraints as a service layer',
          'Render Stage, custom React, or another UI',
          'Sync resolved SKU and price into your cart adapter',
          'Same truth for web, sales tools, and agents',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Architecture',
        title: 'Frontend owns presentation. CubeCom owns sellable state.',
        columns: [
          {
            title: 'You own',
            items: [
              'Design system and storefront UX',
              'CMS and merchandising content',
              'Checkout platform of record',
            ],
          },
          {
            title: 'CubeCom owns',
            items: [
              'Configuration rules and validity',
              'State → SKU / price / inventory',
              'Shareable configuration identity',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is CubeCom a headless CMS?',
        answer:
          'No. It is Stage and configuration infrastructure for purchasable product state — not a content CMS or full ecommerce platform.',
      },
      {
        question: 'Can we use Next.js or a custom storefront?',
        answer:
          'Yes. Embed Stage or call the configuration API from your app while checkout stays on your commerce platform.',
      },
      {
        question: 'Does headless mean we must build our own 3D viewer?',
        answer:
          'No. You can use CubeCom Stage surfaces or bring your own renderer against the same graph.',
      },
    ],
    faqTitle: 'Headless configurator FAQ',
    cta: {
      title: 'Walk your architecture with CubeCom.',
      description:
        'Storefront, PIM, cart, and where Stage should sit — mapped in one session.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/product-configuration-api',
      secondaryLabel: 'Configuration API',
    },
  },
  {
    path: '/product-configuration-api',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'For engineers',
        title: 'Resolve configuration to commerce payloads.',
        description:
          'Call the same product graph shoppers see on Stage — valid options, blocked combinations, SKU, price, inventory, and cart-ready lines.',
        bullets: [
          'Validate and advance configuration state',
          'Read resolved commerce outcomes for a state',
          'Share and restore configuration identifiers',
          'Integrate with Shopify, commercetools, or custom carts',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Integration pattern',
        title: 'API in the middle of the commerce loop.',
        columns: [
          {
            title: 'Inbound',
            items: [
              'Catalog / PIM product and variant data',
              'Option definitions and constraint inputs',
            ],
          },
          {
            title: 'Outbound',
            items: [
              'Resolved SKU or quote line',
              'Price and inventory for the current state',
              'Cart / CPQ handoff payloads',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is the API a replacement for our commerce platform?',
        answer:
          'No. It resolves configuration state. Your platform remains the system of record for checkout and orders.',
      },
      {
        question: 'Can agents or MCP clients use the same product truth?',
        answer:
          'CubeCom exposes an agent-readable product interface for assistants. Prefer structured product tools over scraping marketing HTML.',
      },
      {
        question: 'Do we need Stage UI to use the API?',
        answer:
          'No. Stage is optional. The graph and resolution layer can power custom UIs.',
      },
    ],
    faqTitle: 'Configuration API FAQ',
    cta: {
      title: 'Discuss API access for your stack.',
      description:
        'Tell us your storefront, PIM, and cart path — we map the integration surface.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/headless-product-configurator',
      secondaryLabel: 'Headless overview',
    },
  },
  {
    path: '/integrations/shopify',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'Shopify merchants',
        title: 'Stage experiences that still check out on Shopify.',
        description:
          'Add 3D configuration without replacing Shopify cart, checkout, or inventory.',
        bullets: [
          'Configure on Stage inside or beside the PDP',
          'Resolve to Shopify variants or line items you can sell',
          'Keep Shopify as checkout system of record',
          'Share Stage links that restore the same merchandising state',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Division of labor',
        title: 'Shopify sells. CubeCom stages the product decision.',
        columns: [
          {
            title: 'Shopify keeps',
            items: ['Catalog & inventory', 'Cart & checkout', 'Orders & payments'],
          },
          {
            title: 'CubeCom adds',
            items: [
              'Configuration rules',
              '3D / decoration Stage',
              'State → sellable variant resolution',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does CubeCom replace Shopify?',
        answer:
          'No. It sits beside Shopify and resolves configuration into sellable line items Shopify already understands.',
      },
      {
        question: 'Can we use Shopify themes?',
        answer:
          'Yes. Embed Stage or host the experience and hand off to Shopify cart with the resolved variant.',
      },
      {
        question: 'What about Shopify’s native options?',
        answer:
          'Native options work for simple matrices. CubeCom helps when constraints, 3D, or decoration logic exceed a flat option set.',
      },
    ],
    faqTitle: 'Shopify configurator FAQ',
    cta: {
      title: 'Map your Shopify catalog to Stage.',
      description: 'Bring a product family and how you sell variants today.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open Stage demo',
    },
  },
  {
    path: '/integrations/commercetools',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'Composable stacks',
        title: 'Configuration for commercetools storefronts.',
        description:
          'Keep commercetools for catalog and cart. Use CubeCom for Stage configuration and sellable-state resolution.',
        bullets: [
          'Headless-friendly configuration graph',
          'Optional 3D Stage on your storefront',
          'Resolved SKU and price for commercetools cart handoff',
          'Fits Next.js and custom composable frontends',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Fit',
        title: 'Built for teams already on commercetools.',
        columns: [
          {
            title: 'You keep',
            items: [
              'commercetools catalog & cart',
              'Your frontend and design system',
              'Existing OMS / fulfillment',
            ],
          },
          {
            title: 'You add',
            items: [
              'Stage product experiences',
              'Constraint-aware configuration',
              'Shareable configuration state',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this a commercetools plugin marketplace app?',
        answer:
          'CubeCom integrates as configuration and Stage infrastructure beside commercetools — not as a replacement commerce platform.',
      },
      {
        question: 'Can we use CubeCom headless with commercetools?',
        answer:
          'Yes. That is a primary pattern: commercetools for commerce primitives, CubeCom for configuration truth and Stage UI.',
      },
    ],
    faqTitle: 'commercetools FAQ',
    cta: {
      title: 'Talk through your commercetools architecture.',
      description: 'Frontend, catalog modeling, and where Stage should attach.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/headless-product-configurator',
      secondaryLabel: 'Headless model',
    },
  },
  {
    path: '/industries/furniture',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'Furniture brands',
        title: 'Sofas and furniture that shoppers can change — and you can fulfill.',
        description:
          'Frame, fabric, and legs explode photography budgets. Stage shows every valid look and still resolves commerce.',
        bullets: [
          'Live sofa demo with SKU, price, and inventory',
          'Material and component constraints on the product graph',
          'Shareable configurations for showroom and web',
          'Works beside Shopify or composable checkout',
        ],
      },
      {
        kind: 'links',
        tone: 'muted',
        eyebrow: 'Proof',
        title: 'Configure a sofa on Stage now.',
        links: [{ href: '/demo', label: 'Open sofa demo' }],
      },
    ],
    faqs: [
      {
        question: 'Is CubeCom only for sofas?',
        answer:
          'No. Sofas are the live proof. The same Stage model fits chairs, tables, modular systems, and other configurable hard goods.',
      },
      {
        question: 'Can salespeople share a configured sofa?',
        answer:
          'Yes. Shareable Stage links restore the same graph state used for price and inventory.',
      },
    ],
    faqTitle: 'Furniture configurator FAQ',
    cta: {
      title: 'Put your furniture catalog on Stage.',
      description: 'Start with one hero SKU family and map rules to commerce.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open sofa demo',
    },
  },
  {
    path: '/industries/apparel',
    sections: [
      {
        kind: 'bullets',
        eyebrow: 'Apparel & accessories',
        title: 'Colorways, materials, and decoration that stay sellable.',
        description:
          'Apparel options and 2D decoration need the same product truth as hard goods — especially when logos and prints change the SKU story.',
        bullets: [
          'Configuration rules for color, material, and style',
          'Logo Editor for 2D decoration on Stage',
          'SKU-aligned outcomes for cart and inventory',
          'Commerce SDK for storefront embeds',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Surfaces',
        title: 'Built for soft goods teams.',
        columns: [
          {
            title: 'Create',
            items: ['3D Editor for form', 'Logo Editor for decoration', 'Backoffice for rules'],
          },
          {
            title: 'Sell',
            items: [
              'Stage embed on PDP',
              'Shareable configuration links',
              'Resolved cart handoff',
            ],
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
          'Yes. Use Stage where 3D helps, and keep rules plus decoration for categories that stay mostly 2D.',
      },
    ],
    faqTitle: 'Apparel configurator FAQ',
    cta: {
      title: 'Stage your apparel configuration flow.',
      description: 'Bring colorways, decoration rules, and how you sell today.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a CubeCom session',
      secondaryHref: '/demo',
      secondaryLabel: 'See Stage demo',
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
