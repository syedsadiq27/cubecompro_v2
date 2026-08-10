import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/graphql",
    "@repo/ui",
    "@repo/customizer-ui",
    "@repo/color-config",
    "@repo/colorways",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
