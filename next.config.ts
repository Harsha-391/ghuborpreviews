import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    // AVIF first (typically 20-30% smaller than WebP at the same visual
    // quality), WebP for browsers without AVIF. Same quality setting either way.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Each (image, width) pair is resized on its first request and cached
    // after that. Fewer widths than the default 16 means far fewer first
    // requests that have to wait; these still cover 1x-3x phones and desktops.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [256, 384],
    // Product photos change URL when replaced (Firebase adds a new token), so
    // optimized copies can be cached for a long time.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
