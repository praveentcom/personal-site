import { EducationSummaryCard } from "@/components/education/education-summary-card";
import { Education } from "@/types/education";
import { TypographyHeading } from "@workspace/web-design-system/typography/typography";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <div className="flex-col-4" role="region" aria-label="Education">
      <TypographyHeading level={4}>Education</TypographyHeading>
      <div className="grid grid-cols-1 gap-8">
        {education.map((edu, index) => (
          <EducationSummaryCard key={index} education={edu} />
        ))}
      </div>
    </div>
  );
}
