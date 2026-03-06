import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/education/:path*', destination: '/' },
      { source: '/civic/:path*', destination: '/' },
      { source: '/enrich', destination: '/' },
      { source: '/editor', destination: '/' },
      { source: '/session', destination: '/' },
      { source: '/lobby', destination: '/' },
      { source: '/rejoin', destination: '/' },
    ];
  },
};

export default nextConfig;
