export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.praveent.com";

export const URLS = {
  HOME: () => "/",
  ABOUT: () => "/about",
  COVER: () => "/cover",
  SITEMAP: () => "/sitemap.xml",
  RSS_FEED: () => "/blog/rss.xml",
  RSS_FEED_LEGACY: () => "/feed.xml",

  ARTICLES: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  ARTICLE_MARKDOWN: (slug: string) => `/blog/${encodeURIComponent(slug)}/md`,
  ARTICLES_LIST: () => "/blog",
  ARTICLES_YEAR: (year: string) => `/blog/year/${year}`,
  ARTICLES_TAG: (tag: string) => `/blog/tag/${encodeURIComponent(tag)}`,
  ARTICLES_CATEGORY: (category: string) =>
    `/blog/category/${encodeURIComponent(category)}`,

  APPS_LIST: () => "/apps",
  APPS: (slug: string) => `/apps/${slug}`,
  APPS_STACK: (tag: string) => `/apps/stack/${tag}`,

  COMMUNITY_LIST: () => "/community",
  COMMUNITY: (year: string, slug: string) => `/community/${year}/${slug}`,
  COMMUNITY_YEAR: (year: string) => `/community/${year}`,
  COMMUNITY_TYPE: (type: string) => `/community/contributions/${type}`,

  WORK_LIST: () => "/work",
  WORK: (slug: string) => `/work/${slug}`,
  EDUCATION_LIST: () => "/education",
  EDUCATION: (slug: string) => `/education/${slug}`,
} as const;
