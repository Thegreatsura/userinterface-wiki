import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  typedRoutes: true,
  reactCompiler: true,
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    staleTimes: { dynamic: 30, static: 180 },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
