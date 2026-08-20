import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { Grid } from "@workspace/web-design-system/layout/grid";
import pluralize from "pluralize";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { createPageMetadata } from "@/components/helpers/metadata";
import { getAllAppSlugs } from "@/components/helpers/apps";
import { getTagImagePath } from "@/components/helpers/tag-mapper";
import { URLS } from "@/components/helpers/urls";
import { AppSummaryCard } from "@/components/apps/app-summary-card";
import { TypographyHeading } from "@workspace/web-design-system/typography/typography";

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const apps = await getAllAppSlugs();
  const tags = Array.from(new Set(apps.flatMap((app) => app.stack)));

  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;

  const apps = await getAllAppSlugs();

  const filteredApps = apps.filter((app) => app.stack.includes(tag));

  const metadata = createPageMetadata({
    title: `${tag} apps`,
    description: `${filteredApps.length} ${pluralize("app", filteredApps.length)} using ${tag}`,
    keywords: [tag, "apps"],
    url: URLS.APPS_STACK(tag),
  });

  return metadata;
}

export default async function TagAppsPage({ params }: PageProps) {
  const { tag } = await params;

  const apps = await getAllAppSlugs();

  const filteredApps = apps.filter((app) => app.stack.includes(tag));

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.APPS_LIST(), label: "Apps" },
      ]}
      title={`${tag} apps`}
    >
      <>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${tag} apps`,
            description: `${filteredApps.length} ${pluralize("app", filteredApps.length)} using ${tag}`,
          }}
        />
        <PageSection>
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={getTagImagePath(tag)}
              alt={`${tag} icon`}
              width={20}
              height={20}
              className="shrink-0 size-6"
            />
            <TypographyHeading level={3}>{tag} apps</TypographyHeading>
          </div>
        </PageSection>
        <PageSection yPadding="none">
          <Grid columns={[1, 2, 2]}>
            {filteredApps.map((app) => (
              <AppSummaryCard key={app.slug} app={app} />
            ))}
          </Grid>
        </PageSection>
      </>
    </ContentPage>
  );
}
