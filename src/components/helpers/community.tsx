import { getContentComponent } from "@/lib/mdx";
import { cache } from "react";
import { CommunitySchema } from "@/types/community";
import { readEntries, isPublished, contentYear } from "@/lib/content";

const getEntries = cache(async () =>
  (await readEntries("community", CommunitySchema))
    .filter((entry) => isPublished(entry.meta))
    .map(({ meta, slug, content }) => ({
      meta: {
        ...meta,
        slug,
        year: contentYear(meta.date),
        image: meta.image ?? "/og-image.png",
      },
      raw: content,
    }))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date)),
);
export async function getAllCommunitySlugs() {
  return (await getEntries()).map((entry) => entry.meta);
}
export type CommunityIndexItem = Awaited<
  ReturnType<typeof getAllCommunitySlugs>
>[number];
export async function getAllCommunityIndex(limit?: number) {
  const entries = await getAllCommunitySlugs();
  return limit === undefined ? entries : entries.slice(0, limit);
}
export async function getCommunityBySlugRaw(slug: string) {
  const entry = (await getEntries()).find((entry) => entry.meta.slug === slug);
  return entry
    ? { ...entry, Content: await getContentComponent("community", slug) }
    : null;
}
