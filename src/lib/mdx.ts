import type { MDXContent } from "mdx/types";
import type { Collection } from "./content";

export async function getContentComponent(
  collection: Collection,
  slug: string,
): Promise<MDXContent> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error("Invalid content slug");
  // Webpack resolves this bounded context to checked-in MDX modules at build time.
  return (await import(`../../content/${collection}/${slug}/index.mdx`))
    .default;
}
