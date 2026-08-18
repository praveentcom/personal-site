import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import pluralize from "pluralize";

import { CommunitySummaryCard } from "@/components/community/community-summary-card";
import { getAllCommunityIndex } from "@/components/helpers/community";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { URLS } from "@/components/helpers/urls";
import { EnumCommunityContributionType } from "@/types/community";
import { TypographyHeading } from "@workspace/web-design-system/components/typography";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

function isValidType(
  value: string,
): value is `${EnumCommunityContributionType}` {
  return Object.values(EnumCommunityContributionType).includes(
    value as EnumCommunityContributionType,
  );
}

function getTypeLabel(value: EnumCommunityContributionType) {
  switch (value) {
    case EnumCommunityContributionType.TALK_SESSION:
      return "Talk sessions";
    case EnumCommunityContributionType.WORKSHOP:
      return "Workshops";
    case EnumCommunityContributionType.ONLINE_COURSE:
      return "Online courses";
  }
}

export function generateStaticParams() {
  return Object.values(EnumCommunityContributionType).map((type) => ({
    type,
  }));
}

export default async function CommunityByTypePage({ params }: PageProps) {
  const { type } = await params;
  if (!isValidType(type)) {
    notFound();
  }

  const validatedType = type as EnumCommunityContributionType;
  const contributions = (await getAllCommunityIndex()).filter(
    (c) => c.type === validatedType,
  );

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.COMMUNITY_LIST(), label: "Community" },
      ]}
      title={getTypeLabel(validatedType)}
    >
      {
        <>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${getTypeLabel(validatedType)}`,
              description: `${contributions.length} ${pluralize("contribution", contributions.length)}`,
            }}
          />
          <PageSection>
            <TypographyHeading level={3}>
              {getTypeLabel(validatedType)}
            </TypographyHeading>
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
  const { type } = await params;
  if (!isValidType(type)) {
    return createNotFoundMetadata("Community");
  }

  const validatedType = type as EnumCommunityContributionType;
  const typeLabel = getTypeLabel(validatedType);

  const metadata = createPageMetadata({
    title: `${typeLabel}`,
    description: `All ${typeLabel.toLowerCase()} contributions.`,
    keywords: [typeLabel.toLowerCase(), "community"],
    url: `${URLS.COMMUNITY_TYPE(type)}`,
  });

  return metadata;
}
