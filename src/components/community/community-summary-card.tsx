"use client";

import Link from "next/link";

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
      <p className="text-base! sm:min-w-24 text-muted-foreground">
        {formatDate(contribution.date)}
      </p>
      <p className="sm:min-w-0">
        <Link
          href={URLS.COMMUNITY(contribution.year, contribution.slug)}
          className="text-foreground underline-offset-4 decoration-border sm:line-clamp-1 pointer-fine:hover:underline"
          title={contribution.title}
        >
          {contribution.title}
        </Link>
      </p>
    </article>
  );
}
