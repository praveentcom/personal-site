import { StructuredData } from "@/components/structured-data";
import Image from "next/image";
import type { Metadata } from "next";
import { ArticleSummaryCard } from "@/components/article/article-summary-card";
import { getAllArticlesIndex } from "@/components/helpers/article";
import { SITE_DESCRIPTION, SITE_IMAGE } from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import {
  formatStars,
  getGitHubStars,
  githubRepoUrl,
} from "@/components/helpers/github";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { creations } from "@/data/creations";

export default async function HomePage() {
  const [articles, schema, creationsWithStars] = await Promise.all([
    getAllArticlesIndex(),
    generateDefaultSchema(),
    Promise.all(
      creations.map(async (creation) => ({
        ...creation,
        stars: await getGitHubStars(creation.repo),
      })),
    ),
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
      <section
        className="home-section home-creations"
        aria-labelledby="creations-heading"
      >
        <h2 className="section-title" id="creations-heading">
          Creations
        </h2>
        <ul className="creations-list">
          {creationsWithStars.map((creation) => (
            <li key={creation.url}>
              {creation.logo && (
                <Image
                  src={creation.logo}
                  alt=""
                  width={28}
                  height={28}
                  className="creation-logo"
                />
              )}
              <a href={creation.url} className="creation-link">
                {creation.name}
              </a>
              {creation.stars !== null && (
                <a
                  href={githubRepoUrl(creation.repo)}
                  className="creation-stars"
                  aria-label={`${creation.name} on GitHub, ${creation.stars} stars`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z" />
                  </svg>
                  {formatStars(creation.stars)}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
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
