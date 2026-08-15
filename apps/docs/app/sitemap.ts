import type { MetadataRoute } from 'next';
import { DOCS_URL } from '@/lib/site';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();
  return [
    ...pages.map((page) => {
      const path = page.url;
      return {
        url: path === '/' ? DOCS_URL : `${DOCS_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '/' ? 1 : 0.8,
      };
    }),
    {
      url: `${DOCS_URL}/api/rest`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${DOCS_URL}/api/graphql`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];
}
