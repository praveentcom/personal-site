import { TitleSection } from "@workspace/web-page-sections/title-section";

import { Markdown } from "@avgeek-inc/ds-web/typography/markdown";
import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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
    <>
      <TitleSection
        titleLevel={1}
        breadcrumbAncestors={[
          { href: URLS.HOME(), label: "Home" },
          { href: URLS.COMMUNITY_LIST(), label: "Community" },
        ]}
        description={contribution.description}
        title={contribution.title}
      />
      <StructuredData
        data={generateCommunitySchema({
          ...contribution,
          content: rawCommunity.raw,
        })}
      />
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <CommunityTitleDetails contribution={contribution} />
      </section>
      <section className="grid gap-6 px-5 sm:px-6 py-5 sm:py-6">
        <Markdown content={rawCommunity.raw} />
      </section>
    </>
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
