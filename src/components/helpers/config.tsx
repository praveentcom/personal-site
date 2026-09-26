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
