import { MetadataRoute } from "next";

import { getSitemapManifest } from "@/components/helpers/content-source";
import { BASE_URL, URLS } from "@/components/helpers/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getSitemapManifest();

  return manifest.routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: route.lastModified
      ? new Date(route.lastModified)
      : new Date(),
    changeFrequency:
      route.source === "work" || route.source === "education"
        ? ("yearly" as const)
        : ("monthly" as const),
    priority:
      route.path === URLS.HOME() ? 1 : route.source === "static" ? 0.8 : 0.6,
  }));
}
