"use client";

import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { ToggleButton } from "@workspace/web-design-system/buttons/toggle-button";
import { ToggleButtonGroup } from "@workspace/web-design-system/buttons/toggle-button-group";
import { Avatar } from "@workspace/web-design-system/media/avatar";
import { Link } from "@workspace/web-design-system/navigation/link";
import {
  Typography,
  TypographyParagraph,
} from "@workspace/web-design-system/typography/typography";
import { useState } from "react";

import { Grid } from "@workspace/web-design-system/layout/grid";

import { formatDateShort } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { WorkSummaryCard } from "@/components/work/work-summary-card";
import { WorkExperience } from "@/types/work";

interface WorkViewProps {
  work: WorkExperience[];
}

type ViewMode = "grid" | "list";

export function WorkView({ work }: WorkViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <>
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <div className="flex justify-end">
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
      </section>
      {viewMode === "grid" ? (
        <section className="grid gap-6 px-5 sm:px-6">
          <Grid columns={[1, 2, 2]}>
            {work.map((experience, index) => (
              <WorkSummaryCard key={index} experience={experience} />
            ))}
          </Grid>
        </section>
      ) : (
        work.map((experience) => (
          <section
            className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6"
            key={experience.slug}
          >
            <ListWorkRow experience={experience} />
          </section>
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
        <Avatar className="shrink-0">
          <Avatar.Image
            src={experience.image}
            alt={`${experience.company} logo`}
          />
          <Avatar.Fallback>{experience.company.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      ) : (
        <Avatar className="shrink-0">
          <Avatar.Fallback>{experience.company.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      )}
      <Link href={URLS.WORK(experience.slug)}>{experience.company}</Link>
      <Typography className="hidden sm:inline" color="muted">
        &middot; {experience.role}
      </Typography>
      <div className="flex-1" />
      <TypographyParagraph className="shrink-0" color="muted">
        {formatDateShort(experience.startDate)} – {endDateText}
      </TypographyParagraph>
    </div>
  );
}
