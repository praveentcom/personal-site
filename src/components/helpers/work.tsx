import matter from "gray-matter";

import {
  getContentByObjectKey,
  getWorkManifest,
} from "@/components/helpers/content-source";
import {
  generatePlaceholderImageUrl,
  PLACEHOLDER_COLORS,
} from "@/components/helpers/image";
import { WorkExperience } from "@/types/work";

export type WorkExperienceIndexItem = WorkExperience;

function normalizeWork(
  work: Awaited<ReturnType<typeof getWorkManifest>>["items"][number],
): WorkExperienceIndexItem {
  return {
    slug: work.slug,
    role: work.role ?? "",
    company: work.company ?? "",
    startDate: work.startDate ?? "",
    endDate: work.endDate ?? undefined,
    skills: work.skills ?? [],
    image:
      work.image ||
      generatePlaceholderImageUrl({
        text: work.company ?? "",
        backgroundColor: PLACEHOLDER_COLORS.GRAY,
        textColor: PLACEHOLDER_COLORS.WHITE,
      }),
    ogImage: work.ogImage ?? undefined,
    year: work.year,
  };
}

export async function getAllWorkSlugs(): Promise<WorkExperienceIndexItem[]> {
  const manifest = await getWorkManifest();
  return manifest.items.map(normalizeWork);
}

export async function getWorkBySlugContent(
  slug: string,
): Promise<{ meta: WorkExperienceIndexItem; content: string } | null> {
  const manifest = await getWorkManifest();
  const match = manifest.items.find((work) => work.slug === slug);

  if (!match) {
    return null;
  }

  const rawSource = await getContentByObjectKey(match.objectKey);

  if (!rawSource) {
    return null;
  }

  const { content } = matter(rawSource);

  return {
    meta: normalizeWork(match),
    content,
  };
}
