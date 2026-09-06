import { TitleSection } from "@avgeek-inc/ds-web-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";

import { getContentComponent } from "@/lib/mdx";
import { createPageMetadata } from "@/components/helpers/metadata";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

export default async function AboutPage() {
  const [Content, defaultSchema] = await Promise.all([
    getContentComponent("profile", "about"),
    generateDefaultSchema(),
  ]);

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={"About"}
      />
      <StructuredData data={defaultSchema} />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <Content />
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: "About",
    description:
      "Learn more about my background, experiences, and what drives me professionally and personally.",
    keywords: [
      "about",
      "background",
      "experience",
      "professional",
      "personal",
      "biography",
    ],
    url: URLS.ABOUT(),
  });

  return metadata;
}
