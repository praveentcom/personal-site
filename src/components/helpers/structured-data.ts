import { site } from "@/lib/site";
import { URLS } from "@/components/helpers/urls";
import type { Article } from "@/types/article";

export function generateDefaultSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    description: site.description,
    url: site.url,
    image: new URL(site.profileImage, site.url).href,
    sameAs: Object.values(site.socialLinks),
  };
}

export function generateArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: new URL(article.image, site.url).href,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: new URL(site.image, site.url).href,
      },
    },
    url: new URL(URLS.ARTICLES(article.slug), site.url).href,
    wordCount: article.content.trim().split(/\s+/).length,
    timeRequired: `PT${article.readTime}M`,
    keywords: article.tags.join(", "),
  };
}
