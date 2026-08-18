import { Button } from "@workspace/web-design-system/components/button";

import { CommunityTypeButton } from "@/components/community/community-type-button";
import type { CommunityIndexItem } from "@/components/helpers/community";
import { formatDate } from "@/components/helpers/date";
import { Typography } from "@workspace/web-design-system/components/typography";

interface CommunityTitleDetailsProps {
  contribution: CommunityIndexItem;
}

export function CommunityTitleDetails({
  contribution,
}: CommunityTitleDetailsProps) {
  return (
    <div className="flex-col-4">
      <div className="flex items-center min-w-0 gap-4">
        <Typography className="shrink-0" color="muted">
          {formatDate(contribution.date)}
        </Typography>
        {contribution.event && (
          <Typography className="shrink-0" color="muted">
            {contribution.event}
          </Typography>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {contribution.type && <CommunityTypeButton type={contribution.type} />}
      </div>
      {(contribution.youtubeUrl || contribution.externalLinks) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {contribution.youtubeUrl && (
            <Button
              render={
                <a
                  href={contribution.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Watch on YouTube
            </Button>
          )}
          {contribution.externalLinks &&
            contribution.externalLinks.map((link, index) => (
              <Button
                key={`${link.title}-${index}`}
                variant="secondary"
                render={
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                {link.title}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
