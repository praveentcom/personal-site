"use client";

import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { ToggleButton } from "@avgeek-inc/ds-web/buttons/toggle-button";
import { ToggleButtonGroup } from "@avgeek-inc/ds-web/buttons/toggle-button-group";
import { Avatar } from "@avgeek-inc/ds-web/media/avatar";
import { Link } from "@avgeek-inc/ds-web/navigation/link";
import {
  Typography,
  TypographyParagraph,
} from "@avgeek-inc/ds-web/typography/typography";
import { useState } from "react";

import { Grid } from "@avgeek-inc/ds-web/layout/grid";

import { EducationSummaryCard } from "@/components/education/education-summary-card";
import { formatDateYear } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { Education } from "@/types/education";

interface EducationViewProps {
  education: Education[];
}

type ViewMode = "grid" | "list";

export function EducationView({ education }: EducationViewProps) {
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
            {education.map((edu, index) => (
              <EducationSummaryCard key={index} education={edu} />
            ))}
          </Grid>
        </section>
      ) : (
        education.map((edu) => (
          <section
            className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6"
            key={edu.slug}
          >
            <ListEducationRow education={edu} />
          </section>
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
        <Avatar className="shrink-0">
          <Avatar.Image
            src={education.image}
            alt={`${education.school} logo`}
          />
          <Avatar.Fallback>{education.school.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      ) : (
        <Avatar className="shrink-0">
          <Avatar.Fallback>{education.school.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      )}
      <Link href={URLS.EDUCATION(education.slug)}>{education.degree}</Link>
      <Typography className="hidden sm:inline" color="muted">
        &middot; {education.school}
      </Typography>
      <div className="flex-1" />
      <TypographyParagraph className="shrink-0" color="muted">
        {formatDateYear(education.startDate)} – {endDateText}
      </TypographyParagraph>
    </div>
  );
}
