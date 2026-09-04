"use client";

import { Link } from "@avgeek-inc/ds-web/navigation/link";
import { Avatar } from "@avgeek-inc/ds-web/media/avatar";
import { TypographyParagraph } from "@avgeek-inc/ds-web/typography/typography";

import { formatDateYear } from "@/components/helpers/date";
import { URLS } from "@/components/helpers/urls";
import { Education } from "@/types/education";

export function EducationSummaryCard({ education }: { education: Education }) {
  const endDateText = education.endDate
    ? formatDateYear(education.endDate)
    : "Present";

  return (
    <article className="flex-col-1">
      {education.image && (
        <Avatar className="shrink-0">
          <Avatar.Image
            src={education.image}
            alt={`${education.school} logo`}
          />
          <Avatar.Fallback>{education.school.slice(0, 1)}</Avatar.Fallback>
        </Avatar>
      )}
      <Link href={URLS.EDUCATION(education.slug)}>{education.degree}</Link>
      <TypographyParagraph color="muted">
        {education.school}
        <span className="before:content-['·'] before:mx-1.5">
          {formatDateYear(education.startDate)} – {endDateText}
        </span>
      </TypographyParagraph>
    </article>
  );
}
