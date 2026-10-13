import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

const IMAGE_REMOTE_PATTERNS = [
  { protocol: "https" as const, hostname: "placehold.co" },
  { protocol: "https" as const, hostname: "cdn.jsdelivr.net" },
  { protocol: "https" as const, hostname: "images.unsplash.com" },
  { protocol: "https" as const, hostname: "cdn.avgeek.io" },
  { protocol: "https" as const, hostname: "www.avgeek.io" },
  { protocol: "https" as const, hostname: "cdn.praveent.com" },
  { protocol: "https" as const, hostname: "images.avgeek.ltd" },
];

export default function nextConfig(phase: string): NextConfig {
  return {
    output: "standalone",
    turbopack: {
      root: process.cwd(),
    },
    transpilePackages: ["@avgeek-inc/ds-web"],
    pageExtensions: ["ts", "tsx", "md", "mdx"],
    compress: true,
    poweredByHeader: false,
    experimental: {
      optimizePackageImports: ["hugeicons/react", "date-fns"],
    },
    compiler: {
      removeConsole: phase === PHASE_PRODUCTION_BUILD,
    },
    images: {
      remotePatterns: IMAGE_REMOTE_PATTERNS,
      qualities: [75, 95],
      dangerouslyAllowSVG: true,
      contentDispositionType: "inline",
      contentSecurityPolicy: "default-src 'self' data: blob:;",
      minimumCacheTTL: 31536000,
    },
    async redirects() {
      return [
        {
          source: "/sitemap",
          destination: "/sitemap.xml",
          permanent: true,
        },
        {
          source: "/robots",
          destination: "/robots.txt",
          permanent: true,
        },
        ...[
          "/about",
          "/cover",
          "/apps/:path*",
          "/community/:path*",
          "/work/:path*",
          "/education/:path*",
          "/blog/year/:path*",
          "/blog/tag/:path*",
          "/blog/category/:path*",
        ].map((source) => ({ source, destination: "/", permanent: false })),
      ];
    },
    async headers() {
      return [
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
            {
              key: "Referrer-Policy",
              value: "origin-when-cross-origin",
            },
          ],
        },
        {
          source: "/images/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ];
    },
  };
}
