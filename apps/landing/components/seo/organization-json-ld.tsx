import { SITE_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export function OrganizationJsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: SITE_EMAIL,
    logo: `${SITE_URL}/icon`,
    description:
      'Product configuration platform for ecommerce — rules, valid state, and commerce resolution.',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Introfinity',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
