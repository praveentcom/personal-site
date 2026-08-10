import { HugeiconsIcon } from "@hugeicons/react";
import { RssIcon } from "@hugeicons-pro/core-solid-rounded";
import { Button } from "@workspace/web-design-system/components/button";
import { HeaderSection } from "@workspace/web-page-sections/header-section";
import Link from "next/link";
import { plural } from "pluralize";

import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { getArticleLabel } from "@/components/helpers/config";
import { URLS } from "@/components/helpers/urls";
import { ArticleFrontmatter } from "@/types/article";

const articleLabel = plural(getArticleLabel());

export function ArticleSection({
  articles,
}: {
  articles: ArticleFrontmatter[];
}) {
  const showAllArticles = articles.length > 0;

  return (
    <section
      className="grid gap-6"
      aria-label={`Recent ${articleLabel.toLowerCase()}`}
    >
      <HeaderSection
        label="Writing"
        title={`Recent ${articleLabel.toLowerCase()}`}
        description="Notes on developer tools, product engineering, infrastructure, AI-assisted workflows, and the decisions behind shipped software."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="size-8 p-0"
              aria-label="RSS feed"
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
            {showAllArticles ? (
              <Button render={<Link href={URLS.ARTICLES_LIST()} />}>
                View all articles
              </Button>
            ) : null}
          </div>
        }
      />
      <div className="divide-y divide-border">
        {articles.map((article, index) => (
          <ArticleSummaryCard key={index} article={article} />
        ))}
      </div>
    </section>
  );
}
