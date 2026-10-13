"use client";

import { Button } from "@avgeek/ds-web/base/button";
import { Link } from "@avgeek/ds-web/base/link";
import { Typography } from "@avgeek/ds-web/base/typography";
import { typographyVariants } from "@heroui/styles";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="status-page">
      <Typography.Heading
        level={1}
        className={typographyVariants({ type: "h3" }).base()}
      >
        Couldn’t load this page
      </Typography.Heading>
      <Typography.Paragraph>
        Please try again, or return to the homepage.
      </Typography.Paragraph>
      <div className="status-actions">
        <Button onPress={reset} variant="secondary">
          Try again
        </Button>
        <Link href="/">Home</Link>
      </div>
    </section>
  );
}
