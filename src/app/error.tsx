"use client";

import Link from "next/link";
import { Button } from "@workspace/web-design-system/components/button";
import { StatusPage } from "@workspace/web-page-sections/page";
import { plural } from "pluralize";

import { getArticleLabel } from "@/components/helpers/config";
import { URLS } from "@/components/helpers/urls";

const articleLabel = plural(getArticleLabel());

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" render={<Link href={URLS.HOME()} />}>
            Home
          </Button>
          <Button
            variant="secondary"
            render={<Link href={URLS.ARTICLES_LIST()} />}
          >
            Browse {articleLabel.toLowerCase()}
          </Button>
        </>
      }
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Praveen" }]}
      description={`We couldn't load these ${articleLabel.toLowerCase()}. Try again or choose another destination.`}
      title={`${articleLabel} unavailable`}
    />
  );
}
