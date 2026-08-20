"use client";

import { Link } from "@workspace/web-design-system/navigation/link";
import { Avatar } from "@workspace/web-design-system/media/avatar";
import { TypographyParagraph } from "@workspace/web-design-system/typography/typography";

import { formatDateShort } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { App } from "@/types/app";
import { Chip } from "@workspace/web-design-system/data-display/chip";

interface AppCardProps {
  app: App;
  currentTag?: string;
}

export function AppSummaryCard({ app }: AppCardProps) {
  return (
    <article className="flex-col-1">
      {app.image && (
        <Avatar className="shrink-0">
          <Avatar.Image src={app.image} alt={app.title} />
          <Avatar.Fallback>{app.title.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      )}
      <div className="flex gap-2 items-center">
        <Link href={URLS.APPS(app.slug)}>{app.title}</Link>
        {app.githubUrl && <Chip>Open Source</Chip>}
      </div>
      {app.shortDescription && (
        <TypographyParagraph color="muted">
          {app.shortDescription}
        </TypographyParagraph>
      )}
      <TypographyParagraph color="muted">
        {formatDateShort(app.date)}
      </TypographyParagraph>
    </article>
  );
}
