import { EducationSummaryCard } from "@/components/education/education-summary-card";
import { Education } from "@/types/education";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <div className="flex-col-4" role="region" aria-label="Education">
      <div className="flex items-center gap-2 text-muted-foreground">
        <h4>Education</h4>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {education.map((edu, index) => (
          <EducationSummaryCard key={index} education={edu} />
        ))}
      </div>
    </div>
  );
}
