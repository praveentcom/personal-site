import { TitleSection } from "@workspace/web-page-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { plural } from "pluralize";

import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import {
  getAllArticleSlugs,
  getAllArticlesIndex,
} from "@/components/helpers/article";
import { getArticleLabel, getArticleSlug } from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { TypographyHeading } from "@avgeek-inc/ds-web/typography/typography";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

const articleLabel = plural(getArticleLabel());

export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();

  return Array.from(new Set(articles.map((article) => article.year))).map(
    (year) => ({ article: getArticleSlug(), year }),
  );
}

export default async function ArticlesByYearPage({ params }: PageProps) {
  const { year } = await params;
  const articles = (await getAllArticlesIndex()).filter((a) => a.year === year);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[
          { href: URLS.HOME(), label: "Home" },
          { href: URLS.ARTICLES_LIST(), label: articleLabel },
        ]}
        title={`${year} ${articleLabel}`}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${year} ${articleLabel}`,
          description: `${articles.length} ${articleLabel} published in ${year}.`,
        }}
      />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <TypographyHeading level={3}>
          {year} {articleLabel}
        </TypographyHeading>
        <div className="flex-col-4">
          {articles.map((article) => (
            <ArticleSummaryCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { year } = await params;
  const count = (await getAllArticlesIndex()).filter(
    (a) => a.year === year,
  ).length;

  const metadata = createPageMetadata({
    title: `${year} ${articleLabel}`,
    description: `${count} ${articleLabel.toLowerCase()} published in ${year}.`,
    keywords: [
      articleLabel.toLowerCase(),
      year,
      "articles",
      "blog",
      "development",
      "technology",
      "programming",
      "tutorials",
    ],
    url: `${URLS.ARTICLES_YEAR(year)}`,
  });

  return metadata;
}
