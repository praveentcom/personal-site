import { getAllArticlesIndex } from "@/components/helpers/article";
import {
  PROFILE_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/components/helpers/config";
import { BASE_URL, URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { profile } from "@/data/profile";

export function buildRSSFeedUrl(): string {
  return `${BASE_URL}${URLS.RSS_FEED()}`;
}

export function buildArticleRSSUrl(slug: string): string {
  return `${BASE_URL}${URLS.ARTICLES(slug)}`;
}

export function getRSSFeedMetadata() {
  return {
    url: buildRSSFeedUrl(),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    link: `${BASE_URL}${URLS.ARTICLES_LIST()}`,
    language: "en-us",
    managingEditor: profile.email || "",
    webMaster: profile.email || "",
    generator: "Praveen Website",
    categories: [
      "articles",
      "blog",
      "development",
      "technology",
      "programming",
      "tutorials",
    ],
    copyright: `Copyright ${new Date().getFullYear()} ${PROFILE_NAME}. All rights reserved.`,
    image: {
      url: configData.seo.image || profile.image || "",
      title: SITE_TITLE,
      link: `${BASE_URL}${URLS.ARTICLES_LIST()}`,
      width: 144,
      height: 144,
    },
  };
}

export async function getArticlesForRSS(limit: number = 20) {
  const articles = await getAllArticlesIndex();

  return articles
    .filter((article) => article.published !== false)
    .slice(0, limit)
    .map((article) => {
      return {
        ...article,
        url: buildArticleRSSUrl(article.slug),
        pubDate: new Date(article.date).toUTCString(),
        author: `${profile.email || ""} (${PROFILE_NAME})`,
      };
    });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapCdata(value: string) {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export async function generateRSSFeed(): Promise<string> {
  const articles = await getArticlesForRSS(20);
  const metadata = getRSSFeedMetadata();
  const rssItems = articles
    .map((article) => {
      const categories =
        article.categories
          ?.map((category) => `<category>${wrapCdata(category)}</category>`)
          .join("\n      ") ?? "";

      return `
    <item>
      <title>${wrapCdata(article.title)}</title>
      <description>${wrapCdata(article.description)}</description>
      <link>${escapeXml(article.url)}</link>
      <guid isPermaLink="true">${escapeXml(article.url)}</guid>
      <pubDate>${escapeXml(article.pubDate)}</pubDate>
      <author>${escapeXml(article.author)}</author>
      ${categories}
    </item>`;
    })
    .join("");
  const lastBuildDate = articles[0]?.pubDate ?? new Date().toUTCString();
  const categories =
    metadata.categories
      ?.map((category) => `<category>${wrapCdata(category)}</category>`)
      .join("\n      ") ?? "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${wrapCdata(metadata.title)}</title>
    <description>${wrapCdata(metadata.description)}</description>
    <link>${escapeXml(metadata.link)}</link>
    <atom:link href="${escapeXml(metadata.url)}" rel="self" type="application/rss+xml"/>
    <language>${escapeXml(metadata.language)}</language>
    <copyright>${wrapCdata(metadata.copyright)}</copyright>
    <managingEditor>${escapeXml(metadata.managingEditor)} (${escapeXml(PROFILE_NAME)})</managingEditor>
    <webMaster>${escapeXml(metadata.webMaster)} (${escapeXml(PROFILE_NAME)})</webMaster>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <generator>${escapeXml(metadata.generator)}</generator>
    <image>
      <url>${escapeXml(metadata.image.url)}</url>
      <title>${wrapCdata(metadata.image.title)}</title>
      <link>${escapeXml(metadata.image.link)}</link>
      <width>${metadata.image.width}</width>
      <height>${metadata.image.height}</height>
    </image>
    ${categories}
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`.trim();
}

export async function createRSSResponse() {
  try {
    const feed = await generateRSSFeed();

    return new Response(feed, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    });
  } catch {
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
