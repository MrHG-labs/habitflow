import type { NextConfig } from "next";

const API_SERVER_URL = process.env.API_SERVER_URL || 'http://backend:8000';
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(',')
  : ['localhost', '127.0.0.1'];

const nextConfig: any = {
  devIndicators: false,
  allowedDevOrigins,
  output: 'standalone',
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
