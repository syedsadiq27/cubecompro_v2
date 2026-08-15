import { DOCS_URL } from './site';

export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const bookSessionCta: NavLink = {
  href: '/#contact',
  label: 'Book a solution session',
};

export const solutionsOverview: NavLink = {
  href: '/solutions',
  label: 'Overview',
};

export const solutionsNav: NavLink[] = [
  solutionsOverview,
  {
    href: '/product-configurator',
    label: 'Product Configurator',
  },
  {
    href: '/3d-product-configurator',
    label: '3D Product Configurator',
  },
  {
    href: '/headless-product-configurator',
    label: 'Headless Product Configurator',
  },
  {
    href: '/product-configuration-api',
    label: 'Product Configuration API',
  },
];

export const industriesNav: NavLink[] = [
  { href: '/industries/furniture', label: 'Furniture' },
  { href: '/industries/apparel', label: 'Apparel' },
];

export const integrationsNav: NavLink[] = [
  { href: '/integrations/shopify', label: 'Shopify' },
  { href: '/integrations/commercetools', label: 'commercetools' },
];

export const developersNav: NavLink[] = [
  { href: '/docs', label: 'Documentation' },
  {
    href: `${DOCS_URL}/developers/api`,
    label: 'API Reference',
    external: true,
  },
];

export const pricingNav: NavLink = {
  href: '/pricing',
  label: 'Pricing',
};

export const aboutNav: NavLink = {
  href: '/about',
  label: 'About',
};

export const docsNav: NavLink = {
  href: '/docs',
  label: 'Docs',
};

export const footerProduct: NavLink[] = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/product-configurator', label: 'Product Configurator' },
  {
    href: '/3d-product-configurator',
    label: '3D Product Configurator',
  },
  {
    href: '/headless-product-configurator',
    label: 'Headless Product Configurator',
  },
  {
    href: '/product-configuration-api',
    label: 'Product Configuration API',
  },
  { href: '/industries/furniture', label: 'Furniture' },
  { href: '/industries/apparel', label: 'Apparel' },
];

export const footerIntegrations: NavLink[] = [...integrationsNav];

export const footerDevelopers: NavLink[] = [
  { href: '/docs', label: 'Documentation' },
  {
    href: `${DOCS_URL}/developers/api`,
    label: 'API Reference',
    external: true,
  },
  { href: '/demo', label: 'Live Demo' },
];

export const footerCompany: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  bookSessionCta,
  { href: '/#contact', label: 'Contact' },
];

export const footerLegal: NavLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];
