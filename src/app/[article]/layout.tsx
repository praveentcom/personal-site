import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { getArticleSlug } from "@/components/helpers/config";

interface ArticleCollectionLayoutProps {
  children: ReactNode;
  params: Promise<{ article: string }>;
}

export default async function ArticleCollectionLayout({
  children,
  params,
}: ArticleCollectionLayoutProps) {
  const { article } = await params;

  if (article !== getArticleSlug()) {
    notFound();
  }

  return children;
}
