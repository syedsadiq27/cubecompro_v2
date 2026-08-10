export const SITE_URL = 'https://cubecompro.com';
export const SITE_NAME = 'CubeCom Pro';
export const SITE_EMAIL = 'hello@cubecompro.com';

export const SITE_DESCRIPTION =
  'CubeCom Pro is the Digital Product Stage — configure physical products in 3D and resolve every state to SKU, price, inventory, and cart.';

export const marketingRoutes = [
  {
    path: '/',
    title: `${SITE_NAME} — The Digital Product Stage`,
    changeFrequency: 'weekly' as const,
    priority: 1,
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
    title: 'Sofa on Stage — live demo',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
];
