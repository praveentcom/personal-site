import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { HugeiconsIcon } from "@hugeicons/react";
import { RssIcon } from "@hugeicons-pro/core-solid-rounded";
import Link from "next/link";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { Grid } from "@workspace/web-design-system/layout/grid";
import { Button } from "@workspace/web-design-system/buttons/button";
import { TypographyHeading } from "@workspace/web-design-system/typography/typography";
import { plural } from "pluralize";

import { ArticleCategoryButton } from "@/components/article/article-category-button";
import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { YearButton } from "@/components/common/year-button";
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
    <ContentPage
      actions={
        <Button
          variant="ghost"
          aria-label="RSS feed"
          title="RSS feed"
          render={
            <a
              href={URLS.RSS_FEED()}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <HugeiconsIcon icon={RssIcon} aria-hidden="true" />
        </Button>
      }
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={articleLabel}
    >
      {
        <>
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
            <PageSection yPadding="none">
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
                        <ArticleCategoryButton
                          key={category}
                          category={category}
                          count={
                            publishedArticles.filter((a) =>
                              a.categories.includes(category),
                            ).length
                          }
                          render={
                            <Link
                              href={URLS.ARTICLES_CATEGORY(
                                encodeURIComponent(category),
                              )}
                            />
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
                {publishedArticles.length > 0 &&
                  Array.from(new Set(publishedArticles.map((a) => a.year)))
                    .length > 1 && (
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
                          <YearButton
                            key={`${year}-article`}
                            year={year}
                            render={<Link href={URLS.ARTICLES_YEAR(year)} />}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </Grid>
            </PageSection>
          )}
          {publishedArticles.length > 0 && (
            <PageSection>
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
            </PageSection>
          )}
        </>
      }
    </ContentPage>
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
