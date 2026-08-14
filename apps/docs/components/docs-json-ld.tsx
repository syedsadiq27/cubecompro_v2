import { DOCS_DESCRIPTION, DOCS_NAME, DOCS_URL, MARKETING_URL } from '@/lib/site';

export function DocsJsonLd() {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DOCS_NAME,
    url: DOCS_URL,
    description: DOCS_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: 'CubeCom Pro',
      url: MARKETING_URL,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'CubeCom Pro',
      url: MARKETING_URL,
    },
  };

  const techDocs = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What is CubeCom Pro?',
    description: DOCS_DESCRIPTION,
    url: DOCS_URL,
    author: {
      '@type': 'Organization',
      name: 'CubeCom Pro',
      url: MARKETING_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techDocs) }}
      />
    </>
  );
}
