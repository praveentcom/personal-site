import { formatDateShort } from "@/components/helpers/date";
import { TypographyParagraph } from "@avgeek-inc/ds-web/typography/typography";

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
