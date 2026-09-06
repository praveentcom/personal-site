import { TitleSection } from "@avgeek-inc/ds-web-sections/title-section";

import { Markdown } from "@avgeek-inc/ds-web/typography/markdown";
import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DateRange } from "@/components/common/date-range";
import { TagButton } from "@/components/common/tag-button";
import { formatDateShort } from "@/components/helpers/date";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { generateWorkSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";
import {
  getAllWorkSlugs,
  getWorkBySlugContent,
} from "@/components/helpers/work";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const workEntries = await getAllWorkSlugs();
  return workEntries.map((work) => ({ slug: work.slug }));
}

export default async function WorkExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const workData = await getWorkBySlugContent(slug);

  if (!workData) {
    notFound();
  }

  const { meta: work, content } = workData;

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[
          { href: URLS.HOME(), label: "Home" },
          { href: URLS.WORK_LIST(), label: "Work" },
        ]}
        description={work.role}
        image={work.image ? { alt: work.company, src: work.image } : undefined}
        title={work.company}
      />
      <StructuredData data={generateWorkSchema(work)} />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <div className="grid gap-3">
          <DateRange startDate={work.startDate} endDate={work.endDate} />
          {work.skills && work.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {work.skills.map((tag, index) => (
                <TagButton key={index} tag={tag} />
              ))}
            </div>
          ) : null}
        </div>
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

  const workData = await getWorkBySlugContent(slug);

  if (!workData) {
    return createNotFoundMetadata("Work");
  }

  const { meta: work } = workData;

  const duration = `${formatDateShort(work.startDate)} – ${
    work.endDate ? formatDateShort(work.endDate) : "Present"
  }`;

  const description = `${work.role} position at ${work.company} (${duration}).`;

  const metadata = createPageMetadata({
    title: `${work.role} at ${work.company}`,
    description: description,
    keywords: [work.role, work.company, "work"],
    url: URLS.WORK(work.slug),
    image: work.ogImage,
  });

  return metadata;
}
