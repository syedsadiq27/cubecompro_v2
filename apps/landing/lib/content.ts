export const nav = [
  { href: '/#why', label: 'Why Stage' },
  { href: '/#stage', label: 'How it works' },
  { href: '/#surfaces', label: 'Surfaces' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#contact', label: 'Session' },
] as const;

export const whyReasons = [
  {
    title: 'Photography cannot keep up with options',
    body: 'A sofa with three frames, four fabrics, and three legs is already dozens of looks. Your catalog has more. The Stage shows every valid combination without another shoot.',
  },
  {
    title: 'Shoppers buy what they can see clearly',
    body: 'Proportion, finish, and combination on a controlled Stage beat a flat swatch grid. Fewer “not what I expected” returns.',
  },
  {
    title: 'A look must become a line item',
    body: 'Pretty 3D is not enough. CubeCom resolves the visible product to SKU, price, and inventory — ready for cart, quote, or a shared link.',
  },
  {
    title: 'One product truth across web and sales',
    body: 'The state a shopper configures is the same state a salesperson opens. No parallel spreadsheets. No mismatched quotes.',
  },
] as const;

export const graphNodes = [
  'Configuration rules',
  '3D scene state',
  'SKU / variants',
  'Pricing',
  'Inventory',
  'Commerce actions',
] as const;

export const stageBeats = [
  {
    label: 'Change what is on Stage',
    detail: 'Walnut frame. Beige fabric. Brass legs. The product moves — not a separate form.',
  },
  {
    label: 'CubeCom holds the truth',
    detail: 'Rules decide what is allowed. The product graph keeps scene and catalog in step.',
  },
  {
    label: 'Commerce follows the product',
    detail: 'SKU, price, inventory, and cart resolve from that same state — not a second system guessing.',
  },
] as const;

export const stageOutcomes = [
  {
    title: 'State → SKU',
    body: 'What you see on Stage maps to a real variant you can fulfill.',
  },
  {
    title: 'Share the state',
    body: 'Send a link. Restore the exact product decision — price and stock included.',
  },
  {
    title: 'Block bad combinations',
    body: 'Invalid options never reach cart. Constraints live with the product, not in tribal knowledge.',
  },
] as const;

export const solutions = [
  {
    name: 'Backoffice',
    role: 'Catalog & rules',
    body: 'Where products enter the Stage — graphs, constraints, pricing, and commerce mappings.',
  },
  {
    name: '3D Editor',
    role: 'Scene authoring',
    body: 'Compose the physical product on Stage: objects, materials, and configuration structure.',
  },
  {
    name: 'Logo Editor',
    role: '2D decoration',
    body: 'Place artwork on apparel and branded goods without leaving the same product truth.',
  },
  {
    name: 'AI Image Generator',
    role: 'Visual output',
    body: 'Pull catalog and campaign stills from configuration state — not from another shoot for every SKU.',
  },
  {
    name: 'Commerce SDK',
    role: 'Storefront embed',
    body: 'Put the Stage on your commerce page. Resolved SKU, price, inventory, and cart stay wired.',
  },
] as const;

export const plans = [
  {
    name: 'Starter',
    foundingPrice: '$49',
    regularPrice: '$99',
    blurb: 'One product graph. Prove the Stage on a real catalog.',
    bestFor: 'First catalog / pilot',
    features: [
      '1 product graph',
      'Stage viewer + configurator',
      '100 saved configurations',
      'SKU / price mapping',
      'Basic embed',
      'Community support',
    ],
    cta: 'Start on Stage',
    interest: 'starter' as const,
    featured: false,
  },
  {
    name: 'Pro',
    foundingPrice: '$149',
    regularPrice: '$249',
    blurb: 'Production brands — rules, commerce sync, and shareable state.',
    bestFor: 'Live storefronts',
    features: [
      '5 product graphs',
      'Constraint engine',
      'Commerce sync',
      'Shareable Stage links',
      'Analytics',
      'AR',
      'Decoration Editor basic',
      'API access',
    ],
    cta: 'Go Pro',
    interest: 'pro' as const,
    featured: true,
  },
  {
    name: 'Enterprise',
    foundingPrice: 'Custom',
    regularPrice: null as string | null,
    blurb: 'Multi-brand Stage — PIM/ERP, SSO, CPQ, and dedicated environments.',
    bestFor: 'Brands & custom infra',
    features: [
      'Unlimited product graphs',
      'PIM / ERP ingestion',
      'SSO and team roles',
      'Custom CPQ',
      'Multiple environments',
      'Dedicated infrastructure',
      'SLA',
      'Custom integrations',
      'Implementation support',
    ],
    cta: 'Talk to CubeCom',
    interest: 'enterprise' as const,
    featured: false,
  },
];

export const faqs = [
  {
    question: 'Why put my brand on a 3D Stage?',
    answer:
      'Because options outrun photography, and a flat PDP cannot carry every valid look. On Stage, shoppers see the real combination — and CubeCom still resolves it to something you can sell.',
  },
  {
    question: 'What is CubeCom Pro?',
    answer:
      'The Digital Product Stage for configurable commerce. Rules, 3D state, SKU, pricing, inventory, and cart stay on one product graph — not a viewer bolted onto checkout.',
  },
  {
    question: 'Is CubeCom a 3D plugin or viewer kit?',
    answer:
      'No. Viewers display models. CubeCom stages products: configuration changes the object and the commerce line together.',
  },
  {
    question: 'What surfaces do we get?',
    answer:
      'Backoffice, 3D Editor, Logo Editor, AI Image Generator, and a Commerce SDK — each working from the same product graph.',
  },
  {
    question: 'How does a Stage configuration become a SKU?',
    answer:
      'Valid state resolves through the product graph to a concrete variant or quote line, price, and inventory. Invalid combinations are blocked before cart or share.',
  },
  {
    question: 'Do we replace our PIM or storefront?',
    answer:
      'No. CubeCom sits beside them. Catalog in, Stage experience in the middle, resolved commerce out — through embed, API, or cart integration.',
  },
  {
    question: 'Which products belong on Stage?',
    answer:
      'Configurable physical goods: furniture, apparel, accessories, equipment — anywhere finish, fit, or option logic must match what you can fulfill.',
  },
  {
    question: 'Can someone reopen the exact product?',
    answer:
      'Yes. Shareable Stage links restore the same graph state used for price and stock — shopper, designer, or salesperson see one truth.',
  },
  {
    question: 'How does pricing work?',
    answer:
      'Founding plans are on this page. Enterprise is scoped to your catalogs and stack. Decoration and image generation stay modular.',
  },
  {
    question: 'What is a CubeCom session?',
    answer:
      'Thirty minutes on your catalog, rules, and commerce path — then a clear recommendation. Not a slide tour of features.',
  },
] as const;
