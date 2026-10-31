import type { Metadata } from "next";
import { site } from "@/lib/site";

export function createNotFoundMetadata(type: string): Metadata {
  return {
    title: `${type} not found`,
    description: `The requested ${type.toLowerCase()} could not be found.`,
  };
}

export function createPageMetadata({
  title,
  description = site.description,
  type = "website",
  image = site.image,
  keywords = site.keywords,
  publishedTime,
  url,
}: {
  title?: string;
  description?: string;
  type?: "website" | "article";
  image?: string;
  keywords?: string[];
  publishedTime?: string;
  url?: string;
}): Metadata {
  const ogImage = {
    url: image,
    width: 1200,
    height: 630,
    alt: title ?? site.title,
  };

  return {
    metadataBase: new URL(site.url),
    title: title ? `${title} | ${site.title}` : site.title,
    description,
    keywords,
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon.png", type: "image/png" },
      ],
    },
    openGraph: {
      title: title ?? site.title,
      description,
      type,
      ...(type === "article" ? { publishedTime } : {}),
      images: [ogImage],
      siteName: site.title,
      url: url ? new URL(url, site.url).href : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? site.title,
      description,
      images: [ogImage],
      site: "@praveentcom",
      creator: "@praveentcom",
    },
    authors: [{ name: site.name, url: site.url }],
    appleWebApp: {
      capable: true,
      title: title ?? site.title,
      statusBarStyle: "black-translucent",
    },
  };
}
