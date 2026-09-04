import { TitleSection } from "@workspace/web-page-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";

import { EducationView } from "@/components/education/education-view";
import { getAllEducationSlugs } from "@/components/helpers/education";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";

export default async function EducationPage() {
  const education = await getAllEducationSlugs();

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={"Education"}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Education`,
          description: "My academic background and educational qualifications.",
        }}
      />
      <section className="grid gap-6">
        <EducationView education={education} />
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `Education`,
    description: "My academic background and educational qualifications.",
    keywords: [
      "education",
      "academic",
      "university",
      "degree",
      "qualifications",
    ],
    url: URLS.EDUCATION_LIST(),
  });

  return metadata;
}
