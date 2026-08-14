import type { Metadata } from 'next';
import { NAV, isNavGroup } from './nav';

export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL?.replace(/\/$/, '') ??
  'https://docs.cubecompro.com';

export const MARKETING_URL = 'https://cubecompro.com';

export const DOCS_NAME = 'CubeCom Pro Docs';

export const DOCS_DESCRIPTION =
  'Developer documentation for CubeCom Pro — product graph, configuration, resolve, GraphQL, commerce integrations, and SDKs.';

export function docsPath(path: string) {
  if (!path || path === '/') return DOCS_URL;
  return `${DOCS_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function docsMeta(
  title: string,
  path: string,
  description = DOCS_DESCRIPTION
): Metadata {
  const url = docsPath(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${DOCS_NAME}`,
      description,
      url,
      siteName: DOCS_NAME,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${DOCS_NAME}`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export function docsRoutes() {
  const paths = new Set<string>(['/']);
  for (const group of NAV) {
    for (const item of group.items) {
      if (isNavGroup(item)) {
        for (const child of item.children) paths.add(child.href);
      } else {
        paths.add(item.href);
      }
    }
  }
  for (const extra of [
    '/quickstart',
    '/architecture',
    '/model',
    '/backoffice',
    '/components',
    '/guides/embed',
    '/developers/events',
  ]) {
    paths.add(extra);
  }
  return [...paths].sort((a, b) => a.localeCompare(b));
}
