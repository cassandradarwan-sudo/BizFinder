import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/articles/:slug*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:1337",
          },
        ],
      },
      {
        source: '/api/preview',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:1337",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
