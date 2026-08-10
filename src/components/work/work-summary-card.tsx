"use client";

import Image from "next/image";
import Link from "next/link";

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
        <div className="shrink-0">
          <Image
            src={experience.image}
            alt={`${experience.company} logo`}
            width={40}
            height={40}
            className="object-cover size-10 rounded-sm"
          />
        </div>
      )}
      <p>
        <Link
          href={URLS.WORK(experience.slug)}
          className="text-foreground underline-offset-4 decoration-border pointer-fine:hover:underline"
        >
          {experience.company}
        </Link>
      </p>
      <p className="text-muted-foreground">
        {experience.role}
        <span className="before:content-['·'] before:mx-1.5">
          {formatDateShort(experience.startDate)} – {endDateText}
        </span>
      </p>
    </article>
  );
}
