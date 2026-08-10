import type { MetadataRoute } from 'next';
import { marketingRoutes, SITE_URL } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return marketingRoutes.map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
