"use client";

import {
  Button,
  ButtonLink,
} from "@workspace/web-design-system/buttons/button";
import { TitleSection } from "@workspace/web-page-sections/title-section";

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
    <TitleSection
      titleLevel={1}
      actions={
        <>
          <Button onPress={reset}>Try again</Button>
          <ButtonLink variant="secondary" href={URLS.HOME()}>
            Home
          </ButtonLink>
          <ButtonLink variant="secondary" href={URLS.ARTICLES_LIST()}>
            Browse {articleLabel.toLowerCase()}
          </ButtonLink>
        </>
      }
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Praveen" }]}
      description={`We couldn't load these ${articleLabel.toLowerCase()}. Try again or choose another destination.`}
      title={`${articleLabel} unavailable`}
    />
  );
}
