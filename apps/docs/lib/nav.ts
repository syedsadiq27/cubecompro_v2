export const NAV = [
  {
    title: 'Start',
    items: [
      { href: '/', label: 'Overview' },
      { href: '/design-principles', label: 'Design principles' },
      { href: '/components', label: 'Components' },
    ],
  },
  {
    title: 'Products',
    items: [
      { href: '/backoffice', label: 'Backoffice' },
      { href: '/3d-editor', label: '3D Editor' },
      { href: '/logo-editor', label: 'Logo Editor' },
      { href: '/customizer', label: 'Customizer' },
    ],
  },
] as const;
