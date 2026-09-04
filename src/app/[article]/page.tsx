import { TitleSection } from "@workspace/web-page-sections/title-section";

import { RssIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";

import { ButtonLink } from "@avgeek-inc/ds-web/buttons/button";
import { Grid } from "@avgeek-inc/ds-web/layout/grid";
import { TypographyHeading } from "@avgeek-inc/ds-web/typography/typography";
import { plural } from "pluralize";

import { ArticleCategoryButtonLink } from "@/components/article/article-category-button";
import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { YearButtonLink } from "@/components/common/year-button";
import {
  getAllArticleSlugs,
  getAllCategories,
} from "@/components/helpers/article";
import { getArticleLabel, getArticleSlug } from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";

const articleLabel = plural(getArticleLabel());

export function generateStaticParams() {
  return [{ article: getArticleSlug() }];
}

export default async function ArticlesListPage() {
  const publishedArticles = await getAllArticleSlugs();

  const tagSet = new Set<string>();
  publishedArticles.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));

  const allCategories = await getAllCategories();

  return (
    <>
      <TitleSection
        titleLevel={1}
        actions={
          <ButtonLink
            variant="ghost"
            aria-label="RSS feed"
            href={URLS.RSS_FEED()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HugeiconsIcon icon={RssIcon} aria-hidden="true" />
          </ButtonLink>
        }
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={articleLabel}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${articleLabel}`,
          description: `A collection of ${articleLabel.toLowerCase()} about development, technology, and more.`,
        }}
      />
      {(allCategories.length > 0 ||
        Array.from(new Set(publishedArticles.map((a) => a.year))).length >
          1) && (
        <section className="grid gap-6 px-5 sm:px-6">
          <Grid columns={[1, 2, 2]}>
            {allCategories.length > 0 && (
              <div className="flex-col-4" aria-label="Browse by category">
                <div className="flex items-center gap-2">
                  <TypographyHeading level={4}>
                    Browse by category
                  </TypographyHeading>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {allCategories.map((category) => (
                    <ArticleCategoryButtonLink
                      key={category}
                      category={category}
                      count={
                        publishedArticles.filter((a) =>
                          a.categories.includes(category),
                        ).length
                      }
                      href={URLS.ARTICLES_CATEGORY(
                        encodeURIComponent(category),
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
            {publishedArticles.length > 0 &&
              Array.from(new Set(publishedArticles.map((a) => a.year))).length >
                1 && (
                <div className="flex-col-4" aria-label="Browse by year">
                  <div className="flex items-center gap-2">
                    <TypographyHeading level={4}>
                      Browse by year
                    </TypographyHeading>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {Array.from(
                      new Set(publishedArticles.map((a) => a.year)),
                    ).map((year) => (
                      <YearButtonLink
                        key={`${year}-article`}
                        year={year}
                        href={URLS.ARTICLES_YEAR(year)}
                      />
                    ))}
                  </div>
                </div>
              )}
          </Grid>
        </section>
      )}
      {publishedArticles.length > 0 && (
        <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
          <div className="flex-col-4" aria-label="All articles">
            <div className="flex items-center gap-2">
              <TypographyHeading level={4}>
                All {articleLabel}
              </TypographyHeading>
            </div>
            <div className="flex-col-4">
              {publishedArticles.map((article) => (
                <ArticleSummaryCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `${articleLabel}`,
    description: `A collection of ${articleLabel.toLowerCase()} about development, technology, and more.`,
    type: "website",
    keywords: [
      articleLabel.toLowerCase(),
      "blog",
      "development",
      "technology",
      "programming",
      "tutorials",
    ],
    url: URLS.ARTICLES_LIST(),
  });

  return metadata;
}
