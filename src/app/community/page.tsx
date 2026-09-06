import { TitleSection } from "@avgeek-inc/ds-web-sections/title-section";

import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";

import { YearButtonLink } from "@/components/common/year-button";
import { CommunitySummaryCard } from "@/components/community/community-summary-card";
import { getAllCommunitySlugs } from "@/components/helpers/community";
import { getContentComponent } from "@/lib/mdx";
import { createPageMetadata } from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";

import { TypographyHeading } from "@avgeek-inc/ds-web/typography/typography";

export default async function CommunityPage() {
  const [publishedContributions, Content] = await Promise.all([
    getAllCommunitySlugs(),
    getContentComponent("profile", "community"),
  ]);

  return (
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[{ href: URLS.HOME(), label: "Home" }]}
        title={"Community"}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Community Contributions`,
          description: configData.seo.description || "",
        }}
      />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <Content />
      </section>
      {publishedContributions.length > 0 &&
        Array.from(new Set(publishedContributions.map((c) => c.year))).length >
          1 && (
          <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
            <div className="flex-col-4" aria-label="Browse by year">
              <TypographyHeading level={4}>Browse by year</TypographyHeading>
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from(
                  new Set(publishedContributions.map((c) => c.year)),
                ).map((year) => (
                  <YearButtonLink
                    key={`${year}-community`}
                    year={year}
                    href={URLS.COMMUNITY_YEAR(year)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      {publishedContributions.length > 0 && (
        <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
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
        </section>
      )}
    </>
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
