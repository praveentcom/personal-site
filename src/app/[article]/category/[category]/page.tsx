import { TitleSection } from "@avgeek-inc/ds-web-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { plural } from "pluralize";

import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import {
  getAllCategories,
  getArticlesByCategory,
} from "@/components/helpers/article";
import { getArticleLabel, getArticleSlug } from "@/components/helpers/config";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { TypographyHeading } from "@avgeek-inc/ds-web/typography/typography";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

const articleLabel = plural(getArticleLabel());

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    article: getArticleSlug(),
    category,
  }));
}

export default async function CategoryArticlePage({ params }: PageProps) {
  const { category: decodedCategory } = await params;
  const category = decodeURIComponent(decodedCategory);

  const allCategories = await getAllCategories();

  if (!allCategories.includes(category)) {
    notFound();
  }

  const filteredArticles = await getArticlesByCategory(category);

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[
          { href: URLS.HOME(), label: "Home" },
          { href: URLS.ARTICLES_LIST(), label: articleLabel },
        ]}
        title={`${category} ${articleLabel}`}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} ${articleLabel}`,
          description: `${filteredArticles.length} ${articleLabel} published in this category.`,
        }}
      />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <TypographyHeading level={3}>
          {category} {articleLabel}
        </TypographyHeading>
        <div className="flex-col-4">
          {filteredArticles.map((article, index) => (
            <ArticleSummaryCard key={index} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: decodedCategory } = await params;
  const category = decodeURIComponent(decodedCategory);

  const allCategories = await getAllCategories();

  if (!allCategories.includes(category)) {
    return createNotFoundMetadata("Category");
  }

  const filteredArticles = await getArticlesByCategory(category);

  const metadata = createPageMetadata({
    title: `${category} ${articleLabel}`,
    description: `${filteredArticles.length} ${articleLabel} published in this category.`,
    keywords: [
      category,
      articleLabel,
      "articles",
      "blog",
      "development",
      "technology",
      "programming",
      "tutorials",
    ],
    url: URLS.ARTICLES_CATEGORY(category),
  });

  return metadata;
}
