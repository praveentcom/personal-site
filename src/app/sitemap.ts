import type { MetadataRoute } from "next";
import {
  getAllArticleSlugs,
  getAllCategories,
  getAllTags,
} from "@/components/helpers/article";
import { getAllAppSlugs } from "@/components/helpers/apps";
import { getAllCommunitySlugs } from "@/components/helpers/community";
import { getAllWorkSlugs } from "@/components/helpers/work";
import { getAllEducationSlugs } from "@/components/helpers/education";
import { BASE_URL, URLS } from "@/components/helpers/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, apps, community, work, education, tags, categories] =
    await Promise.all([
      getAllArticleSlugs(),
      getAllAppSlugs(),
      getAllCommunitySlugs(),
      getAllWorkSlugs(),
      getAllEducationSlugs(),
      getAllTags(),
      getAllCategories(),
    ]);
  const routes = [
    ...[
      "/",
      "/about",
      "/cover",
      "/blog",
      "/apps",
      "/community",
      "/work",
      "/education",
    ].map((path) => ({ path })),
    ...articles.map((item) => ({
      path: URLS.ARTICLES(item.slug),
      lastModified: item.date,
    })),
    ...apps.map((item) => ({
      path: URLS.APPS(item.slug),
      lastModified: item.date,
    })),
    ...community.map((item) => ({
      path: URLS.COMMUNITY(item.year, item.slug),
      lastModified: item.date,
    })),
    ...work.map((item) => ({ path: URLS.WORK(item.slug) })),
    ...education.map((item) => ({ path: URLS.EDUCATION(item.slug) })),
    ...tags.map((tag) => ({ path: URLS.ARTICLES_TAG(tag) })),
    ...categories.map((category) => ({
      path: URLS.ARTICLES_CATEGORY(category),
    })),
    ...[...new Set(articles.map((item) => item.year))].map((year) => ({
      path: URLS.ARTICLES_YEAR(year),
    })),
    ...[...new Set(apps.flatMap((item) => item.stack))].map((tag) => ({
      path: URLS.APPS_STACK(encodeURIComponent(tag)),
    })),
  ];
  return routes.map((route) => ({
    url: new URL(route.path, BASE_URL).href,
    ...("lastModified" in route
      ? { lastModified: route.lastModified as string }
      : {}),
  }));
}
