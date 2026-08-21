"use client";

import { ButtonLink } from "@workspace/web-design-system/buttons/button";

import { CommunitySummaryCard } from "@/components/community/community-summary-card";
import { URLS } from "@/components/helpers/urls";
import { CommunityFrontmatter } from "@/types/community";
import { TypographyHeading } from "@workspace/web-design-system/typography/typography";

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
          <ButtonLink href={URLS.COMMUNITY_LIST()}>View all &rarr;</ButtonLink>
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
