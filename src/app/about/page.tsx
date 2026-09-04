import { TitleSection } from "@workspace/web-page-sections/title-section";

import { Markdown } from "@workspace/web-design-system/typography/markdown";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import type { Metadata } from "next";

import { getMdContent } from "@/components/helpers/md-content";
import { createPageMetadata } from "@/components/helpers/metadata";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

export default async function AboutPage() {
  const [aboutContent, defaultSchema] = await Promise.all([
    getMdContent("profile/about.md"),
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
        <Markdown content={aboutContent ?? ""} />
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
