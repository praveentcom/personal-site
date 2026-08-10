import { notFound } from "next/navigation";

import {
  getAllArticleSlugs,
  getArticleBySlugRaw,
} from "@/components/helpers/article";
import { getArticleSlug } from "@/components/helpers/config";

interface RouteParams {
  params: Promise<{
    year: string;
    slug: string;
  }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();

  return articles.map((article) => ({
    article: getArticleSlug(),
    slug: article.slug,
    year: article.year,
  }));
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const rawArticle = await getArticleBySlugRaw(slug);

  if (!rawArticle) {
    notFound();
  }

  const { meta, raw } = rawArticle;

  // Build markdown with frontmatter-like header
  const markdownContent = `# ${meta.title}

${meta.description}

---

${raw}`;

  return new Response(markdownContent, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
