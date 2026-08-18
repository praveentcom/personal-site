"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/web-design-system/components/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/web-design-system/components/toggle-group";
import { Link } from "@workspace/web-design-system/components/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/web-design-system/components/avatar";
import { TypographyParagraph } from "@workspace/web-design-system/components/typography";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { Grid } from "@workspace/web-design-system/components/grid";

import { formatDateShort } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { App } from "@/types/app";
import { AppSummaryCard } from "@/components/apps/app-summary-card";

interface AppsViewProps {
  apps: App[];
}

type ViewMode = "grid" | "list";
type FilterMode = "all" | "open-source" | "closed-source";

const FILTER_LABELS: Record<FilterMode, string> = {
  all: "All apps",
  "open-source": "Open source",
  "closed-source": "Closed source",
};

export function AppsView({ apps }: AppsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const filteredApps = apps.filter((app) => {
    if (filterMode === "open-source") {
      return Boolean(app.githubUrl);
    }

    if (filterMode === "closed-source") {
      return !app.githubUrl;
    }

    return true;
  });

  return (
    <>
      <PageSection>
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Select
              value={filterMode}
              onValueChange={(value) => setFilterMode(value as FilterMode)}
            >
              <SelectTrigger
                className="w-fit"
                aria-label="Filter apps by source"
              >
                <SelectValue>{FILTER_LABELS[filterMode]}</SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">{FILTER_LABELS.all}</SelectItem>
                <SelectItem value="open-source">
                  {FILTER_LABELS["open-source"]}
                </SelectItem>
                <SelectItem value="closed-source">
                  {FILTER_LABELS["closed-source"]}
                </SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup
              value={[viewMode]}
              onValueChange={(details) => {
                const newValue = details[0];
                if (newValue) {
                  setViewMode(newValue as ViewMode);
                }
              }}
              className="shrink-0"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <HugeiconsIcon icon={GridViewIcon} />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <HugeiconsIcon icon={ListViewIcon} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </PageSection>
      {viewMode === "grid" ? (
        <PageSection yPadding="none">
          <Grid columns={[1, 2, 2]}>
            {filteredApps.map((app) => (
              <AppSummaryCard key={app.slug} app={app} />
            ))}
          </Grid>
        </PageSection>
      ) : (
        filteredApps.map((app) => (
          <PageSection key={app.slug}>
            <ListAppRow app={app} imageUrl={app.image} />
          </PageSection>
        ))
      )}
    </>
  );
}

interface ListAppRowProps {
  app: App;
  imageUrl?: string;
}

function ListAppRow({ app, imageUrl }: ListAppRowProps) {
  return (
    <div className="flex items-center gap-3">
      {imageUrl ? (
        <Avatar className="shrink-0">
          <AvatarImage src={imageUrl} alt={app.title} />
          <AvatarFallback>{app.title.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="shrink-0">
          <AvatarFallback>{app.title.slice(0, 1)}</AvatarFallback>
        </Avatar>
      )}
      <Link href={URLS.APPS(app.slug)}>{app.title}</Link>
      <div className="flex-1" />
      <TypographyParagraph className="shrink-0" color="muted">
        {formatDateShort(app.date)}
      </TypographyParagraph>
    </div>
  );
}
