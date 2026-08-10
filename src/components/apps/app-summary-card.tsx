"use client";

import Image from "next/image";
import Link from "next/link";

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
        <div className="shrink-0">
          <Image
            src={app.image}
            alt={app.title}
            width={40}
            height={40}
            className="object-cover size-10 rounded-sm"
          />
        </div>
      )}
      <div className="flex gap-2 items-center">
        <p>
          <Link
            href={URLS.APPS(app.slug)}
            className="text-foreground underline-offset-4 decoration-border pointer-fine:hover:underline"
          >
            {app.title}
          </Link>
        </p>
        {app.githubUrl && <Badge>Open Source</Badge>}
      </div>
      {app.shortDescription && (
        <p className="text-muted-foreground">{app.shortDescription}</p>
      )}
      <p className="text-muted-foreground">{formatDateShort(app.date)}</p>
    </article>
  );
}
