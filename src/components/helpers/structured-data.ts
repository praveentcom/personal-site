import { PROFILE_NAME } from "@/components/helpers/config";
import { BASE_URL, URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { profile } from "@/data/profile";
import { Article } from "@/types/article";

export function generateDefaultSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE_NAME,
    description: configData.seo.description,
    url: BASE_URL,
    image: profile.image,
    sameAs: Object.values(profile.socialLinks ?? {}),
  };
}

export function generateArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: new URL(article.image, BASE_URL).href,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: PROFILE_NAME,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: PROFILE_NAME,
      logo: {
        "@type": "ImageObject",
        url: configData.seo.image,
      },
    },
    url: new URL(URLS.ARTICLES(article.slug), BASE_URL).href,
    wordCount: article.content?.split(" ").length || 0,
    timeRequired: `PT${Math.max(1, Math.ceil((article.content?.split(" ").length || 0) / 200))}M`,
    keywords: article.tags.join(", "),
  };
}
