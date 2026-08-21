import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/product-graph', '@repo/store'],
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' http://localhost:3002 http://127.0.0.1:3002",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
