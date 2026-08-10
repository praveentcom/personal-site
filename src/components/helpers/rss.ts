import { getAllArticlesIndex } from "@/components/helpers/article";
import {
  PROFILE_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/components/helpers/config";
import { BASE_URL, URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { profile } from "@/data/profile";

/**
 * Build the complete RSS feed URL for the site
 * @returns Complete RSS feed URL (e.g., "https://devmdx.com/feed.xml")
 */
export function buildRSSFeedUrl(): string {
  return `${BASE_URL}${URLS.RSS_FEED()}`;
}

/**
 * Build complete article URL for RSS feeds
 * @param year - Article year
 * @param slug - Article slug
 * @returns Complete article URL (e.g., "https://devmdx.com/articles/2025/my-article")
 */
export function buildArticleRSSUrl(year: string, slug: string): string {
  return `${BASE_URL}${URLS.ARTICLES(year, slug)}`;
}

/**
 * Get RSS feed metadata for use in HTML head
 * @returns Object with RSS feed metadata
 */
export function getRSSFeedMetadata() {
  return {
    url: buildRSSFeedUrl(),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    link: `${BASE_URL}${URLS.ARTICLES_LIST()}`,
    language: "en-us",
    managingEditor: profile.email || "",
    webMaster: profile.email || "",
    generator: "DevMDX RSS Feed Generator",
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
      url:
        configData.seo.image ||
        profile.image ||
        configData.seo.favicon?.png ||
        "",
      title: SITE_TITLE,
      link: `${BASE_URL}${URLS.ARTICLES_LIST()}`,
      width: 144,
      height: 144,
    },
  };
}

/**
 * Get the image MIME type from the image URL
 * @param imageUrl - The image URL to get the MIME type for
 * @returns The image MIME type
 */
function getImageMimeType(imageUrl: string): string {
  const extension = imageUrl.toLowerCase().split(".").pop() || "";

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/png";
  }
}

/**
 * Get all published articles formatted for RSS
 * @param limit - Maximum number of articles to return (default: 20)
 * @returns Array of articles with RSS-formatted data
 */
export async function getArticlesForRSS(limit: number = 20) {
  const articles = await getAllArticlesIndex();

  return articles
    .filter((article) => article.published !== false)
    .slice(0, limit)
    .map((article) => {
      const imageUrl = article.ogImage || article.image;

      return {
        ...article,
        url: buildArticleRSSUrl(article.year, article.slug),
        pubDate: new Date(article.date).toUTCString(),
        author: `${profile.email || ""} (${PROFILE_NAME})`,
        imageData: imageUrl
          ? {
              url: imageUrl,
              type: getImageMimeType(imageUrl),
              length: 512000,
            }
          : null,
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
      const imageEnclosure = article.imageData
        ? `<enclosure url="${escapeXml(article.imageData.url)}" type="${escapeXml(article.imageData.type)}" length="${article.imageData.length}" />`
        : "";
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
      ${imageEnclosure ? `${imageEnclosure}\n      ` : ""}${categories}
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

/**
 * Build RSS feed URL with optional parameters
 * @param options - Optional parameters for RSS feed
 * @returns RSS feed URL with query parameters
 */
export function buildRSSFeedUrlWithParams(options?: {
  category?: string;
  tag?: string;
  year?: string;
}): string {
  const baseUrl = buildRSSFeedUrl();

  if (!options) {
    return baseUrl;
  }

  const params = new URLSearchParams();
  if (options.category) params.append("category", options.category);
  if (options.tag) params.append("tag", options.tag);
  if (options.year) params.append("year", options.year);

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
