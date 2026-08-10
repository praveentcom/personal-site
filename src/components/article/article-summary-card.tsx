"use client";

import Link from "next/link";

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
        <p className="text-base! sm:min-w-24 text-muted-foreground">
          {formatDate(article.date)}
        </p>
        <div className="grid min-w-0 gap-1">
          <Link
            href={URLS.ARTICLES(article.year, article.slug)}
            className="underline-offset-4 decoration-border sm:line-clamp-1 pointer-fine:hover:underline"
            title={article.title}
          >
            {article.title}
          </Link>
          {article.description ? (
            <p
              className="line-clamp-2 text-sm text-muted-foreground"
              title={article.description}
            >
              {article.description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
