import matter from "gray-matter";

import {
  getArticleManifest,
  getContentByObjectKey,
} from "@/components/helpers/content-source";
import { generatePlaceholderImageUrl } from "@/components/helpers/image";
import { type ArticleFrontmatter } from "@/types/article";

export type ArticleIndexItem = ArticleFrontmatter;

function normalizeArticle(
  article: Awaited<ReturnType<typeof getArticleManifest>>["items"][number],
): ArticleIndexItem {
  return {
    title: article.title ?? "",
    description: article.description ?? "",
    date: article.date ?? "",
    tags: article.tags ?? [],
    categories: article.categories ?? [],
    published: article.published ?? true,
    private: article.private ?? false,
    ogImage: article.ogImage ?? undefined,
    image:
      article.image ||
      generatePlaceholderImageUrl({ text: article.title ?? "" }),
    slug: article.slug,
    year: article.year,
    readTime: article.readTime,
  };
}

export async function getAllArticleSlugs(): Promise<ArticleIndexItem[]> {
  const manifest = await getArticleManifest();

  return manifest.items
    .map(normalizeArticle)
    .filter((article) => article.published && !article.private);
}

export async function getAllArticlesIndex(
  limit?: number,
): Promise<ArticleIndexItem[]> {
  const articles = await getAllArticleSlugs();
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

export async function getArticleBySlugRaw(
  slug: string,
): Promise<{ meta: ArticleIndexItem; raw: string } | null> {
  const manifest = await getArticleManifest();
  const match = manifest.items.find((article) => article.slug === slug);

  if (!match) {
    return null;
  }

  const rawSource = await getContentByObjectKey(match.objectKey);

  if (!rawSource) {
    return null;
  }

  const { content } = matter(rawSource);

  return {
    meta: normalizeArticle(match),
    raw: content,
  };
}

export async function getAllCategories(): Promise<string[]> {
  const articles = await getAllArticlesIndex();
  return Array.from(new Set(articles.flatMap((article) => article.categories)));
}

export async function getAllTags(): Promise<string[]> {
  const articles = await getAllArticlesIndex();
  return Array.from(new Set(articles.flatMap((article) => article.tags)));
}

export async function getArticlesByCategory(
  category: string,
): Promise<ArticleIndexItem[]> {
  const articles = await getAllArticlesIndex();
  return articles.filter((article) => article.categories.includes(category));
}
