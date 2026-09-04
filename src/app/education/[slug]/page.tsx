import { TitleSection } from "@workspace/web-page-sections/title-section";

import { Markdown } from "@avgeek-inc/ds-web/typography/markdown";
import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    <>
      <TitleSection
        titleLevel={1}
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
      />
      <StructuredData data={generateEducationSchema(education)} />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <DateRange
          startDate={education.startDate}
          endDate={education.endDate}
        />
      </section>
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <Markdown content={content} />
      </section>
    </>
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
