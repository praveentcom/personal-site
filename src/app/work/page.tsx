import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { getAllWorkSlugs } from "@/components/helpers/work";
import { WorkView } from "@/components/work/work-view";

export default async function WorkPage() {
  const work = await getAllWorkSlugs();

  return (
    <ContentPage
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={"Work"}
    >
      <>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Work Experience`,
            description:
              "A comprehensive overview of my professional work experience and career journey.",
          }}
        />
        <PageSection width="full" xPadding="none" yPadding="none">
          <WorkView work={work} />
        </PageSection>
      </>
    </ContentPage>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `Work Experience`,
    description:
      "A comprehensive overview of my professional work experience and career journey.",
    keywords: ["work", "experience", "career", "employment"],
    url: URLS.WORK_LIST(),
  });

  return metadata;
}
