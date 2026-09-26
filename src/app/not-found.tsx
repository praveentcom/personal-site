import { Link } from "@avgeek-inc/ds-web/navigation/link";
import {
  TypographyHeading,
  TypographyParagraph,
} from "@avgeek-inc/ds-web/typography/typography";

export default function NotFound() {
  return (
    <section className="status-page">
      <TypographyParagraph color="muted" size="sm">
        404
      </TypographyParagraph>
      <TypographyHeading elementType="h1" level={3}>
        Page not found
      </TypographyHeading>
      <TypographyParagraph>
        This page may have moved, or the link may be incorrect.
      </TypographyParagraph>
      <Link href="/">Back to Praveen’s homepage</Link>
    </section>
  );
}
