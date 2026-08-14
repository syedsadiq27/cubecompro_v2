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

export const productNav: NavLink = {
  href: '/product-configurator',
  label: 'Product',
};

export const solutionsNav: NavLink[] = [
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

export const docsNav: NavLink = {
  href: '/docs',
  label: 'Docs',
};

export const homeSubnav: NavLink[] = [
  { href: '/#why', label: 'Why CubeCom' },
  { href: '/#stage', label: 'How it works' },
  { href: '/demo', label: 'Sofa demo' },
  { href: '/demo/tshirt', label: 'Tee demo' },
];

export const footerProduct: NavLink[] = [
  { href: '/product-configurator', label: 'Product Configurator' },
  {
    href: '/3d-product-configurator',
    label: '3D Configurator',
  },
  {
    href: '/headless-product-configurator',
    label: 'Headless',
  },
  {
    href: '/product-configuration-api',
    label: 'Configuration API',
  },
  { href: '/industries/furniture', label: 'Furniture' },
  { href: '/industries/apparel', label: 'Apparel' },
];

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
  { href: '/pricing', label: 'Pricing' },
  bookSessionCta,
  { href: '/#contact', label: 'Contact' },
];

export const footerLegal: NavLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];
