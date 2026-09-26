import { withSentry } from "@avgeek-inc/observability/next-config";
import { createNextConfig } from "@avgeek-inc/runtime-web/next-config";

export default withSentry(
  createNextConfig((config) => ({
    ...config,
    images: { ...config.images, qualities: [75, 95] },
    async redirects() {
      return [
        ...((await config.redirects?.()) ?? []),
        ...[
          "/about",
          "/cover",
          "/apps/:path*",
          "/community/:path*",
          "/work/:path*",
          "/education/:path*",
        ].map((source) => ({ source, destination: "/", permanent: false })),
        ...[
          "/blog/year/:path*",
          "/blog/tag/:path*",
          "/blog/category/:path*",
        ].map((source) => ({
          source,
          destination: "/",
          permanent: false,
        })),
      ];
    },
  })),
  { project: "praveen-website" },
);
