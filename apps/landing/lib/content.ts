export const problemFlow = [
  'Shopper changes product',
  'Rules validate',
  'Visual state updates',
  'Commerce state resolves',
] as const;

export const benefitOutcomes = [
  'No duplicated rules',
  'No variant explosion',
  'No viewer / cart mismatch',
  'One sellable state',
] as const;

export const audiences = [
  { label: 'Furniture', href: '/industries/furniture' },
  { label: 'Apparel', href: '/industries/apparel' },
  { label: 'Configurable goods', href: '/solutions' },
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
    question: 'Why does my brand need product configuration infrastructure?',
    answer:
      'Because options outrun photography and flat PDPs. Configurable products need a live state that stays aligned with what you can actually sell.',
  },
  {
    question: 'What is CubeCom Pro?',
    answer:
      'CubeCom Pro is product configuration infrastructure for visual commerce. Rules, 3D state, SKU, price, inventory, and cart stay on one product graph — not a viewer bolted onto checkout.',
  },
  {
    question: 'Is CubeCom just a 3D plugin or viewer kit?',
    answer:
      'No. 3D is one surface. The core is a configuration engine that resolves valid state for any experience that sells the product.',
  },
  {
    question: 'What surfaces do we get?',
    answer:
      'Product Configurator, 3D Product Configurator, Headless Product Configurator, and Product Configuration API — each resolving to the same sellable state.',
  },
  {
    question: 'How does a configuration become a sellable SKU?',
    answer:
      'Valid state resolves through the product graph to a concrete variant or quote line, price, and inventory. Invalid combinations are blocked before cart or share.',
  },
  {
    question: 'Do we replace our PIM or storefront?',
    answer:
      'No. CubeCom sits beside them. Catalog in, configuration in the middle, resolved commerce out — through embed, API, or cart integration.',
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
      'Founding plans are on this page. Enterprise is scoped to your catalogs and stack. Decorations and image generation stay modular.',
  },
  {
    question: 'What is a CubeCom session?',
    answer:
      'Thirty minutes on your catalog, rules, and commerce path — then a clear recommendation. Not a slide tour of features.',
  },
] as const;
