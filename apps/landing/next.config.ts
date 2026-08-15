import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ['@repo/ui', '@repo/fonts'],
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: 'https://docs.cubecompro.com',
        permanent: false,
      },
      {
        source: '/docs/:path*',
        destination: 'https://docs.cubecompro.com/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
