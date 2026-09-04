import { TitleSection } from "@workspace/web-page-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";

import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { getAllWorkSlugs } from "@/components/helpers/work";
import { WorkView } from "@/components/work/work-view";

export default async function WorkPage() {
  const work = await getAllWorkSlugs();

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={"Work experience"}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Work Experience`,
          description:
            "A comprehensive overview of my professional work experience and career journey.",
        }}
      />
      <section className="grid gap-6">
        <WorkView work={work} />
      </section>
    </>
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
