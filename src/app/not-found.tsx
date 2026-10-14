import { Link } from "@avgeek/ds-web/base/link";
import { Typography } from "@avgeek/ds-web/base/typography";
import { typographyVariants } from "@heroui/styles";

export default function NotFound() {
  return (
    <section className="status-page">
      <Typography.Paragraph color="muted" size="sm">
        404
      </Typography.Paragraph>
      <Typography.Heading
        level={1}
        className={typographyVariants({ type: "h3" }).base()}
      >
        Page not found
      </Typography.Heading>
      <Typography.Paragraph>
        This page may have moved, or the link may be incorrect.
      </Typography.Paragraph>
      <Link href="/">Back to Praveen’s homepage</Link>
    </section>
  );
}
