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
    sections: [
      {
        kind: 'demo',
        eyebrow: 'Live proof',
        title: 'Configure a sofa. Watch commerce update.',
        description:
          'This is not a static render. Change frame, fabric, and legs — SKU, price, and inventory resolve from the same configuration state a cart would receive.',
      },
      {
        kind: 'proof',
        tone: 'muted',
        eyebrow: 'Resolved output',
        title: 'What “sell the state” actually means',
        description:
          'Buyers and search engines both need evidence. Here is a concrete configuration and the commerce payload it produces.',
        configuration: [
          { label: 'Frame', value: 'Walnut' },
          { label: 'Fabric', value: 'Beige' },
          { label: 'Legs', value: 'Brass' },
        ],
        resolved: [
          { label: 'SKU', value: 'SOFA-WAL-BEI-BRA' },
          { label: 'Price', value: '$2,399' },
          { label: 'Inventory', value: '4 available' },
          {
            label: 'Cart payload',
            value: '{ sku, price, qty: 1, configurationId }',
          },
        ],
        note: 'Exact codes and pricing come from your product graph. The demo uses a sofa family to prove the loop.',
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        title: 'From visual choice to purchasable identity',
        description:
          'A 3D product configurator for ecommerce has to close a loop — not just orbit a model.',
        steps: [
          {
            title: '1. Shopper changes the product',
            body: 'Materials, components, and finishes update in the scene. Invalid options are blocked before they become a look.',
          },
          {
            title: '2. CubeCom understands the state',
            body: 'Configuration state is evaluated against the product graph: attributes, rules, and commerce references.',
          },
          {
            title: '3. Commerce updates correctly',
            body: 'Resolve returns SKU, price, inventory, and a cart-ready line — the same identity sales and support can reopen from a share link.',
          },
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Comparison',
        title: 'Ordinary 3D viewer vs CubeCom',
        description:
          'Most “3D configurators” stop at visualization. Ecommerce needs the purchase identity to match what the shopper saw.',
        columns: [
          {
            title: 'Ordinary 3D viewer',
            items: [
              'Material swaps and camera controls',
              'Looks great in screenshots',
              'Rules live in the frontend (or nowhere)',
              'Cart still guesses a variant',
              'Sales cannot reopen the exact state',
            ],
          },
          {
            title: 'CubeCom Pro',
            items: [
              'Same visual options, constraint-aware',
              'Looks that are also sellable states',
              'Rules on the product graph',
              'SKU / price / inventory from resolve',
              'Shareable configuration identity',
            ],
          },
        ],
      },
      {
        kind: 'prose',
        eyebrow: 'Architecture',
        title: 'Product graph → scene state → commerce state',
        paragraphs: [
          'CubeCom sits between catalog truth and the shopper experience. Merchants author a product graph: options, values, constraints, 3D bindings, and commerce references.',
          'Shoppers submit a configuration state. Resolve returns two synchronized outcomes: scene state for the viewer and commerce state for SKU, price, inventory, and cart handoff.',
          'That is why the 3D surface is not a separate product. It is one experience on the same graph that powers API clients, embeds, and sales tools.',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Implementation options',
        title: 'Embed, SDK, or API — same graph',
        columns: [
          {
            title: 'Embed',
            items: [
              'Drop a configurator experience on a PDP',
              'Keep checkout on Shopify or your cart',
              'Best for teams that want a shipped surface fast',
            ],
          },
          {
            title: 'SDK / custom UI',
            items: [
              'Own the design system and layout',
              'Drive options from resolve responses',
              'Use CubeCom 3D or your own renderer',
            ],
          },
          {
            title: 'Configuration API',
            items: [
              'Call resolve from services and agents',
              'Validate state without a viewer',
              'Feed middleware, CPQ, and storefronts',
            ],
          },
        ],
      },
      {
        kind: 'bullets',
        eyebrow: 'Performance',
        title: 'What production 3D ecommerce actually needs',
        description:
          'A configurator that cannot load or update options will not convert — regardless of how accurate the SKU mapping is.',
        bullets: [
          'GLB-first assets with materials applied as configuration effects',
          'Option changes update state without full page reloads',
          'Constraints evaluated before invalid looks are shown',
          'Commerce resolve is a discrete call — not a client-side guess',
          'Share links restore the same graph state, not a screenshot',
        ],
      },
      {
        kind: 'columns',
        eyebrow: 'Industries',
        title: 'Where 3D configuration pays for itself',
        columns: [
          {
            title: 'Furniture',
            items: [
              'Frames, fabrics, legs, modular pieces',
              'Photography budgets that cannot cover every combo',
              'Showroom and web sharing the same state',
            ],
          },
          {
            title: 'Other hard goods',
            items: [
              'Configured finishes and components',
              'Accessory compatibility rules',
              'Sales-assisted quoting on the same graph',
            ],
          },
        ],
      },
      {
        kind: 'links',
        tone: 'muted',
        eyebrow: 'Go deeper',
        title: 'Related resources',
        links: [
          { href: '/product-configurator', label: 'Rules & variant explosion' },
          {
            href: '/product-configuration-api',
            label: 'Configuration API contracts',
          },
          { href: '/industries/furniture', label: 'Furniture vertical' },
          { href: '/demo', label: 'Full sofa demo' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a 3D product configurator for ecommerce?',
        answer:
          'An interactive experience that lets shoppers change product options in 3D and purchase a specific configuration. In CubeCom Pro, that configuration state must resolve to SKU, price, and inventory before checkout — not only update a render.',
      },
      {
        question: 'How is CubeCom different from a WebGL product viewer?',
        answer:
          'A viewer shows a model. CubeCom binds visual choices to a product graph with constraints and commerce resolution, so the look and the cart line are the same state.',
      },
      {
        question: 'Can invalid option combinations be blocked in 3D?',
        answer:
          'Yes. The constraint engine can disable or rewrite incompatible choices so shoppers cannot build unsellable states in the scene.',
      },
      {
        question: 'Does the 3D configuration match what goes into the cart?',
        answer:
          'That is the requirement. Resolve returns commerce data for the visible configuration so the cart reflects the same SKU and price the shopper configured.',
      },
      {
        question: 'Do we have to use CubeCom’s 3D viewer?',
        answer:
          'No. You can embed CubeCom surfaces or drive your own renderer from the same resolved scene state and commerce outcomes.',
      },
      {
        question: 'Where should we start?',
        answer:
          'Open the live sofa demo to see the loop, then book a session with one product family from your catalog — options, constraints, and how you sell variants today.',
      },
    ],
    faqTitle: '3D product configurator FAQ',
    faqDescription:
      'Practical answers for merchants evaluating 3D configurators for ecommerce — not generic WebGL glossary entries.',
    cta: {
      title: 'Make your 3D configurator purchasable.',
      description:
        'Book a solution session with one SKU family, or keep exploring the live sofa.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open full sofa demo',
    },
  },
  {
    path: '/product-configurator',
    sections: [],
    faqs: [
      {
        question: 'Do I need 3D to use a CubeCom product configurator?',
        answer:
          'No. 3D is optional. The same product graph can power 2D UI, embeds, and APIs — with optional 3D when the category needs it.',
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
    faqTitle: 'FAQ',
    faqDescription: undefined,
    cta: {
      title: 'Map your catalog rules onto the product graph.',
      description:
        'Bring one product family. We show what belongs in the graph versus the storefront.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
      secondaryHref: '/demo',
      secondaryLabel: 'Open live demo',
    },
  },
  {
    path: '/headless-product-configurator',
    sections: [
      {
        kind: 'prose',
        eyebrow: 'Architecture intent',
        title: 'Keep your frontend. Run configuration as infrastructure.',
        paragraphs: [
          'A headless product configurator separates presentation from sellable-state logic. Your Next.js app, custom storefront, or design system owns UX. CubeCom owns the product graph, constraints, and resolve.',
          'That is different from a theme plugin that owns the entire configurator UI, and different from a pure 3D viewer that never touches commerce.',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Ownership boundary',
        title: 'Frontend owns presentation. CubeCom owns sellable state.',
        columns: [
          {
            title: 'You own',
            items: [
              'Design system and storefront UX',
              'CMS and merchandising content',
              'Checkout platform of record',
              'Deployment and CI for your apps',
            ],
          },
          {
            title: 'CubeCom owns',
            items: [
              'Configuration rules and validity',
              'State → SKU / price / inventory',
              'Shareable configuration identity',
              'Optional 3D / embed surfaces',
            ],
          },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'Composable pattern',
        title: 'How headless teams typically wire CubeCom',
        steps: [
          {
            title: 'Author the graph',
            body: 'Options, constraints, and commerce references live in CubeCom — not in React state alone.',
          },
          {
            title: 'Render your UI',
            body: 'Call resolve as shoppers change options. Drive your components (or CubeCom embeds) from the response.',
          },
          {
            title: 'Hand off to cart',
            body: 'Pass the resolved SKU or line payload into Shopify, commercetools, or a custom cart adapter.',
          },
        ],
      },
      {
        kind: 'bullets',
        tone: 'muted',
        eyebrow: 'SDK posture',
        title: 'Bring your GraphQL client',
        description:
          'Until a first-party package ships, generate typed operations from the CubeCom schema and call POST /graphql with a bearer token.',
        bullets: [
          'Works with fetch, urql, Apollo, or your internal client',
          'Same resolve contract for web and agents',
          'Optional CubeCom UI when you do not want to build every control',
        ],
      },
      {
        kind: 'links',
        eyebrow: 'Engineer next steps',
        title: 'Contracts and surfaces',
        links: [
          {
            href: '/product-configuration-api',
            label: 'Configuration API',
          },
          {
            href: 'https://docs.cubecompro.com/developers/graphql',
            label: 'GraphQL docs',
          },
          {
            href: '/3d-product-configurator',
            label: 'Optional 3D surface',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is CubeCom a headless CMS?',
        answer:
          'No. It is configuration infrastructure for purchasable product state — not a content CMS or full ecommerce platform.',
      },
      {
        question: 'Can we use Next.js or a custom storefront?',
        answer:
          'Yes. Embed the experience or call the configuration API from your app while checkout stays on your commerce platform.',
      },
      {
        question: 'Does headless mean we must build our own 3D viewer?',
        answer:
          'No. You can use CubeCom surfaces or bring your own renderer against the same graph.',
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
      secondaryLabel: 'Configuration API',
    },
  },
  {
    path: '/product-configuration-api',
    sections: [
      {
        kind: 'prose',
        eyebrow: 'For engineers',
        title: 'Resolve configuration state to commerce payloads',
        paragraphs: [
          'This page is about contracts — not brand positioning. The product configuration API validates and advances configuration state, then returns sellable outcomes your storefront or middleware can trust.',
          'UI is optional. The same resolve path powers embeds, custom React apps, sales tools, and agents.',
        ],
      },
      {
        kind: 'code',
        tone: 'muted',
        eyebrow: 'Example',
        title: 'resolveConfiguration',
        description:
          'Illustrative GraphQL shape. Exact fields ship in schema.gql — treat that as the machine contract.',
        caption: 'Query',
        code: `query ResolveSofa($input: ConfigurationStateInput!) {
  resolveConfiguration(input: $input) {
    valid
    violations { code message }
    commerce {
      sku
      price
      currency
      inventory
    }
    scene {
      materials { target color roughness }
      visibility { node visible }
    }
  }
}`,
      },
      {
        kind: 'code',
        eyebrow: 'Example input',
        title: 'Configuration state',
        caption: 'Variables',
        code: `{
  "input": {
    "productId": "sofa-01",
    "selectionsJson": "{\\"frame\\":\\"walnut\\",\\"fabric\\":\\"beige\\",\\"legs\\":\\"brass\\"}"
  }
}`,
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Request / response concerns',
        title: 'What callers typically need',
        columns: [
          {
            title: 'Inbound',
            items: [
              'Product / graph version identity',
              'Selection map (attribute → value)',
              'Auth for authoring vs public resolve',
            ],
          },
          {
            title: 'Outbound',
            items: [
              'Validity + violation list',
              'Resolved SKU / price / inventory',
              'Scene effects for viewers',
              'Cart / CPQ handoff fields',
            ],
          },
        ],
      },
      {
        kind: 'bullets',
        eyebrow: 'Integration notes',
        title: 'Not a replacement commerce platform',
        bullets: [
          'Checkout and orders stay on Shopify, commercetools, or your cart',
          'PIM remains catalog source of truth — CubeCom references it',
          'Generate clients from schema.gql until an official SDK ships',
          'Docs: authentication, GraphQL, and resolve guides on docs.cubecompro.com',
        ],
      },
      {
        kind: 'links',
        eyebrow: 'Docs',
        title: 'Read the technical pages',
        links: [
          {
            href: 'https://docs.cubecompro.com/developers/api',
            label: 'API overview',
          },
          {
            href: 'https://docs.cubecompro.com/developers/graphql',
            label: 'GraphQL API',
          },
          {
            href: 'https://docs.cubecompro.com/guides/resolve-sku',
            label: 'Resolve → SKU guide',
          },
          {
            href: '/headless-product-configurator',
            label: 'Headless architecture',
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
      title: 'Discuss API access for your stack.',
      description:
        'Tell us your storefront, PIM, and cart path — we map the integration surface.',
      primaryHref: '/#contact',
      primaryLabel: 'Book a solution session',
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
        title: 'Shopify stays checkout. CubeCom resolves the product decision.',
        paragraphs: [
          'This page describes the intended Shopify pattern: configure beside the PDP, resolve to a sellable Shopify variant or line item, keep cart and checkout on Shopify.',
          'A first-party Shopify app (theme extension, metafields sync) is not shipping yet. Treat this as early access architecture — not an installable App Store listing.',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Division of labor',
        title: 'What each system owns',
        columns: [
          {
            title: 'Shopify keeps',
            items: ['Catalog & inventory', 'Cart & checkout', 'Orders & payments'],
          },
          {
            title: 'CubeCom adds',
            items: [
              'Configuration rules',
              '3D / decoration experiences',
              'State → sellable variant resolution',
            ],
          },
        ],
      },
      {
        kind: 'bullets',
        eyebrow: 'What works today',
        title: 'Practical path while the app is early',
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
        title: 'Configuration beside commercetools — not instead of it',
        paragraphs: [
          'The intended pattern: commercetools remains catalog, cart, and checkout. CubeCom owns configuration rules and optional 3D, then hands a resolved SKU / variant into commercetools line items.',
          'This is early access / architecture guidance for composable teams. Do not expect a turnkey marketplace connector yet.',
        ],
      },
      {
        kind: 'columns',
        tone: 'muted',
        eyebrow: 'Fit',
        title: 'Built for teams already on commercetools',
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
              'Constraint-aware configuration',
              'Optional 3D experiences',
              'Shareable configuration state',
            ],
          },
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
            label: 'Configuration API',
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
        kind: 'demo',
        eyebrow: 'Live furniture proof',
        title: 'Sofa: frame, fabric, legs — sellable state',
        description:
          'Furniture is the cleanest starting vertical for CubeCom: material and component choices explode photography budgets, and shoppers need to see the look before they buy.',
      },
      {
        kind: 'prose',
        tone: 'muted',
        eyebrow: 'Category depth',
        title: 'Beyond a single sofa SKU',
        paragraphs: [
          'The demo proves the loop on a sofa. Production furniture catalogs usually need the same graph thinking across sectionals, modular systems, chairs, tables, and case goods — with dimensions, fabrics, finishes, and dependency rules that photography cannot cover.',
          'CubeCom is not “a sofa viewer.” It is configuration infrastructure for furniture brands that need every valid look to remain a fulfillable commerce state.',
        ],
      },
      {
        kind: 'columns',
        eyebrow: 'Product types',
        title: 'Furniture configuration patterns',
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
        title: 'A furniture PDP that does not lie',
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
        title: 'Room-scale and custom order paths',
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
        kind: 'demo',
        product: 'tshirt',
        eyebrow: 'Live apparel proof',
        title: 'Configure a tee. Watch commerce update.',
        description:
          'Color, fit, and size are not visual presets — they resolve to SKU, price, and inventory on the same product graph as furniture.',
      },
      {
        kind: 'proof',
        tone: 'muted',
        eyebrow: 'Resolved output',
        title: 'A sellable apparel state',
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
        title: 'Built for soft goods teams',
        columns: [
          {
            title: 'Create',
            items: [
              '3D Editor for form',
              'Logo Editor for decoration',
              'Backoffice for rules',
            ],
          },
          {
            title: 'Sell',
            items: [
              'Configurator embed on PDP',
              'Shareable configuration links',
              'Resolved cart handoff',
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
