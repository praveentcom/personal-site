import { notFound } from "next/navigation";

import {
  getAllArticlesIndex,
  getArticleBySlugRaw,
} from "@/components/helpers/article";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllArticlesIndex();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const rawArticle = await getArticleBySlugRaw(slug);

  if (!rawArticle) {
    notFound();
  }

  const { meta, raw } = rawArticle;

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
