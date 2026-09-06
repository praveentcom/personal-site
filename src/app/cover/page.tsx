import { TitleSection } from "@avgeek-inc/ds-web-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import { Metadata } from "next";

import { getContentComponent } from "@/lib/mdx";
import { createPageMetadata } from "@/components/helpers/metadata";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

export default async function CoverPage() {
  const [Content, defaultSchema] = await Promise.all([
    getContentComponent("profile", "cover"),
    generateDefaultSchema(),
  ]);

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={"Cover letter"}
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
