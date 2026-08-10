import {
  getCommunityManifest,
  getContentByObjectKey,
  getProfileManifest,
} from "@/components/helpers/content-source";

export async function getMdContent(filePath: string): Promise<string | null> {
  const normalizedPath = filePath.replace(/\.md$/, ".mdx");

  if (normalizedPath.startsWith("profile/")) {
    const profileName = normalizedPath.split("/")[1]?.replace(/\.mdx$/, "");
    const manifest = await getProfileManifest();
    const match = manifest.items.find((item) => item.name === profileName);
    return match ? getContentByObjectKey(match.objectKey) : null;
  }

  if (normalizedPath === "community/intro.mdx") {
    const manifest = await getCommunityManifest();
    return manifest.intro
      ? getContentByObjectKey(manifest.intro.objectKey)
      : null;
  }

  return getContentByObjectKey(normalizedPath);
}
