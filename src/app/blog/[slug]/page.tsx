import { TitleSection } from "@avgeek-inc/ds-web-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { plural } from "pluralize";

import { ArticleTitleDetails } from "@/components/article/article-header";
import {
  getAllArticleSlugs,
  getArticleBySlugRaw,
  getArticleContent,
} from "@/components/helpers/article";
import { getArticleLabel } from "@/components/helpers/config";
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

const articleLabel = plural(getArticleLabel());

export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();

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
  const Content = await getArticleContent(slug);

  const mdUrl = URLS.ARTICLE_MARKDOWN(article.slug);

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
        <Content />
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
    url: URLS.ARTICLES(article.slug),
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
