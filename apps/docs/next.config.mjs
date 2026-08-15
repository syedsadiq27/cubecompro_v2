import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@repo/docs-ui', '@repo/fonts'],
  async redirects() {
    return [
      { source: '/reference/rest', destination: '/api/rest', permanent: true },
      {
        source: '/reference/graphql',
        destination: '/api/graphql',
        permanent: true,
      },
      {
        source: '/reference/graphql/schema',
        destination: '/api/graphql',
        permanent: true,
      },
      { source: '/reference/api', destination: '/api', permanent: false },
      { source: '/developers/rest', destination: '/api/rest', permanent: true },
      {
        source: '/developers/graphql',
        destination: '/api/graphql',
        permanent: true,
      },
      { source: '/developers/api', destination: '/api', permanent: true },
      {
        source: '/developers/errors',
        destination: '/api/errors',
        permanent: true,
      },
      {
        source: '/developers/webhooks',
        destination: '/api/webhooks',
        permanent: true,
      },
      {
        source: '/developers/versioning',
        destination: '/api/versioning',
        permanent: true,
      },
      {
        source: '/developers/rate-limits',
        destination: '/resources/limits',
        permanent: true,
      },
      {
        source: '/release-notes',
        destination: '/resources/changelog',
        permanent: true,
      },
      {
        source: '/operations/troubleshooting',
        destination: '/resources/troubleshooting',
        permanent: true,
      },
      {
        source: '/start/model',
        destination: '/guides/add-model',
        permanent: true,
      },
      {
        source: '/platform/publishing',
        destination: '/guides/publish',
        permanent: true,
      },
      { source: '/architecture', destination: '/build/architecture', permanent: true },
      { source: '/quickstart', destination: '/build/quickstart', permanent: true },
      {
        source: '/developers/authentication',
        destination: '/build/authentication',
        permanent: true,
      },
      {
        source: '/use/story',
        destination: '/use/overview',
        permanent: true,
      },
      {
        source: '/use/shopper',
        destination: '/use/shopper-outcomes',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(config);
