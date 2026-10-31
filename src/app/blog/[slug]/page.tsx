import { Markdown } from "@/components/markdown";
import Link from "next/link";

import { StructuredData } from "@/components/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllArticlesIndex,
  getArticleBySlugRaw,
} from "@/components/helpers/article";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { generateArticleSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const articleLabel = "Writings";

export async function generateStaticParams() {
  const articles = await getAllArticlesIndex();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const rawArticle = await getArticleBySlugRaw(slug);

  if (!rawArticle) {
    notFound();
  }

  const article = rawArticle.meta;

  return (
    <>
      <header className="page-intro article-intro">
        <Link className="back-link" href="/">
          ← Writings
        </Link>
        {article.emoji && (
          <div className="article-emoji" aria-hidden="true">
            {article.emoji}
          </div>
        )}
        <h1 className="article-heading">{article.title}</h1>
        <div className="article-meta">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
          <span>{article.readTime} min read</span>
        </div>
      </header>
      <StructuredData
        data={generateArticleSchema({
          ...article,
          content: rawArticle.raw,
        })}
      />
      <article className="reading-content">
        <Markdown>{rawArticle.raw}</Markdown>
      </article>
      <div className="article-end">
        <Link href="/">← Writings</Link>
      </div>
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawArticle = await getArticleBySlugRaw(slug);

  if (!rawArticle) {
    return createNotFoundMetadata(articleLabel);
  }

  const article = rawArticle.meta;

  return createPageMetadata({
    title: `${article.title} | ${articleLabel}`,
    description: article.description,
    type: "article",
    keywords: [
      articleLabel.toLowerCase(),
      "articles",
      "blog",
      "development",
      "technology",
      "programming",
      "tutorials",
    ],
    publishedTime: article.date,
    url: URLS.ARTICLES(article.slug),
    image: article.ogImage || article.image,
  });
}
