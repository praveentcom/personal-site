import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@workspace/web-design-system/components/markdown";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

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
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.WORK_LIST(), label: "Work" },
      ]}
      description={work.role}
      image={work.image ? { alt: work.company, src: work.image } : undefined}
      title={work.company}
    >
      <>
        <StructuredData data={generateWorkSchema(work)} />
        <PageSection>
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
