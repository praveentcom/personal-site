import { MetadataRoute } from "next";
import { createRobotsConfig } from "@workspace/web-runtime/robots";

import { BASE_URL, URLS } from "@/components/helpers/urls";

export default function robots(): MetadataRoute.Robots {
  return createRobotsConfig({
    allowRobots: process.env.NEXT_PUBLIC_ALLOW_ROBOTS === "true",
    sitemapUrl: `${BASE_URL}${URLS.SITEMAP()}`,
  });
}
