import { ContentPage } from "@workspace/web-page-sections/page";
import { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import { Markdown } from "@workspace/web-design-system/typography/markdown";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { getMdContent } from "@/components/helpers/md-content";
import { createPageMetadata } from "@/components/helpers/metadata";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

export default async function CoverPage() {
  const [coverContent, defaultSchema] = await Promise.all([
    getMdContent("profile/cover.md"),
    generateDefaultSchema(),
  ]);

  return (
    <ContentPage
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={"Cover letter"}
    >
      <>
        <StructuredData data={defaultSchema} />
        <PageSection>
          <Markdown content={coverContent ?? ""} />
        </PageSection>
      </>
    </ContentPage>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `Cover letter`,
    description:
      "A personalized introduction highlighting my experience and interest in joining your team.",
    keywords: [
      "cover letter",
      "introduction",
      "experience",
      "skills",
      "professional",
      "career",
    ],
    url: URLS.COVER(),
  });

  return metadata;
}
