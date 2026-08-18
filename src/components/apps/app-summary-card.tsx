"use client";

import { Link } from "@workspace/web-design-system/components/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/web-design-system/components/avatar";
import { TypographyParagraph } from "@workspace/web-design-system/components/typography";

import { formatDateShort } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { App } from "@/types/app";
import { Badge } from "@workspace/web-design-system/components/badge";

interface AppCardProps {
  app: App;
  currentTag?: string;
}

export function AppSummaryCard({ app }: AppCardProps) {
  return (
    <article className="flex-col-1">
      {app.image && (
        <Avatar className="shrink-0">
          <AvatarImage src={app.image} alt={app.title} />
          <AvatarFallback>{app.title.slice(0, 1)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex gap-2 items-center">
        <Link href={URLS.APPS(app.slug)}>{app.title}</Link>
        {app.githubUrl && <Badge>Open Source</Badge>}
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
