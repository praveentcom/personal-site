import { plural } from "pluralize";

import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { profile } from "@/data/profile";

export const PROFILE_NAME = `${profile.firstName} ${profile.lastName}`;

/**
 * Site SEO data
 */
export const SITE_TITLE = configData.seo.title || PROFILE_NAME;
export const SITE_DESCRIPTION = configData.seo.description || "";
export const SITE_KEYWORDS = configData.seo.keywords || [];
export const SITE_IMAGE = configData.seo.image || "";

/**
 * Get favicon paths from config with fallbacks to Next.js defaults
 * @returns The favicon paths
 */
export function getFaviconPaths(): {
  ico: string;
  png: string;
} {
  return {
    ico: configData.seo.favicon?.ico || "/favicon.ico",
    png: configData.seo.favicon?.png || "/favicon.png",
  };
}

/**
 * Get the article label (plural) from config or fallback
 * @returns The article label (plural)
 */
export function getArticleLabel(): string {
  return configData.misc.content?.articleLabel || "Article";
}

/**
 * Get the navigation items from config or fallback
 * @returns The navigation items
 */
export function getNavigationItems(): {
  href: string;
  label: string;
}[] {
  const baseLinks = [
    ...(configData.navigation?.home !== false
      ? [{ href: URLS.HOME(), label: "Home" }]
      : []),
    ...(configData.navigation?.apps !== false
      ? [{ href: URLS.APPS_LIST(), label: "Apps" }]
      : []),
    ...(configData.navigation?.articles !== false
      ? [
          {
            href: URLS.ARTICLES_LIST(),
            label: plural(getArticleLabel()),
          },
        ]
      : []),
    ...(configData.navigation?.community !== false
      ? [{ href: URLS.COMMUNITY_LIST(), label: "Community" }]
      : []),
    ...(configData.navigation?.work !== false
      ? [{ href: URLS.WORK_LIST(), label: "Work" }]
      : []),
  ];

  const customLinks = configData.navigation?.customLinks || [];

  return [...baseLinks, ...customLinks];
}
