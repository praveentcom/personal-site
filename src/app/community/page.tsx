import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { YearButton } from "@/components/common/year-button";
import { CommunitySummaryCard } from "@/components/community/community-summary-card";
import { getAllCommunitySlugs } from "@/components/helpers/community";
import { getMdContent } from "@/components/helpers/md-content";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { Markdown } from "@workspace/web-design-system/components/markdown";
import { TypographyHeading } from "@workspace/web-design-system/components/typography";

export default async function CommunityPage() {
  const [publishedContributions, communityContent] = await Promise.all([
    getAllCommunitySlugs(),
    getMdContent("community/intro.md"),
  ]);

  return (
    <ContentPage
      breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
      title={"Community"}
    >
      {
        <>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `Community Contributions`,
              description: configData.seo.description || "",
            }}
          />
          <PageSection>
            <Markdown content={communityContent ?? ""} />
          </PageSection>
          {publishedContributions.length > 0 &&
            Array.from(new Set(publishedContributions.map((c) => c.year)))
              .length > 1 && (
              <PageSection>
                <div className="flex-col-4" aria-label="Browse by year">
                  <TypographyHeading level={4}>
                    Browse by year
                  </TypographyHeading>
                  <div className="flex items-center gap-2 flex-wrap">
                    {Array.from(
                      new Set(publishedContributions.map((c) => c.year)),
                    ).map((year) => (
                      <YearButton
                        key={`${year}-community`}
                        year={year}
                        render={<Link href={URLS.COMMUNITY_YEAR(year)} />}
                      />
                    ))}
                  </div>
                </div>
              </PageSection>
            )}
          {publishedContributions.length > 0 && (
            <PageSection>
              <div className="flex-col-4" aria-label="Community contributions">
                <div className="flex items-center gap-2">
                  <TypographyHeading level={4}>Contributions</TypographyHeading>
                </div>
                <div className="flex-col-4">
                  {publishedContributions.map((community) => (
                    <CommunitySummaryCard
                      key={`${community.year}-${community.slug}`}
                      contribution={community}
                    />
                  ))}
                </div>
              </div>
            </PageSection>
          )}
        </>
      }
    </ContentPage>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    title: `Community`,
    description: configData.seo.description || "",
    keywords: [
      "community",
      "talks",
      "presentations",
      "conferences",
      "workshops",
      "speaking",
      "developer community",
    ],
    url: URLS.COMMUNITY_LIST(),
  });

  return metadata;
}
