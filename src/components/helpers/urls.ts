export const URLS = {
  SITEMAP: () => "/sitemap.xml",
  RSS_FEED: () => "/blog/rss.xml",
  ARTICLES: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  ARTICLE_MARKDOWN: (slug: string) => `/blog/${encodeURIComponent(slug)}/md`,
  ARTICLES_LIST: () => "/blog",
} as const;
