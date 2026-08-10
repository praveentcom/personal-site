import { ConfigData } from "@/types/config";

export const configData: ConfigData = {
  seo: {
    title: "Praveen Thirumurugan | Software Developer",
    description:
      "I build and maintain multiple OSS projects in the developer tools space and share my insights and learnings through community talks and written articles.",
    keywords: [
      "full stack developer",
      "software engineer",
      "react",
      "node.js",
      "typescript",
      "javascript",
      "web development",
      "frontend development",
      "backend development",
      "cloud architecture",
      "aws",
      "microservices",
      "devops",
      "team leadership",
      "technical leadership",
      "open source",
      "machine learning",
      "ai",
      "performance optimization",
      "scalable systems",
    ],
    image: "https://www.praveent.com/og-image.png",
    twitterCard: "summary_large_image",
    twitterSite: "@praveentcom",
    twitterCreator: "@praveentcom",
  },
  navigation: {
    home: false,
    apps: true,
    articles: true,
    community: true,
    education: true,
    work: false,
    customLinks: [],
  },
  misc: {
    content: {
      articleLabel: "Article",
      articleSlug: "articles",
    },
    footerLabel: "Build. Ship. Repeat.",
    locale: "en-IN",
    timezone: "Asia/Kolkata",
  },
};
