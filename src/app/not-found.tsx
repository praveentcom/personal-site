import type { Metadata } from "next";
import { ButtonLink } from "@workspace/web-design-system/buttons/button";
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
          <ButtonLink href={URLS.HOME()}>Home</ButtonLink>
          <ButtonLink variant="secondary" href={URLS.ARTICLES_LIST()}>
            Browse {articleLabel.toLowerCase()}
          </ButtonLink>
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
