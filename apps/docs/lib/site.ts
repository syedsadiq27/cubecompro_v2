import type { Metadata } from 'next';

export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL?.replace(/\/$/, '') ??
  'https://docs.cubecompro.com';

export const MARKETING_URL = 'https://cubecompro.com';

export const DOCS_NAME = 'CubeCom Pro Docs';

export const DOCS_DESCRIPTION =
  'Developer documentation for CubeCom Pro — products, selections, assets, resolve, GraphQL, and OpenAPI.';

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
