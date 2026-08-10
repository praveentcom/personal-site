import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@workspace/web-design-system/components/markdown";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { DateRange } from "@/components/common/date-range";
import { formatDateShort } from "@/components/helpers/date";
import {
  getAllEducationSlugs,
  getEducationBySlugContent,
} from "@/components/helpers/education";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { generateEducationSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const educationEntries = await getAllEducationSlugs();
  return educationEntries.map((education) => ({ slug: education.slug }));
}

export default async function EducationPage({ params }: PageProps) {
  const { slug } = await params;
  const educationData = await getEducationBySlugContent(slug);

  if (!educationData) {
    notFound();
  }

  const { meta: education, content } = educationData;

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.EDUCATION_LIST(), label: "Education" },
      ]}
      description={education.degree}
      image={
        education.image
          ? { alt: education.school, src: education.image }
          : undefined
      }
      title={education.school}
    >
      <>
        <StructuredData data={generateEducationSchema(education)} />
        <PageSection>
          <DateRange
            startDate={education.startDate}
            endDate={education.endDate}
          />
        </PageSection>
        <PageSection>
          <Markdown content={content} />
        </PageSection>
      </>
    </ContentPage>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const educationData = await getEducationBySlugContent(slug);

  if (!educationData) {
    return createNotFoundMetadata("Education");
  }

  const { meta: education } = educationData;

  const duration = `${formatDateShort(education.startDate)} – ${
    education.endDate ? formatDateShort(education.endDate) : "Present"
  }`;
  const description = `${education.degree} from ${education.school} (${duration}).`;

  const metadata = createPageMetadata({
    title: `${education.degree} from ${education.school}`,
    description: description,
    type: "article",
    url: URLS.EDUCATION(education.slug),
    image: education.ogImage,
  });

  return metadata;
}
