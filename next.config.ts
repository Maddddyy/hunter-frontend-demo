import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/teach', destination: '/settings/teach', permanent: false },
    ];
  },
};

export default nextConfig;
