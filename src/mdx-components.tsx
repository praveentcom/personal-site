import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

const components = {
  wrapper: ({ children }: { children: ReactNode }) => (
    <div className="article-prose">{children}</div>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
