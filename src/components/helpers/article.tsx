import { cache } from "react";
import { ArticleSchema } from "@/types/article";
import { readEntries, isPublished, contentYear } from "@/lib/content";
import { getContentComponent } from "@/lib/mdx";

const getArticles = cache(async () =>
  (await readEntries("blog", ArticleSchema))
    .filter((entry) => isPublished(entry.meta))
    .map(({ meta, slug, content }) => ({
      meta: {
        ...meta,
        slug,
        year: contentYear(meta.date),
        image: meta.image ?? "/og-image.png",
        readTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      },
      raw: content,
    }))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date)),
);

export type ArticleIndexItem = Awaited<
  ReturnType<typeof getAllArticleSlugs>
>[number];
export async function getAllArticleSlugs() {
  return (await getArticles()).map((entry) => entry.meta);
}
export async function getAllArticlesIndex(limit?: number) {
  const articles = await getAllArticleSlugs();
  return limit === undefined ? articles : articles.slice(0, limit);
}
export async function getArticleBySlugRaw(slug: string) {
  return (
    (await getArticles()).find((entry) => entry.meta.slug === slug) ?? null
  );
}
export async function getArticleContent(slug: string) {
  return getContentComponent("blog", slug);
}
export async function getAllCategories() {
  return [
    ...new Set(
      (await getAllArticleSlugs()).flatMap((article) => article.categories),
    ),
  ];
}
export async function getAllTags() {
  return [
    ...new Set((await getAllArticleSlugs()).flatMap((article) => article.tags)),
  ];
}
export async function getArticlesByCategory(category: string) {
  return (await getAllArticleSlugs()).filter((article) =>
    article.categories.includes(category),
  );
}
