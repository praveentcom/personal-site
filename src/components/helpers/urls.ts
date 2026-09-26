export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.praveent.com";

export const URLS = {
  HOME: () => "/",
  SITEMAP: () => "/sitemap.xml",
  RSS_FEED: () => "/blog/rss.xml",
  RSS_FEED_LEGACY: () => "/feed.xml",
  ARTICLES: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  ARTICLE_MARKDOWN: (slug: string) => `/blog/${encodeURIComponent(slug)}/md`,
  ARTICLES_LIST: () => "/blog",
} as const;
