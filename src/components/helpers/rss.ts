import { getAllArticlesIndex } from "@/components/helpers/article";
import { site } from "@/lib/site";
import { URLS } from "@/components/helpers/urls";

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
  const articles = (await getAllArticlesIndex()).slice(0, 20);
  const feedUrl = new URL(URLS.RSS_FEED(), site.url).href;
  const blogUrl = new URL(URLS.ARTICLES_LIST(), site.url).href;
  const rssItems = articles
    .map((article) => {
      const url = new URL(URLS.ARTICLES(article.slug), site.url).href;
      const categories = article.categories
        .map((category) => `<category>${wrapCdata(category)}</category>`)
        .join("\n      ");

      return `
    <item>
      <title>${wrapCdata(article.title)}</title>
      <description>${wrapCdata(article.description)}</description>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${escapeXml(new Date(article.date).toUTCString())}</pubDate>
      <author>${escapeXml(`${site.email} (${site.name})`)}</author>
      ${categories}
    </item>`;
    })
    .join("");
  const lastBuildDate = articles[0]
    ? new Date(articles[0].date).toUTCString()
    : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${wrapCdata(site.title)}</title>
    <description>${wrapCdata(site.description)}</description>
    <link>${escapeXml(blogUrl)}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <copyright>${wrapCdata(`Copyright ${new Date().getFullYear()} ${site.name}. All rights reserved.`)}</copyright>
    <managingEditor>${escapeXml(site.email)} (${escapeXml(site.name)})</managingEditor>
    <webMaster>${escapeXml(site.email)} (${escapeXml(site.name)})</webMaster>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <generator>Praveen Website</generator>
    <image>
      <url>${escapeXml(new URL(site.image, site.url).href)}</url>
      <title>${wrapCdata(site.title)}</title>
      <link>${escapeXml(blogUrl)}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`.trim();
}

export async function createRSSResponse() {
  return new Response(await generateRSSFeed(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
