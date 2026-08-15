export const SOLUTION_PATHS = [
  {
    href: '/product-configurator',
    label: 'Rules',
    title: 'Product Configurator',
    claim: 'Options and constraints that resolve to what can be sold.',
    flow: 'Options → Constraints → Valid State → SKU',
  },
  {
    href: '/3d-product-configurator',
    label: 'Visual',
    title: '3D Product Configurator',
    claim: 'Shoppers change the product in 3D while commerce stays aligned.',
    flow: 'Visual Choice → Scene → Sellable State',
  },
  {
    href: '/headless-product-configurator',
    label: 'Headless',
    title: 'Headless Product Configurator',
    claim: 'Own the storefront. CubeCom owns rules and resolution.',
    flow: 'Your Frontend → CubeCom Engine → Commerce',
  },
  {
    href: '/product-configuration-api',
    label: 'API',
    title: 'Product Configuration API',
    claim: 'One resolved answer for every channel.',
    flow: 'Request → Validation → Resolution → Response',
  },
] as const;

export const SOLUTION_OUTCOMES = ['SKU', 'Price', 'Inventory', 'Cart'] as const;
