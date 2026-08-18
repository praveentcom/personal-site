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
import { WorkExperience } from "@/types/work";

export function WorkSummaryCard({
  experience,
}: {
  experience: WorkExperience;
}) {
  const endDateText = experience.endDate
    ? formatDateShort(experience.endDate)
    : "Present";

  return (
    <article className="flex-col-1">
      {experience.image && (
        <Avatar className="shrink-0">
          <AvatarImage
            src={experience.image}
            alt={`${experience.company} logo`}
          />
          <AvatarFallback>{experience.company.slice(0, 1)}</AvatarFallback>
        </Avatar>
      )}
      <Link href={URLS.WORK(experience.slug)}>{experience.company}</Link>
      <TypographyParagraph color="muted">
        {experience.role}
        <span className="before:content-['·'] before:mx-1.5">
          {formatDateShort(experience.startDate)} – {endDateText}
        </span>
      </TypographyParagraph>
    </article>
  );
}
