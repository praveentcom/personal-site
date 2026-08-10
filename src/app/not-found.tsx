import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@workspace/web-design-system/components/button";
import { StatusPage } from "@workspace/web-page-sections/page";
import { plural } from "pluralize";

import { getArticleLabel } from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";

const articleLabel = plural(getArticleLabel());

export default function NotFound() {
  return (
    <StatusPage
      actions={
        <>
          <Button render={<Link href={URLS.HOME()} />}>Home</Button>
          <Button
            variant="secondary"
            render={<Link href={URLS.ARTICLES_LIST()} />}
          >
            Browse {articleLabel.toLowerCase()}
          </Button>
        </>
      }
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Praveen" }]}
      description="The page you're looking for doesn't exist or has been moved."
      title="Page not found"
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `Page not found`,
    description: `The page you're looking for doesn't exist or has been moved. Return to the homepage or browse ${articleLabel.toLowerCase()} to find what you're looking for.`,
  });

  return metadata;
}
