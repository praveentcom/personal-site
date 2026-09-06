import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export type Collection =
  | "blog"
  | "apps"
  | "community"
  | "education"
  | "work"
  | "profile";
const root = path.join(process.cwd(), "content");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function readEntries<T extends z.ZodType>(
  collection: Collection,
  schema: T,
) {
  const folders = await readdir(path.join(root, collection), {
    withFileTypes: true,
  });
  return Promise.all(
    folders
      .filter((folder) => folder.isDirectory())
      .map(async (folder) => {
        const slug = folder.name;
        if (!slugPattern.test(slug))
          throw new Error(`Invalid content slug: ${collection}/${slug}`);
        const source = await readFile(
          path.join(root, collection, slug, "index.mdx"),
          "utf8",
        );
        const { data, content } = matter(source);
        const meta = schema.parse({ ...data, slug });
        return { meta, slug, content };
      }),
  );
}

export function isPublished(meta: { published?: boolean; private?: boolean }) {
  return meta.published !== false && meta.private !== true;
}

export function contentYear(date: string) {
  z.iso.date().parse(date);
  return date.slice(0, 4);
}
