import { TitleSection } from "@workspace/web-page-sections/title-section";

import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import type { Metadata } from "next";

import { AppsView } from "@/components/apps/apps-view";
import { getAllAppSlugs } from "@/components/helpers/apps";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";

export default async function AppsPage() {
  const apps = await getAllAppSlugs();

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={"Apps"}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Apps`,
          description:
            "A comprehensive showcase of all my apps and contributions.",
        }}
      />
      <section className="grid gap-6">
        <AppsView apps={apps} />
      </section>
    </>
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
