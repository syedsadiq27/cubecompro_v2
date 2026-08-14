import { SITE_NAME, SITE_URL } from '@/lib/site';
import type { SeoFaqItem, SeoPageDef } from '@/lib/seo-pages';

export function SeoJsonLd({
  page,
  faqs,
}: {
  page: SeoPageDef;
  faqs: SeoFaqItem[];
}) {
  const url = `${SITE_URL}${page.path}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.h1,
        item: url,
      },
    ],
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const software =
    page.path === '/product-configurator'
      ? {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'CubeCom Pro Product Configurator',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url,
          description: page.description,
          provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            parentOrganization: {
              '@type': 'Organization',
              name: 'Introfinity',
            },
          },
        }
      : null;

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {software ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
