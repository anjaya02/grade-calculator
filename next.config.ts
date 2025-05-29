import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This skips ESLint checks during production builds
    ignoreDuringBuilds: true,
  },
  // You can add more Next.js config options below if needed
};

export default nextConfig;
