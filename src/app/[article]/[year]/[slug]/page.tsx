import { TitleSection } from "@workspace/web-page-sections/title-section";

import { Markdown } from "@workspace/web-design-system/typography/markdown";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { plural } from "pluralize";

import { ArticleTitleDetails } from "@/components/article/article-header";
import {
  getAllArticleSlugs,
  getArticleBySlugRaw,
} from "@/components/helpers/article";
import { getArticleLabel, getArticleSlug } from "@/components/helpers/config";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { generateArticleSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

interface PageProps {
  params: Promise<{
    year: string;
    slug: string;
  }>;
}

const articleLabel = plural(getArticleLabel());

export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();

  return articles.map((article) => ({
    article: getArticleSlug(),
    slug: article.slug,
    year: article.year,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug, year } = await params;
  const rawArticle = await getArticleBySlugRaw(slug);

  if (!rawArticle) {
    notFound();
  }

  const article = rawArticle.meta;
  const articleYear = article.year;

  if (articleYear !== year) {
    redirect(URLS.ARTICLES(articleYear, article.slug));
  }

  const mdUrl = URLS.ARTICLE_MARKDOWN(article.year, article.slug);

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[
          { href: URLS.HOME(), label: "Home" },
          { href: URLS.ARTICLES_LIST(), label: articleLabel },
        ]}
        description={article.description}
        title={article.title}
      />
      <StructuredData
        data={generateArticleSchema({
          ...article,
          content: rawArticle.raw,
        })}
      />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <ArticleTitleDetails
          article={article}
          markdown={rawArticle.raw}
          mdUrl={mdUrl}
        />
      </section>
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <Markdown content={rawArticle.raw} />
      </section>
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

  const metadata = createPageMetadata({
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
    url: URLS.ARTICLES(article.year, article.slug),
    image: article.ogImage || article.image,
  });

  if (article.private) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}
