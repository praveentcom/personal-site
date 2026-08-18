import createMDX from "@next/mdx";
import { createNextConfig } from "@workspace/web-design-system/lib/next-config";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const baseConfig = createNextConfig((config) => withMDX(config), {
  sentryProject: "praveen-website",
  transpilePackages: ["@workspace/web-page-sections"],
});

const nextConfig: NextConfig = {
  ...baseConfig,
  images: {
    ...baseConfig.images,
    // Blog media already lives behind a dedicated CDN, so routing every
    // request through Next's optimizer adds latency without much upside.
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/apps",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:article/:year/:slug.md",
        destination: "/:article/:year/:slug/md",
      },
    ];
  },
};

export default nextConfig;
