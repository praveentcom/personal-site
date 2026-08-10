import { getArticleSlug } from "@/components/helpers/config";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const URLS = {
  HOME: () => "/",
  ABOUT: () => "/about",
  COVER: () => "/cover",
  SITEMAP: () => "/sitemap.xml",
  RSS_FEED: () => "/blog/rss.xml",
  RSS_FEED_LEGACY: () => "/feed.xml",

  ARTICLES: (year: string, slug: string) =>
    `/${getArticleSlug()}/${year}/${slug}`,
  ARTICLE_MARKDOWN: (year: string, slug: string) =>
    `/${getArticleSlug()}/${year}/${slug}.md`,
  ARTICLES_LIST: () => `/${getArticleSlug()}`,
  ARTICLES_YEAR: (year: string) => `/${getArticleSlug()}/${year}`,
  ARTICLES_TAG: (tag: string) => `/${getArticleSlug()}/tag/${tag}`,
  ARTICLES_CATEGORY: (category: string) =>
    `/${getArticleSlug()}/category/${category}`,

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
