import { ContentPage } from "@workspace/web-page-sections/page";
import type { Metadata } from "next";
import { StructuredData } from "@workspace/web-design-system/components/structured-data";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { plural } from "pluralize";

import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { getAllArticlesIndex, getAllTags } from "@/components/helpers/article";
import { getArticleLabel, getArticleSlug } from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { getTagImagePath } from "@/components/helpers/tag-mapper";
import { URLS } from "@/components/helpers/urls";

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

const articleLabel = plural(getArticleLabel());

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({ article: getArticleSlug(), tag }));
}

export default async function TagArticlePage({ params }: PageProps) {
  const { tag: decodedTag } = await params;
  const tag = decodeURIComponent(decodedTag);

  const filteredArticles = (await getAllArticlesIndex()).filter((article) =>
    article.tags.includes(tag),
  );

  return (
    <ContentPage
      breadcrumbAncestors={[
        { href: URLS.HOME(), label: "Home" },
        { href: URLS.ARTICLES_LIST(), label: articleLabel },
      ]}
      title={`${tag} ${articleLabel}`}
    >
      {
        <>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${tag} ${articleLabel}`,
              description: `${filteredArticles.length} ${articleLabel.toLowerCase()} tagged with ${tag}.`,
            }}
          />
          <PageSection>
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={getTagImagePath(tag)}
                alt={`${tag} icon`}
                width={20}
                height={20}
                className="shrink-0 size-6"
              />
              <h3>
                {tag} {articleLabel}
              </h3>
            </div>
            <div className="flex-col-4">
              {filteredArticles.map((article, index) => (
                <ArticleSummaryCard key={index} article={article} />
              ))}
            </div>
          </PageSection>
        </>
      }
    </ContentPage>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag: decodedTag } = await params;
  const tag = decodeURIComponent(decodedTag);

  const filteredArticles = (await getAllArticlesIndex()).filter((article) =>
    article.tags.includes(tag),
  );

  const metadata = createPageMetadata({
    title: `${tag} ${articleLabel}`,
    description: `${filteredArticles.length} ${articleLabel} tagged with ${tag}.`,
    keywords: [
      tag,
      articleLabel,
      "articles",
      "blog",
      "development",
      "technology",
      "programming",
      "tutorials",
    ],
    url: URLS.ARTICLES_TAG(tag),
  });

  return metadata;
}
