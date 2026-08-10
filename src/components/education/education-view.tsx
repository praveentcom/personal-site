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

import { formatDateYear } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { Education } from "@/types/education";
import { EducationSummaryCard } from "@/components/education/education-summary-card";

interface EducationViewProps {
  education: Education[];
}

type ViewMode = "grid" | "list";

export function EducationView({ education }: EducationViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <>
      <PageSection>
        <div className="flex-col-4 sm:flex-row sm:items-center sm:justify-between">
          <h3>Education</h3>
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
            {education.map((edu, index) => (
              <EducationSummaryCard key={index} education={edu} />
            ))}
          </Grid>
        </PageSection>
      ) : (
        education.map((edu) => (
          <PageSection key={edu.slug}>
            <ListEducationRow education={edu} />
          </PageSection>
        ))
      )}
    </>
  );
}

interface ListEducationRowProps {
  education: Education;
}

function ListEducationRow({ education }: ListEducationRowProps) {
  const endDateText = education.endDate
    ? formatDateYear(education.endDate)
    : "Present";

  return (
    <div className="flex items-center gap-3">
      {education.image ? (
        <div className="shrink-0">
          <Image
            src={education.image}
            alt={`${education.school} logo`}
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
          href={URLS.EDUCATION(education.slug)}
          className="text-foreground underline-offset-4 decoration-border pointer-fine:hover:underline"
        >
          {education.degree}
        </Link>
      </p>
      <span className="text-muted-foreground hidden sm:inline">
        &middot; {education.school}
      </span>
      <div className="flex-1" />
      <p className="text-muted-foreground shrink-0">
        {formatDateYear(education.startDate)} – {endDateText}
      </p>
    </div>
  );
}
