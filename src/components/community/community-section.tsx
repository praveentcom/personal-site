"use client";

import { Button } from "@workspace/web-design-system/components/button";
import Link from "next/link";

import { CommunitySummaryCard } from "@/components/community/community-summary-card";
import { URLS } from "@/components/helpers/urls";
import { CommunityFrontmatter } from "@/types/community";
import { TypographyHeading } from "@workspace/web-design-system/components/typography";

export function CommunitySection({
  contributions,
}: {
  contributions: CommunityFrontmatter[];
}) {
  return (
    <div
      className="flex-col-4"
      role="region"
      aria-label="Community Contributions"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TypographyHeading level={4}>
            Community Contributions
          </TypographyHeading>
        </div>
        {contributions.length > 2 && (
          <Button render={<Link href={URLS.COMMUNITY_LIST()} />}>
            View all &rarr;
          </Button>
        )}
      </div>
      <div className="flex-col-4">
        {contributions.map((contribution, index) => (
          <CommunitySummaryCard key={index} contribution={contribution} />
        ))}
      </div>
    </div>
  );
}
