import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Markdown } from "@workspace/web-design-system/components/markdown";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";

import { CommunityTitleDetails } from "@/components/community/community-header";
import {
  getAllCommunitySlugs,
  getCommunityBySlugRaw,
} from "@/components/helpers/community";
import {
  createNotFoundMetadata,
  createPageMetadata,
} from "@/components/helpers/metadata";
import { generateCommunitySchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";

interface PageProps {
  params: Promise<{
    year: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const contributions = await getAllCommunitySlugs();

  return contributions.map((contribution) => ({
    slug: contribution.slug,
    year: contribution.year,
  }));
}

export default async function CommunityContributionPage({ params }: PageProps) {
  const { slug, year } = await params;
  const rawCommunity = await getCommunityBySlugRaw(slug);

  if (!rawCommunity) {
    notFound();
  }

  const contribution = rawCommunity.meta;
  const contributionYear = contribution.year;

  if (contributionYear !== year) {
    redirect(`/community/${contributionYear}/${contribution.slug}`);
  }

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.COMMUNITY_LIST(), label: "Community" },
      ]}
      description={contribution.description}
      title={contribution.title}
    >
      <>
        <StructuredData
          data={generateCommunitySchema({
            ...contribution,
            content: rawCommunity.raw,
          })}
        />
        <PageSection>
          <CommunityTitleDetails contribution={contribution} />
        </PageSection>
        <PageSection>
          <Markdown content={rawCommunity.raw} />
        </PageSection>
      </>
    </ContentPage>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawCommunity = await getCommunityBySlugRaw(slug);

  if (!rawCommunity) {
    return createNotFoundMetadata("Community");
  }

  const community = rawCommunity.meta;
  const { year } = await params;

  const metadata = createPageMetadata({
    title: `${community.title}`,
    description: community.description,
    keywords: [community.title, "community", "contributions"],
    publishedTime: new Date(community.date).toISOString(),
    type: "article",
    url: URLS.COMMUNITY(year, community.slug),
    image: community.ogImage || community.image,
  });

  return metadata;
}
