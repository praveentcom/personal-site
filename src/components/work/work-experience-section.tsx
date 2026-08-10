"use client";

import { WorkSummaryCard } from "@/components/work/work-summary-card";
import { WorkExperience } from "@/types/work";

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
}

export function WorkExperienceSection({
  workExperience,
}: WorkExperienceSectionProps) {
  return (
    <div className="flex-col-4" role="region" aria-label="Work experience">
      <h4>Work</h4>
      <div className="grid grid-cols-1 gap-8">
        {workExperience.map((experience, index) => (
          <WorkSummaryCard key={index} experience={experience} />
        ))}
      </div>
    </div>
  );
}
