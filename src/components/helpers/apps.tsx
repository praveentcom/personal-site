import matter from "gray-matter";

import {
  getAppManifest,
  getContentByObjectKey,
} from "@/components/helpers/content-source";
import {
  generatePlaceholderImageUrl,
  PLACEHOLDER_COLORS,
} from "@/components/helpers/image";
import { App } from "@/types/app";

export type AppIndexItem = App;

function normalizeApp(
  app: Awaited<ReturnType<typeof getAppManifest>>["items"][number],
): AppIndexItem {
  return {
    slug: app.slug,
    title: app.title ?? "",
    description: app.description ?? "",
    shortDescription: app.shortDescription ?? undefined,
    image:
      app.image ||
      generatePlaceholderImageUrl({
        text: app.title ?? "",
        backgroundColor: PLACEHOLDER_COLORS.GRAY,
        textColor: PLACEHOLDER_COLORS.WHITE,
      }),
    stack: app.stack ?? [],
    url: app.url ?? undefined,
    githubUrl: app.githubUrl ?? undefined,
    appStoreUrl: app.appStoreUrl ?? undefined,
    coAuthors: app.coAuthors ?? [],
    date: app.date ?? "",
    ogImage: app.ogImage ?? undefined,
    year: app.year,
  };
}

export async function getAllAppSlugs(): Promise<AppIndexItem[]> {
  const manifest = await getAppManifest();
  return manifest.items.map(normalizeApp);
}

export async function getAppBySlugContent(
  slug: string,
): Promise<{ meta: AppIndexItem; content: string } | null> {
  const manifest = await getAppManifest();
  const match = manifest.items.find((app) => app.slug === slug);

  if (!match) {
    return null;
  }

  const rawSource = await getContentByObjectKey(match.objectKey);

  if (!rawSource) {
    return null;
  }

  const { content } = matter(rawSource);

  return {
    meta: normalizeApp(match),
    content,
  };
}
