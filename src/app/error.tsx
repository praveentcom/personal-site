"use client";

import { Button } from "@avgeek-inc/ds-web/buttons/button";
import { Link } from "@avgeek-inc/ds-web/navigation/link";
import {
  TypographyHeading,
  TypographyParagraph,
} from "@avgeek-inc/ds-web/typography/typography";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="status-page">
      <TypographyHeading elementType="h1" level={3}>
        Couldn’t load this page
      </TypographyHeading>
      <TypographyParagraph>
        Please try again, or return to the homepage.
      </TypographyParagraph>
      <div className="status-actions">
        <Button onPress={reset} variant="secondary">
          Try again
        </Button>
        <Link href="/">Home</Link>
      </div>
    </section>
  );
}
