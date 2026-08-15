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

export const pricingFaqs = [
  {
    question: 'What counts as a product graph?',
    answer:
      'One configurable product family with its options, constraints, and commerce mappings — for example a sofa line or a tee program. Multiple unrelated catalogs usually mean multiple graphs.',
  },
  {
    question: 'Are 3D assets included?',
    answer:
      'Plans include the 3D viewer and configurator runtime. Your product models, materials, and photography remain yours. We help map them into the graph; we do not ship a stock asset library as the product.',
  },
  {
    question: 'Is API access included?',
    answer:
      'API access starts on Pro. Starter is built for proving the model with embed and core resolve. Enterprise adds custom integrations, environments, and higher throughput as scoped.',
  },
  {
    question: 'Can I upgrade without rebuilding?',
    answer:
      'Yes. Your product graph, rules, and configurations carry forward. Upgrading unlocks capacity and surfaces — it does not require remodeling the catalog from scratch.',
  },
  {
    question: 'What changes after founding pricing?',
    answer:
      'Founding rates lock in early. After founding, list prices move to the regular monthly amounts shown on each plan. Enterprise remains custom either way.',
  },
  {
    question: 'Do Enterprise plans include implementation support?',
    answer:
      'Yes. Enterprise includes implementation support plus dedicated infrastructure, SSO/roles, PIM/ERP ingestion, and custom integrations scoped to your stack.',
  },
] as const;
