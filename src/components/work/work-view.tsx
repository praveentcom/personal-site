"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/web-design-system/components/toggle-group";
import Link from "next/link";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { Grid } from "@workspace/web-design-system/components/grid";

import { formatDateShort } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { WorkExperience } from "@/types/work";
import { WorkSummaryCard } from "@/components/work/work-summary-card";

interface WorkViewProps {
  work: WorkExperience[];
}

type ViewMode = "grid" | "list";

export function WorkView({ work }: WorkViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <>
      <PageSection>
        <div className="flex-col-4 sm:flex-row sm:items-center sm:justify-between">
          <h3>Work Experience</h3>
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
      </PageSection>
      {viewMode === "grid" ? (
        <PageSection yPadding="none">
          <Grid columns={[1, 2, 2]}>
            {work.map((experience, index) => (
              <WorkSummaryCard key={index} experience={experience} />
            ))}
          </Grid>
        </PageSection>
      ) : (
        work.map((experience) => (
          <PageSection key={experience.slug}>
            <ListWorkRow experience={experience} />
          </PageSection>
        ))
      )}
    </>
  );
}

interface ListWorkRowProps {
  experience: WorkExperience;
}

function ListWorkRow({ experience }: ListWorkRowProps) {
  const endDateText = experience.endDate
    ? formatDateShort(experience.endDate)
    : "Present";

  return (
    <div className="flex items-center gap-3">
      {experience.image ? (
        <div className="shrink-0">
          <Image
            src={experience.image}
            alt={`${experience.company} logo`}
            width={32}
            height={32}
            className="object-cover size-8 rounded-sm"
          />
        </div>
      ) : (
        <div className="size-8 rounded-sm bg-muted shrink-0" />
      )}
      <p>
        <Link
          href={URLS.WORK(experience.slug)}
          className="text-foreground underline-offset-4 decoration-border pointer-fine:hover:underline"
        >
          {experience.company}
        </Link>
      </p>
      <span className="text-muted-foreground hidden sm:inline">
        &middot; {experience.role}
      </span>
      <div className="flex-1" />
      <p className="text-muted-foreground shrink-0">
        {formatDateShort(experience.startDate)} – {endDateText}
      </p>
    </div>
  );
}
