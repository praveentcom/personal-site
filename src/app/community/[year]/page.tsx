import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/utilities/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import pluralize from "pluralize";

import { CommunitySummaryCard } from "@/components/community/community-summary-card";
import {
  getAllCommunityIndex,
  getAllCommunitySlugs,
} from "@/components/helpers/community";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import {
  TypographyHeading,
  TypographyParagraph,
} from "@workspace/web-design-system/typography/typography";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

export async function generateStaticParams() {
  const contributions = await getAllCommunitySlugs();
  const years = Array.from(
    new Set(contributions.map((contribution) => contribution.year)),
  );

  return years.map((year) => ({ year }));
}

export default async function CommunityByYearPage({ params }: PageProps) {
  const { year } = await params;
  const contributions = (await getAllCommunityIndex()).filter(
    (c) => c.year === year,
  );

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.COMMUNITY_LIST(), label: "Community" },
      ]}
      title={`${year} contributions`}
    >
      {
        <>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `Contributions from ${year}`,
              description: `${contributions.length} contributions in ${year}.`,
            }}
          />
          <PageSection>
            <div>
              <TypographyHeading level={2}>
                Contributions from {year}
              </TypographyHeading>
              <TypographyParagraph color="muted">
                {contributions.length}{" "}
                {pluralize("contribution", contributions.length)}
              </TypographyParagraph>
            </div>
            <div className="flex-col-4">
              {contributions.map((community) => (
                <CommunitySummaryCard
                  key={`${community.year}-${community.slug}`}
                  contribution={community}
                />
              ))}
            </div>
          </PageSection>
        </>
      }
    </ContentPage>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { year } = await params;
  const count = (await getAllCommunityIndex()).filter(
    (c) => c.year === year,
  ).length;

  const metadata = createPageMetadata({
    title: `Contributions from ${year}`,
    description: `${count} contributions in ${year}.`,
    keywords: ["community", year],
    url: `${URLS.COMMUNITY_YEAR(year)}`,
  });

  return metadata;
}
