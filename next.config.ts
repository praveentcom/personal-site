import createMDX from "@next/mdx";
import { withSentry } from "@avgeek-inc/observability/next-config";
import { createNextConfig } from "@avgeek-inc/runtime-web/next-config";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

export default withSentry(
  createNextConfig((config) => withMDX(config), {
    transpilePackages: ["@avgeek-inc/ds-web-sections"],
  }),
  { project: "praveen-website" },
);
