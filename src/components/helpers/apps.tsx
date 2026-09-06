import { cache } from "react";
import { AppSchema } from "@/types/app";
import { readEntries, contentYear } from "@/lib/content";
import { getContentComponent } from "@/lib/mdx";

const getEntries = cache(async () =>
  (await readEntries("apps", AppSchema))
    .map(({ meta, slug, content }) => ({
      meta: {
        ...meta,
        slug,
        year: contentYear(meta.date),
        image: meta.image ?? "/og-image.png",
      },
      content,
    }))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date)),
);

export async function getAllAppSlugs() {
  return (await getEntries()).map((entry) => entry.meta);
}
export type AppIndexItem = Awaited<ReturnType<typeof getAllAppSlugs>>[number];
export async function getAppBySlugContent(slug: string) {
  const entry = (await getEntries()).find((entry) => entry.meta.slug === slug);
  return entry
    ? { ...entry, Content: await getContentComponent("apps", slug) }
    : null;
}
