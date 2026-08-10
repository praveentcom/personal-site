import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { createPageMetadata } from "@/components/helpers/metadata";
import { getAllAppSlugs } from "@/components/helpers/apps";
import { URLS } from "@/components/helpers/urls";
import { AppsView } from "@/components/apps/apps-view";

export default async function AppsPage() {
  const apps = await getAllAppSlugs();

  return (
    <ContentPage
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={"Apps"}
    >
      <>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Apps`,
            description:
              "A comprehensive showcase of all my apps and contributions.",
          }}
        />
        <PageSection width="full" xPadding="none" yPadding="none">
          <AppsView apps={apps} />
        </PageSection>
      </>
    </ContentPage>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `Apps`,
    description: "A comprehensive showcase of all my apps and contributions.",
    keywords: ["apps", "showcase", "contributions"],
    url: URLS.APPS_LIST(),
  });

  return metadata;
}
