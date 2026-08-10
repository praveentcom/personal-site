"use client";

import Image from "next/image";
import Link from "next/link";

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
        <div className="shrink-0">
          <Image
            src={education.image}
            alt={`${education.school} logo`}
            width={40}
            height={40}
            className="object-cover size-10 rounded-sm"
          />
        </div>
      )}
      <p>
        <Link
          href={URLS.EDUCATION(education.slug)}
          className="text-foreground underline-offset-4 decoration-border pointer-fine:hover:underline"
        >
          {education.degree}
        </Link>
      </p>
      <p className="text-muted-foreground">
        {education.school}
        <span className="before:content-['·'] before:mx-1.5">
          {formatDateYear(education.startDate)} – {endDateText}
        </span>
      </p>
    </article>
  );
}
