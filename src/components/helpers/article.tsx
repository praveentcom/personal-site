import { cache } from "react";
import { readBlogEntries, isPublished } from "@/lib/content";

const getArticles = cache(async () =>
  (await readBlogEntries())
    .filter((entry) => isPublished(entry.meta))
    .map(({ meta, slug, content }) => ({
      meta: {
        ...meta,
        slug,
        image: meta.image ?? "/og-image.png",
        readTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      },
      raw: content,
    }))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date)),
);

export async function getAllArticlesIndex() {
  return (await getArticles()).map((entry) => entry.meta);
}
export async function getArticleBySlugRaw(slug: string) {
  return (
    (await getArticles()).find((entry) => entry.meta.slug === slug) ?? null
  );
}
