import { site } from "@/lib/site";
import type { MetadataRoute } from "next";
import { getAllArticlesIndex } from "@/components/helpers/article";
import { URLS } from "@/components/helpers/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticlesIndex();
  return [
    { url: new URL("/", site.url).href },
    ...articles.flatMap((article) =>
      [URLS.ARTICLES(article.slug), URLS.ARTICLE_MARKDOWN(article.slug)].map(
        (path) => ({
          url: new URL(path, site.url).href,
          lastModified: article.date,
        }),
      ),
    ),
  ];
}
