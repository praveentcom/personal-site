import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { ArticleSchema } from "@/types/article";

const root = path.join(process.cwd(), "content", "blog");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function readBlogEntries() {
  const folders = await readdir(root, {
    withFileTypes: true,
  });
  return Promise.all(
    folders
      .filter((folder) => folder.isDirectory())
      .map(async (folder) => {
        const slug = folder.name;
        if (!slugPattern.test(slug))
          throw new Error(`Invalid content slug: blog/${slug}`);
        const source = await readFile(
          path.join(root, slug, "index.mdx"),
          "utf8",
        );
        const { data, content } = matter(source);
        const meta = ArticleSchema.parse(data);
        return { meta, slug, content };
      }),
  );
}

export function isPublished(meta: { published?: boolean; private?: boolean }) {
  return meta.published !== false && meta.private !== true;
}
