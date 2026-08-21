import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/product-graph', '@repo/store'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
