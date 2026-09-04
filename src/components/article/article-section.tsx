import { HugeiconsIcon } from "@hugeicons/react";
import { RssIcon } from "@hugeicons-pro/core-solid-rounded";
import { ButtonLink } from "@avgeek-inc/ds-web/buttons/button";
import { HeaderSection } from "@workspace/web-page-sections/header-section";
import { plural } from "pluralize";

import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { getArticleLabel } from "@/components/helpers/config";
import { URLS } from "@/components/helpers/urls";
import { ArticleFrontmatter } from "@/types/article";
import { Separator } from "@avgeek-inc/ds-web/layout/separator";

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
            <ButtonLink
              variant="ghost"
              aria-label="RSS feed"
              href={URLS.RSS_FEED()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HugeiconsIcon icon={RssIcon} aria-hidden="true" />
            </ButtonLink>
            {showAllArticles ? (
              <ButtonLink href={URLS.ARTICLES_LIST()}>
                View all articles
              </ButtonLink>
            ) : null}
          </div>
        }
      />
      <div>
        {articles.map((article, index) => (
          <div key={article.slug}>
            <ArticleSummaryCard article={article} />
            {index < articles.length - 1 ? <Separator /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
