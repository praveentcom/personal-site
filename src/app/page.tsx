import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/web-design-system/buttons/button";
import { Markdown } from "@workspace/web-design-system/typography/markdown";
import { PageSection } from "@workspace/web-design-system/layouts/page";
import { HeaderSection } from "@workspace/web-page-sections/header-section";
import { MarketingPage, HomepageHero } from "@workspace/web-page-sections/page";

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
    <MarketingPage
      structuredData={defaultSchema}
      hero={
        <HomepageHero
          eyebrow={{
            label: "Software developer and independent builder",
          }}
          title="Praveen Thirumurugan"
          description={SITE_DESCRIPTION}
          actions={
            <>
              <Button render={<Link href={URLS.ARTICLES_LIST()} />}>
                Read the articles
              </Button>
              <Button
                variant="secondary"
                render={<Link href={URLS.APPS_LIST()} />}
              >
                Browse the apps
              </Button>
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
        />
      }
    >
      <PageSection>
        <section className="grid gap-6">
          <HeaderSection
            label="About"
            title="Build useful software, then share the decisions behind it"
            description="My work sits at the intersection of developer tools, independent products, infrastructure, and practical AI-assisted engineering."
            action={
              <Button variant="secondary" render={<Link href={URLS.ABOUT()} />}>
                More about me
              </Button>
            }
          />
          <div className="max-w-3xl">
            <Markdown content={profileContent ?? ""} />
          </div>
        </section>
      </PageSection>

      {apps.length > 0 ? (
        <PageSection>
          <AppsSection apps={apps} />
        </PageSection>
      ) : null}

      <PageSection>
        <ArticleSection articles={recentArticles} />
      </PageSection>
    </MarketingPage>
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
