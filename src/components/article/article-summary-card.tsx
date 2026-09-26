import Link from "next/link";
import { URLS } from "@/components/helpers/urls";
import type { Article } from "@/types/article";

type ArticleSummary = Pick<Article, "slug" | "title" | "emoji" | "date">;

export function ArticleSummaryCard({ article }: { article: ArticleSummary }) {
  const date = new Date(article.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <article>
      <Link className="article-row" href={URLS.ARTICLES(article.slug)}>
        <span className="article-title">
          {article.emoji && (
            <span className="article-list-emoji" aria-hidden="true">
              {article.emoji}
            </span>
          )}
          <span>{article.title}</span>
        </span>
        <time dateTime={article.date}>{date}</time>
      </Link>
    </article>
  );
}
