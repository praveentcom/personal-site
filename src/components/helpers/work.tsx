import { cache } from "react";
import { WorkExperienceSchema } from "@/types/work";
import { readEntries, contentYear } from "@/lib/content";
import { getContentComponent } from "@/lib/mdx";

const getEntries = cache(async () =>
  (await readEntries("work", WorkExperienceSchema))
    .map(({ meta, slug, content }) => ({
      meta: {
        ...meta,
        slug,
        year: contentYear(meta.startDate),
        image: meta.image ?? "/og-image.png",
      },
      content,
    }))
    .sort((a, b) => b.meta.startDate.localeCompare(a.meta.startDate)),
);

export async function getAllWorkSlugs() {
  return (await getEntries()).map((entry) => entry.meta);
}
export type WorkExperienceIndexItem = Awaited<
  ReturnType<typeof getAllWorkSlugs>
>[number];
export async function getWorkBySlugContent(slug: string) {
  const entry = (await getEntries()).find((entry) => entry.meta.slug === slug);
  return entry
    ? { ...entry, Content: await getContentComponent("work", slug) }
    : null;
}
