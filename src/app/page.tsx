import { StructuredData } from "@/components/structured-data";
import Image from "next/image";
import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { getAllArticlesIndex } from "@/components/helpers/article";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { site } from "@/lib/site";

export default async function HomePage() {
  const articles = await getAllArticlesIndex();
  return (
    <>
      <StructuredData data={generateDefaultSchema()} />
      <section className="home-intro">
        <div className="home-avatar">
          <Image
            src={site.avatar}
            alt={site.name}
            width={48}
            height={48}
            draggable={false}
          />
        </div>
        <h1 className="home-title">{site.name}</h1>
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
