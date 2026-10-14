import { Link } from "@avgeek/ds-web/base/link";
import { Typography } from "@avgeek/ds-web/base/typography";
import { typographyVariants } from "@heroui/styles";
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
import { creations } from "@/data/creations";

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
          {(["light", "dark"] as const).map((theme) => (
            <Image
              key={theme}
              src={
                theme === "dark"
                  ? "/images/logos/praveen-avatar-dark-v3.png"
                  : "/images/logos/praveen-avatar-light-v2.png"
              }
              alt=""
              width={48}
              height={48}
              draggable={false}
              className={`avatar-${theme}`}
            />
          ))}
        </div>
        <Typography.Heading
          level={1}
          className={typographyVariants({ type: "h3" }).base()}
        >
          Praveen Thirumurugan
        </Typography.Heading>
        <Typography.Paragraph>
          I build software and write about what I learn. This is a place for my
          thoughts and things I’ve made.
        </Typography.Paragraph>
      </section>
      {articles.length > 0 && (
        <section
          className="home-section"
          id="writing"
          aria-labelledby="writing-heading"
        >
          <Typography.Heading
            level={2}
            className={typographyVariants({ type: "h5" }).base()}
            id="writing-heading"
          >
            Writings
          </Typography.Heading>
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
        <Typography.Heading
          level={2}
          className={typographyVariants({ type: "h5" }).base()}
          id="creations-heading"
        >
          Creations
        </Typography.Heading>
        <ul className="creations-list">
          {creations.map((creation) => (
            <li key={creation.url}>
              <Link href={creation.url} className="creation-link">
                {creation.logo && (
                  <Image
                    src={creation.logo}
                    alt=""
                    width={28}
                    height={28}
                    className="creation-logo"
                  />
                )}
                <span className="creation-name">{creation.name}</span>
                <span aria-hidden="true" className="external-mark">
                  ↗
                </span>
              </Link>
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
