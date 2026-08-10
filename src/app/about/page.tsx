import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { Markdown } from "@workspace/web-design-system/components/markdown";
import { PageSection } from "@workspace/web-design-system/layouts/page";
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
    <ContentPage
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={"About"}
    >
      <>
        <StructuredData data={defaultSchema} />
        <PageSection>
          <h3>About</h3>
          <Markdown content={aboutContent ?? ""} />
        </PageSection>
      </>
    </ContentPage>
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
