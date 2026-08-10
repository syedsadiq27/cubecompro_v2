export const nav = [
  { href: '/#why', label: 'Why 3D' },
  { href: '/#stage', label: 'How it works' },
  { href: '/#surfaces', label: 'Surfaces' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#contact', label: 'Session' },
] as const;

export const whyReasons = [
  {
    title: 'Photography cannot keep up with options',
    body: 'A sofa with three frames, four fabrics, and three legs is already dozens of looks. Your catalog has more. Interactive 3D shows every valid combination without another shoot.',
  },
  {
    title: 'Shoppers buy what they can see clearly',
    body: 'Proportion, finish, and combination in context beat a flat swatch grid. Fewer “not what I expected” returns.',
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

export const howItWorksSteps = [
  {
    label: 'Shopper makes a choice',
    detail:
      'They choose a walnut frame, beige fabric, and brass legs. The 3D product updates instantly.',
  },
  {
    label: 'CubeCom checks what is actually possible',
    detail:
      'CubeCom applies your product rules and knows which combinations, variants, prices, and inventory are valid.',
  },
  {
    label: 'The correct product goes to commerce',
    detail:
      'The shopper’s final configuration resolves to the right SKU, price, inventory, and cart data.',
  },
] as const;

export const howItWorksFlow = [
  {
    title: 'Your catalog',
    items: ['Products', 'Options', 'Variants', 'Prices', 'Inventory'],
    emphasized: false,
  },
  {
    title: 'CubeCom',
    items: ['Rules + 3D configuration'],
    emphasized: true,
  },
  {
    title: 'Your storefront',
    items: [
      'Correct product',
      'Correct price',
      'Correct SKU',
      'Add to cart',
    ],
    emphasized: false,
  },
] as const;

export const solutions = [
  {
    name: 'Backoffice',
    role: 'Catalog & rules',
    body: 'Where products enter the system — graphs, constraints, pricing, and commerce mappings.',
  },
  {
    name: '3D Editor',
    role: 'Scene authoring',
    body: 'Compose the physical product: objects, materials, and configuration structure for live experiences.',
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
    body: 'Embed the experience on your commerce page. Resolved SKU, price, inventory, and cart stay wired.',
  },
] as const;

export const plans = [
  {
    name: 'Starter',
    foundingPrice: '$49',
    regularPrice: '$99',
    blurb: 'One product graph. Prove the model on a real catalog.',
    bestFor: 'First catalog / pilot',
    features: [
      '1 product graph',
      '3D viewer + configurator',
      '100 saved configurations',
      'SKU / price mapping',
      'Basic embed',
      'Community support',
    ],
    cta: 'Start building',
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
      'Shareable configurations',
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
    blurb: 'Multi-brand setups — PIM/ERP, SSO, CPQ, and dedicated environments.',
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
    question: 'Why does my brand need 3D?',
    answer:
      'Because options outrun photography, and a flat PDP cannot carry every valid look. Interactive 3D lets shoppers see the real combination — and CubeCom still resolves it to something you can sell.',
  },
  {
    question: 'What is CubeCom Pro?',
    answer:
      'CubeCom Pro is the Digital Product Stage: commerce infrastructure that turns product data into interactive, rule-bound 3D experiences. Configuration rules, 3D state, SKU, pricing, inventory, and cart stay on one product graph — not a viewer bolted onto checkout.',
  },
  {
    question: 'Is CubeCom just a 3D plugin or viewer kit?',
    answer:
      'No. Viewers display models. CubeCom keeps configuration and commerce synchronized: changing the object updates the sellable line together.',
  },
  {
    question: 'What surfaces do we get?',
    answer:
      'Backoffice, 3D Editor, Logo Editor, AI Image Generator, and a Commerce SDK — each working from the same product graph.',
  },
  {
    question: 'How does a configuration become a sellable SKU?',
    answer:
      'Valid state resolves through the product graph to a concrete variant or quote line, price, and inventory. Invalid combinations are blocked before cart or share.',
  },
  {
    question: 'Do we replace our PIM or storefront?',
    answer:
      'No. CubeCom sits beside them. Catalog in, configurator experience in the middle, resolved commerce out — through embed, API, or cart integration.',
  },
  {
    question: 'Which products are a good fit?',
    answer:
      'Configurable physical goods: furniture, apparel, accessories, equipment — anywhere finish, fit, or option logic must match what you can fulfill.',
  },
  {
    question: 'Can someone reopen the exact product?',
    answer:
      'Yes. Shareable links restore the same product graph state used for price and stock — shopper, designer, or salesperson see one truth.',
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
