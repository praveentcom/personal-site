"use client";

import { Link } from "@workspace/web-design-system/navigation/link";
import { TypographyParagraph } from "@workspace/web-design-system/typography/typography";

import { CommunityIndexItem } from "@/components/helpers/community";
import { formatDate } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";

export function CommunitySummaryCard({
  contribution,
}: {
  contribution: CommunityIndexItem;
}) {
  return (
    <article className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <TypographyParagraph className="sm:min-w-24" color="muted">
        {formatDate(contribution.date)}
      </TypographyParagraph>
      <div className="sm:min-w-0">
        <Link
          href={URLS.COMMUNITY(contribution.year, contribution.slug)}
          className="sm:line-clamp-1"
        >
          {contribution.title}
        </Link>
      </div>
    </article>
  );
}
