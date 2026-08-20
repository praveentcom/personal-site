"use client";

import { Link } from "@workspace/web-design-system/navigation/link";
import { TypographyParagraph } from "@workspace/web-design-system/typography/typography";

import { formatDate } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { Article } from "@/types/article";

export type ArticleLike = Pick<
  Article,
  | "slug"
  | "title"
  | "description"
  | "date"
  | "readTime"
  | "tags"
  | "categories"
  | "published"
  | "image"
> & { year: string };

export function ArticleSummaryCard({ article }: { article: ArticleLike }) {
  return (
    <article className="py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
        <TypographyParagraph className="sm:min-w-24" color="muted">
          {formatDate(article.date)}
        </TypographyParagraph>
        <div className="grid min-w-0 gap-1">
          <Link
            href={URLS.ARTICLES(article.year, article.slug)}
            className="sm:line-clamp-1"
          >
            {article.title}
          </Link>
          {article.description ? (
            <TypographyParagraph
              className="line-clamp-2"
              color="muted"
              size="sm"
              title={article.description}
            >
              {article.description}
            </TypographyParagraph>
          ) : null}
        </div>
      </div>
    </article>
  );
}
