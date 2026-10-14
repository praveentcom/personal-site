import type { MetadataRoute } from "next";
import { BASE_URL, URLS } from "@/components/helpers/urls";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_ALLOW_ROBOTS !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/private/"] },
    sitemap: `${BASE_URL}${URLS.SITEMAP()}`,
  };
}
