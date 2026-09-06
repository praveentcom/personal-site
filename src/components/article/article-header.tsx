import { MarkdownDropdown } from "@avgeek-inc/ds-web/typography/md-copy";
import { Separator } from "@avgeek-inc/ds-web/layout/separator";

import { ArticleCategoryButtonLink } from "@/components/article/article-category-button";
import type { ArticleLike } from "@/components/article/article-summary-card";
import { TagButtonLink } from "@/components/common/tag-button";
import { formatDate } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { Typography } from "@avgeek-inc/ds-web/typography/typography";

interface ArticleTitleDetailsProps {
  article: ArticleLike;
  markdown: string;
  mdUrl: string;
}

export function ArticleTitleDetails({
  article,
  markdown,
  mdUrl,
}: ArticleTitleDetailsProps) {
  return (
    <div className="flex-col-4">
      <div className="flex flex-col sm:flex-row sm:items-center min-w-0 gap-4">
        <div className="flex items-center gap-4">
          <Typography className="shrink-0" color="muted">
            {article.readTime} min read
          </Typography>
          <Separator orientation="vertical" />
          <Typography className="shrink-0" color="muted">
            Published on {formatDate(article.date)}
          </Typography>
        </div>
        <div className="sm:ms-auto">
          <MarkdownDropdown text={markdown} viewUrl={mdUrl} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {article.categories.map((category, index) => (
          <ArticleCategoryButtonLink
            key={index}
            category={category}
            count={article.categories.filter((c) => c === category).length}
            href={URLS.ARTICLES_CATEGORY(category)}
          />
        ))}
        {article.tags.map((tag, index) => (
          <TagButtonLink
            key={index}
            tag={tag}
            count={article.tags.filter((t) => t === tag).length}
            href={URLS.ARTICLES_TAG(tag)}
          />
        ))}
      </div>
    </div>
  );
}
