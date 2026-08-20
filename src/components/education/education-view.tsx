"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
import { ToggleButton } from "@workspace/web-design-system/buttons/toggle-button";
import { ToggleButtonGroup } from "@workspace/web-design-system/buttons/toggle-button-group";
import { Link } from "@workspace/web-design-system/navigation/link";
import { Avatar } from "@workspace/web-design-system/media/avatar";
import {
  Typography,
  TypographyParagraph,
} from "@workspace/web-design-system/typography/typography";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { Grid } from "@workspace/web-design-system/layout/grid";

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
