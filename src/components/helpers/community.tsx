import matter from "gray-matter";

import {
  getCommunityManifest,
  getContentByObjectKey,
} from "@/components/helpers/content-source";
import {
  generatePlaceholderImageUrl,
  PLACEHOLDER_COLORS,
} from "@/components/helpers/image";
import { type CommunityFrontmatter } from "@/types/community";

export type CommunityIndexItem = CommunityFrontmatter;

function normalizeCommunity(
  contribution: Awaited<
    ReturnType<typeof getCommunityManifest>
  >["items"][number],
): CommunityIndexItem {
  return {
    title: contribution.title ?? "",
    description: contribution.description ?? "",
    date: contribution.date ?? "",
    published: contribution.published ?? true,
    image:
      contribution.image ||
      generatePlaceholderImageUrl({
        text: contribution.title ?? "",
        backgroundColor: PLACEHOLDER_COLORS.GRAY,
        textColor: PLACEHOLDER_COLORS.WHITE,
      }),
    ogImage: contribution.ogImage ?? undefined,
    slug: contribution.slug,
    year: contribution.year,
    youtubeUrl: contribution.youtubeUrl ?? undefined,
    externalLinks: contribution.externalLinks ?? [],
    type: contribution.type as CommunityFrontmatter["type"],
    event: contribution.event ?? undefined,
  };
}

export async function getAllCommunitySlugs(): Promise<CommunityIndexItem[]> {
  const manifest = await getCommunityManifest();

  return manifest.items
    .map(normalizeCommunity)
    .filter((contribution) => contribution.published);
}

export async function getAllCommunityIndex(
  limit?: number,
): Promise<CommunityIndexItem[]> {
  const items = await getAllCommunitySlugs();
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getCommunityBySlugRaw(
  slug: string,
): Promise<{ meta: CommunityIndexItem; raw: string } | null> {
  const manifest = await getCommunityManifest();
  const match = manifest.items.find(
    (contribution) => contribution.slug === slug,
  );

  if (!match) {
    return null;
  }

  const rawSource = await getContentByObjectKey(match.objectKey);

  if (!rawSource) {
    return null;
  }

  const { content } = matter(rawSource);

  return {
    meta: normalizeCommunity(match),
    raw: content,
  };
}
