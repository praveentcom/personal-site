import { MarkdownDropdown } from "@workspace/web-design-system/components/md-copy";
import { Separator } from "@workspace/web-design-system/components/separator";
import Link from "next/link";

import { ArticleCategoryButton } from "@/components/article/article-category-button";
import type { ArticleLike } from "@/components/article/article-summary-card";
import { TagButton } from "@/components/common/tag-button";
import { formatDate } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";

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
          <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
            <p>{article.readTime} min read</p>
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
            <p>Published on {formatDate(article.date)}</p>
          </div>
        </div>
        <div className="sm:ms-auto">
          <MarkdownDropdown text={markdown} viewUrl={mdUrl} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {article.categories.map((category, index) => (
          <ArticleCategoryButton
            key={index}
            category={category}
            count={article.categories.filter((c) => c === category).length}
            render={
              <Link
                href={URLS.ARTICLES_CATEGORY(encodeURIComponent(category))}
              />
            }
          />
        ))}
        {article.tags.map((tag, index) => (
          <TagButton
            key={index}
            tag={tag}
            count={article.tags.filter((t) => t === tag).length}
            render={<Link href={URLS.ARTICLES_TAG(tag)} />}
          />
        ))}
      </div>
    </div>
  );
}
