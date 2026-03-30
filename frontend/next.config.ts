import type { NextConfig } from "next";

const API_SERVER_URL = process.env.API_SERVER_URL || 'http://backend:8000';

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_SERVER_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
