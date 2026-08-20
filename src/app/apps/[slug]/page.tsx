import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/web-design-system/buttons/button";
import { Markdown } from "@workspace/web-design-system/typography/markdown";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { TypographyParagraph } from "@workspace/web-design-system/typography/typography";

import { TagButton } from "@/components/common/tag-button";
import { PROFILE_NAME } from "@/components/helpers/config";
import { formatDateShort } from "@/components/helpers/date";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { getAllAppSlugs, getAppBySlugContent } from "@/components/helpers/apps";
import { generateAppSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const apps = await getAllAppSlugs();
  return apps.map((app) => ({ slug: app.slug }));
}

export default async function AppPage({ params }: PageProps) {
  const { slug } = await params;
  const appData = await getAppBySlugContent(slug);

  if (!appData) {
    notFound();
  }

  const { meta: app, content } = appData;

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.APPS_LIST(), label: "Apps" },
      ]}
      actions={
        <>
          {app.githubUrl ? (
            <Button
              render={
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              View on GitHub
            </Button>
          ) : null}
          {app.url ? (
            <Button
              render={
                <a href={app.url} target="_blank" rel="noopener noreferrer" />
              }
            >
              View App
            </Button>
          ) : null}
        </>
      }
      description={app.description}
      image={app.image ? { alt: app.title, src: app.image } : undefined}
      title={app.title}
    >
      <>
        <StructuredData data={generateAppSchema(app)} />
        <PageSection>
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              {app.stack.map((tag, index) => (
                <TagButton
                  key={index}
                  tag={tag}
                  count={app.stack.filter((item) => item === tag).length}
                  render={<Link href={URLS.APPS_STACK(tag)} />}
                />
              ))}
            </div>
            {app.date ? (
              <TypographyParagraph color="muted">
                {formatDateShort(app.date)}
              </TypographyParagraph>
            ) : null}
            {app.coAuthors && app.coAuthors.length > 0 ? (
              <TypographyParagraph color="muted">
                {PROFILE_NAME}, {app.coAuthors.join(", ")}
              </TypographyParagraph>
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
  const appData = await getAppBySlugContent(slug);

  if (!appData) {
    return createNotFoundMetadata("App");
  }

  const { meta: app } = appData;

  const metadata = createPageMetadata({
    title: `${app.title}`,
    description: app.description,
    url: URLS.APPS(app.slug),
    image: app.ogImage,
  });

  return metadata;
}
