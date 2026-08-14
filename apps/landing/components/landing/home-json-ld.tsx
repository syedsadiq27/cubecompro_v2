import { faqs } from '@/lib/content';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export function HomeJsonLd() {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      parentOrganization: {
        '@type': 'Organization',
        name: 'Introfinity',
      },
    },
    potentialAction: {
      '@type': 'CommunicateAction',
      name: 'Book a solution session',
      target: `${SITE_URL}/#contact`,
    },
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '49',
        priceCurrency: 'USD',
        description:
          'Founding price for one product graph, 3D viewer + configurator, SKU/price mapping.',
        url: `${SITE_URL}/pricing`,
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '149',
        priceCurrency: 'USD',
        description:
          'Founding price for production brands with constraints, commerce sync, and API access.',
        url: `${SITE_URL}/pricing`,
      },
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const payloads = [
    { id: 'website', data: website },
    { id: 'software', data: software },
    { id: 'faq', data: faqPage },
  ];

  return (
    <>
      {payloads.map((payload) => (
        <script
          key={payload.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.data) }}
        />
      ))}
    </>
  );
}
