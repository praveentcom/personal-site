"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon } from "@hugeicons-pro/core-solid-rounded";
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
import {
  Typography,
  TypographyParagraph,
} from "@workspace/web-design-system/components/typography";
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
        <div className="flex justify-end">
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
        <Avatar className="shrink-0">
          <AvatarImage
            src={experience.image}
            alt={`${experience.company} logo`}
          />
          <AvatarFallback>{experience.company.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="shrink-0">
          <AvatarFallback>{experience.company.slice(0, 1)}</AvatarFallback>
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
