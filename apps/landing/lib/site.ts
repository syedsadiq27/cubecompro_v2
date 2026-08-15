export const SITE_URL = 'https://cubecompro.com';
export const DOCS_URL = 'https://docs.cubecompro.com';
export const SITE_NAME = 'CubeCom Pro';
export const SITE_EMAIL = 'hello@cubecompro.com';

export const SITE_DESCRIPTION =
  'Product configuration infrastructure for visual commerce. Rules, 3D state, SKU, price, inventory, and cart stay aligned as shoppers configure.';

export const marketingRoutes = [
  {
    path: '/',
    title: `${SITE_NAME} — Product Configuration Platform`,
    changeFrequency: 'weekly' as const,
    priority: 1,
  },
  {
    path: '/solutions',
    title: `Solutions | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  },
  {
    path: '/3d-product-configurator',
    title: `3D Product Configurator for Ecommerce | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    path: '/product-configurator',
    title: `Product Configurator Software for Ecommerce | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    path: '/headless-product-configurator',
    title: `Headless Product Configurator | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  },
  {
    path: '/product-configuration-api',
    title: `Product Configuration API | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  },
  {
    path: '/integrations/shopify',
    title: `Shopify 3D Product Configurator | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    path: '/integrations/commercetools',
    title: `commercetools Product Configurator | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    path: '/industries/furniture',
    title: `3D Furniture Configurator for Ecommerce | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  },
  {
    path: '/industries/apparel',
    title: `Apparel Product Configurator | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  },
  {
    path: '/demo',
    title: 'Live sofa demo',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    path: '/demo/tshirt',
    title: 'Live t-shirt demo',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    path: '/pricing',
    title: `Pricing | ${SITE_NAME}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    path: '/about',
    title: `About | ${SITE_NAME}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
  {
    path: '/privacy',
    title: `Privacy | ${SITE_NAME}`,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
  {
    path: '/terms',
    title: `Terms | ${SITE_NAME}`,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
];
