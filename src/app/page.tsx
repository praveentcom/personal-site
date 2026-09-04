import { StructuredData } from "@avgeek-inc/ds-web/utilities/structured-data";
import { HeroSection } from "@workspace/web-page-sections/hero-section";
import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@avgeek-inc/ds-web/buttons/button";
import { Markdown } from "@avgeek-inc/ds-web/typography/markdown";

import { HeaderSection } from "@workspace/web-page-sections/header-section";

import { AppsSection } from "@/components/apps/apps-section";
import { ArticleSection } from "@/components/article/article-section";
import { getAllAppSlugs } from "@/components/helpers/apps";
import { getAllArticlesIndex } from "@/components/helpers/article";
import { SITE_DESCRIPTION, SITE_IMAGE } from "@/components/helpers/config";
import { getMdContent } from "@/components/helpers/md-content";
import { createPageMetadata } from "@/components/helpers/metadata";
import { generateDefaultSchema } from "@/components/helpers/structured-data";
import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";

export default async function HomePage() {
  const [recentArticles, apps, profileContent, defaultSchema] =
    await Promise.all([
      getAllArticlesIndex(20),
      getAllAppSlugs(),
      getMdContent("profile/intro.md"),
      generateDefaultSchema(),
    ]);

  return (
    <>
      <HeroSection
        eyebrow={{
          label: "Software developer and independent builder",
        }}
        title="Praveen Thirumurugan"
        description={SITE_DESCRIPTION}
        actions={
          <>
            <ButtonLink href={URLS.ARTICLES_LIST()}>
              Read the articles
            </ButtonLink>
            <ButtonLink variant="secondary" href={URLS.APPS_LIST()}>
              Browse the apps
            </ButtonLink>
          </>
        }
        media={
          <Image
            src="/og-image.png"
            alt="Praveen Thirumurugan, software developer and indie builder"
            width={1200}
            height={630}
            priority
          />
        }
        prominence="homepage"
      ></HeroSection>
      <section className="grid gap-6 px-5 sm:px-6 py-10">
        <section className="grid gap-6">
          <HeaderSection
            label="About"
            title="Build useful software, then share the decisions behind it"
            description="My work sits at the intersection of developer tools, independent products, infrastructure, and practical AI-assisted engineering."
            action={
              <ButtonLink variant="secondary" href={URLS.ABOUT()}>
                More about me
              </ButtonLink>
            }
          />
          <div className="max-w-3xl">
            <Markdown content={profileContent ?? ""} />
          </div>
        </section>
      </section>
      {apps.length > 0 ? (
        <section className="grid gap-6 px-5 sm:px-6 py-10">
          <AppsSection apps={apps} />
        </section>
      ) : null}
      <section className="grid gap-6 px-5 sm:px-6 py-10">
        <ArticleSection articles={recentArticles} />
      </section>
      {[defaultSchema].flat().map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}
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
