import matter from "gray-matter";

import {
  getContentByObjectKey,
  getEducationManifest,
} from "@/components/helpers/content-source";
import {
  generatePlaceholderImageUrl,
  PLACEHOLDER_COLORS,
} from "@/components/helpers/image";
import { Education } from "@/types/education";

export type EducationIndexItem = Education;

function normalizeEducation(
  education: Awaited<ReturnType<typeof getEducationManifest>>["items"][number],
): EducationIndexItem {
  return {
    slug: education.slug,
    degree: education.degree ?? "",
    school: education.school ?? "",
    startDate: education.startDate ?? "",
    endDate: education.endDate ?? undefined,
    image:
      education.image ||
      generatePlaceholderImageUrl({
        text: education.school ?? "",
        backgroundColor: PLACEHOLDER_COLORS.GRAY,
        textColor: PLACEHOLDER_COLORS.WHITE,
      }),
    ogImage: education.ogImage ?? undefined,
    year: education.year,
  };
}

export async function getAllEducationSlugs(): Promise<EducationIndexItem[]> {
  const manifest = await getEducationManifest();
  return manifest.items.map(normalizeEducation);
}

export async function getEducationBySlugContent(
  slug: string,
): Promise<{ meta: EducationIndexItem; content: string } | null> {
  const manifest = await getEducationManifest();
  const match = manifest.items.find((education) => education.slug === slug);

  if (!match) {
    return null;
  }

  const rawSource = await getContentByObjectKey(match.objectKey);

  if (!rawSource) {
    return null;
  }

  const { content } = matter(rawSource);

  return {
    meta: normalizeEducation(match),
    content,
  };
}
