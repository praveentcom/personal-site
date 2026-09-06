import { cache } from "react";
import { EducationSchema } from "@/types/education";
import { readEntries, contentYear } from "@/lib/content";
import { getContentComponent } from "@/lib/mdx";

const getEntries = cache(async () =>
  (await readEntries("education", EducationSchema))
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

export async function getAllEducationSlugs() {
  return (await getEntries()).map((entry) => entry.meta);
}
export type EducationIndexItem = Awaited<
  ReturnType<typeof getAllEducationSlugs>
>[number];
export async function getEducationBySlugContent(slug: string) {
  const entry = (await getEntries()).find((entry) => entry.meta.slug === slug);
  return entry
    ? { ...entry, Content: await getContentComponent("education", slug) }
    : null;
}
