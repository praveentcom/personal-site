import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { getAllEducationSlugs } from "@/components/helpers/education";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { EducationView } from "@/components/education/education-view";

export default async function EducationPage() {
  const education = await getAllEducationSlugs();

  return (
    <ContentPage
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={"Education"}
    >
      {
        <>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `Education`,
              description:
                "My academic background and educational qualifications.",
            }}
          />
          <PageSection width="full" xPadding="none" yPadding="none">
            <EducationView education={education} />
          </PageSection>
        </>
      }
    </ContentPage>
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
