import createMDX from "@next/mdx";
import { withSentry } from "@avgeek-inc/observability-sentry/next-config";
import { createNextConfig } from "@workspace/web-runtime/next-config";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const baseConfig = withSentry(
  createNextConfig((config) => withMDX(config), {
    transpilePackages: ["@workspace/web-page-sections"],
  }),
  { project: "praveen-website" },
);

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
