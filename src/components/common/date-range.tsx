import { formatDateShort } from "@/components/helpers/date";
import { TypographyParagraph } from "@workspace/web-design-system/typography/typography";

/**
 * Date range display component
 */
export function DateRange({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) {
  return (
    <TypographyParagraph color="muted">
      {startDate ? formatDateShort(startDate) : "Present"} -{" "}
      {endDate ? formatDateShort(endDate) : "Present"}
    </TypographyParagraph>
  );
}
