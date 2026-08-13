export type NavLink = {
  href: string;
  label: string;
};

export type NavItem =
  | NavLink
  | {
      label: string;
      children: NavLink[];
    };

export function isNavGroup(
  item: NavItem
): item is { label: string; children: NavLink[] } {
  return 'children' in item;
}

export const NAV: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Overview',
    items: [
      { href: '/', label: 'What is CubeCom Pro?' },
      {
        label: 'Core concepts',
        children: [
          { href: '/concepts/product-graph', label: 'Product graph' },
          { href: '/concepts/configuration', label: 'Configuration state' },
          { href: '/concepts/rules', label: 'Rules & constraints' },
          { href: '/concepts/resolved-selection', label: 'Resolved selection' },
          { href: '/concepts/commerce', label: 'Commerce references' },
          { href: '/concepts/scene-state', label: 'Scene state' },
        ],
      },
      { href: '/architecture', label: 'Architecture' },
    ],
  },
  {
    title: 'Get started',
    items: [
      { href: '/start/project', label: 'Create a project' },
      { href: '/start/product', label: 'Add a product' },
      { href: '/start/model', label: 'Upload a 3D model' },
      { href: '/start/options', label: 'Define options & values' },
      { href: '/start/rules', label: 'Add configuration rules' },
      { href: '/start/commerce', label: 'Connect commerce' },
      { href: '/start/embed', label: 'Embed the configurator' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/platform/products', label: 'Products' },
      { href: '/platform/models', label: 'Models' },
      { href: '/platform/configuration', label: 'Configuration' },
      { href: '/platform/rules', label: 'Rules' },
      { href: '/platform/assets', label: 'Assets' },
      { href: '/platform/pricing', label: 'Pricing' },
      { href: '/platform/inventory', label: 'Inventory' },
      { href: '/platform/commerce', label: 'Commerce resolution' },
      { href: '/platform/cart', label: 'Cart' },
      { href: '/platform/publishing', label: 'Publishing' },
    ],
  },
  {
    title: 'Experiences',
    items: [
      { href: '/experiences/3d', label: '3D' },
      { href: '/experiences/2d', label: '2D' },
      { href: '/experiences/ai', label: 'AI' },
      { href: '/experiences/embedded', label: 'Embedded experience' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { href: '/integrations/commercetools', label: 'commercetools' },
      { href: '/integrations/shopify', label: 'Shopify' },
      { href: '/integrations/custom', label: 'Custom commerce backend' },
      { href: '/integrations/pim', label: 'PIM' },
      { href: '/integrations/dam', label: 'DAM' },
    ],
  },
  {
    title: 'Developers',
    items: [
      { href: '/developers/authentication', label: 'Authentication' },
      { href: '/developers/api', label: 'API overview' },
      { href: '/developers/graphql', label: 'GraphQL API' },
      { href: '/developers/rest', label: 'REST API' },
      { href: '/developers/sdks', label: 'SDKs' },
      { href: '/developers/webhooks', label: 'Webhooks' },
      { href: '/developers/errors', label: 'Errors' },
      { href: '/developers/rate-limits', label: 'Rate limits' },
      { href: '/developers/versioning', label: 'API versioning' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { href: '/guides/configurator', label: 'Build a product configurator' },
      { href: '/guides/resolve-sku', label: 'Resolve configuration → SKU' },
      { href: '/guides/sync-commerce', label: 'Synchronize price/inventory' },
      { href: '/guides/add-to-cart', label: 'Add-to-cart' },
      { href: '/guides/dependent-options', label: 'Configure dependent options' },
      { href: '/guides/custom-ui', label: 'Build custom UI' },
      { href: '/guides/migrate', label: 'Migrate an existing configurator' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { href: '/reference/api', label: 'API reference' },
      { href: '/reference/schema', label: 'Schema reference' },
      { href: '/reference/events', label: 'Events' },
      { href: '/reference/errors', label: 'Error codes' },
      { href: '/reference/limits', label: 'Limits' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/operations/environments', label: 'Environments' },
      { href: '/operations/deployment', label: 'Deployment' },
      { href: '/operations/observability', label: 'Observability' },
      { href: '/operations/security', label: 'Security' },
      { href: '/operations/troubleshooting', label: 'Troubleshooting' },
    ],
  },
  {
    title: 'Release notes',
    items: [{ href: '/release-notes', label: 'What shipped' }],
  },
];
