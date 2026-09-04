"use client";

import { Link } from "@avgeek-inc/ds-web/navigation/link";
import { Avatar } from "@avgeek-inc/ds-web/media/avatar";
import { TypographyParagraph } from "@avgeek-inc/ds-web/typography/typography";

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
          <Avatar.Image
            src={experience.image}
            alt={`${experience.company} logo`}
          />
          <Avatar.Fallback>{experience.company.slice(0, 1)}</Avatar.Fallback>
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
