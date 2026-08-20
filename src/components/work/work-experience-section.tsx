"use client";

import { WorkSummaryCard } from "@/components/work/work-summary-card";
import { WorkExperience } from "@/types/work";
import { TypographyHeading } from "@workspace/web-design-system/typography/typography";

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
}

export function WorkExperienceSection({
  workExperience,
}: WorkExperienceSectionProps) {
  return (
    <div className="flex-col-4" role="region" aria-label="Work experience">
      <TypographyHeading level={4}>Work</TypographyHeading>
      <div className="grid grid-cols-1 gap-8">
        {workExperience.map((experience, index) => (
          <WorkSummaryCard key={index} experience={experience} />
        ))}
      </div>
    </div>
  );
}
