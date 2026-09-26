import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/components/helpers/article";
import { BASE_URL, URLS } from "@/components/helpers/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticleSlugs();
  return [
    { url: new URL("/", BASE_URL).href },
    ...articles.flatMap((article) =>
      [URLS.ARTICLES(article.slug), URLS.ARTICLE_MARKDOWN(article.slug)].map(
        (path) => ({
          url: new URL(path, BASE_URL).href,
          lastModified: article.date,
        }),
      ),
    ),
  ];
}
