import type { MetadataRoute } from 'next';
import { DOCS_URL, docsRoutes } from '@/lib/site';

function priorityFor(path: string) {
  if (path === '/') return 1;
  if (
    path.startsWith('/guides') ||
    path.startsWith('/integrations') ||
    path.startsWith('/developers')
  ) {
    return 0.9;
  }
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return docsRoutes().map((path) => ({
    url: path === '/' ? DOCS_URL : `${DOCS_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: priorityFor(path),
  }));
}
