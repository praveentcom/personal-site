import { StructuredData } from "@/components/structured-data";
import Image from "next/image";
import type { Metadata } from "next";
import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { getAllArticlesIndex } from "@/components/helpers/article";
import { SITE_DESCRIPTION, SITE_IMAGE } from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";

export default async function HomePage() {
  const [articles, schema] = await Promise.all([
    getAllArticlesIndex(),
    generateDefaultSchema(),
  ]);
  return (
    <>
      <StructuredData data={schema} />
      <section className="home-intro">
        <div className="home-avatar">
          <Image
            src="/images/logos/praveen-portrait.png"
            alt="Praveen Thirumurugan"
            width={48}
            height={48}
            draggable={false}
          />
        </div>
        <h1 className="home-title">Praveen Thirumurugan</h1>
        <p>
          I build software and write about what I learn. This is a place for my
          thoughts and things I’ve made.
        </p>
      </section>
      {articles.length > 0 && (
        <section
          className="home-section"
          id="writing"
          aria-labelledby="writing-heading"
        >
          <h2 className="section-title" id="writing-heading">
            Writings
          </h2>
          <div className="article-list">
            {articles.map((article) => (
              <ArticleSummaryCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    description: SITE_DESCRIPTION,
    keywords: configData.seo.keywords,
    url: URLS.HOME(),
    image: SITE_IMAGE,
  });
}
