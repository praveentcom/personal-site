"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
import { Select } from "@workspace/web-design-system/pickers/select";
import { ListBox } from "@workspace/web-design-system/collections/list-box";
import { ToggleButton } from "@workspace/web-design-system/buttons/toggle-button";
import { ToggleButtonGroup } from "@workspace/web-design-system/buttons/toggle-button-group";
import { Link } from "@workspace/web-design-system/navigation/link";
import { Avatar } from "@workspace/web-design-system/media/avatar";
import { TypographyParagraph } from "@workspace/web-design-system/typography/typography";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { Grid } from "@workspace/web-design-system/layout/grid";

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
              selectedKey={filterMode}
              onSelectionChange={(value) => setFilterMode(value as FilterMode)}
              fullWidth
              aria-label="Filter apps by source"
            >
              <Select.Trigger className="w-fit">
                <Select.Value>{FILTER_LABELS[filterMode]}</Select.Value>
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom end">
                <ListBox>
                  <ListBox.Item id="all" textValue={FILTER_LABELS.all}>
                    {FILTER_LABELS.all}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item
                    id="open-source"
                    textValue={FILTER_LABELS["open-source"]}
                  >
                    {FILTER_LABELS["open-source"]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item
                    id="closed-source"
                    textValue={FILTER_LABELS["closed-source"]}
                  >
                    {FILTER_LABELS["closed-source"]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            <ToggleButtonGroup
              className="shrink-0"
              disallowEmptySelection
              selectedKeys={[viewMode]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const newValue = [...keys][0];
                if (newValue === "grid" || newValue === "list") {
                  setViewMode(newValue);
                }
              }}
            >
              <ToggleButton aria-label="Grid view" id="grid" isIconOnly>
                <HugeiconsIcon aria-hidden="true" icon={GridViewIcon} />
              </ToggleButton>
              <ToggleButton aria-label="List view" id="list" isIconOnly>
                <ToggleButtonGroup.Separator />
                <HugeiconsIcon aria-hidden="true" icon={ListViewIcon} />
              </ToggleButton>
            </ToggleButtonGroup>
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
          <Avatar.Image src={imageUrl} alt={app.title} />
          <Avatar.Fallback>{app.title.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      ) : (
        <Avatar className="shrink-0">
          <Avatar.Fallback>{app.title.slice(0, 1)}</Avatar.Fallback>
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
