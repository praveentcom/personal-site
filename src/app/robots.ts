import { site } from "@/lib/site";
import type { MetadataRoute } from "next";
import { URLS } from "@/components/helpers/urls";

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/private/"] },
    sitemap: `${site.url}${URLS.SITEMAP()}`,
  };
}
