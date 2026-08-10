import { cache } from "react";

const CDN_BASE_URL = "https://cdn.praveent.com";
const CONTENT_REVALIDATE_SECONDS = 3600;

export type ContentCollection =
  | "apps"
  | "articles"
  | "community"
  | "education"
  | "profile"
  | "sitemap"
  | "work";

function getContentBaseUrl() {
  return CDN_BASE_URL;
}

function buildContentUrl(objectKey: string) {
  return `${getContentBaseUrl()}/${objectKey.replace(/^\/+/, "")}`;
}

function buildManifestUrl(collection: ContentCollection) {
  return buildContentUrl(`manifests/${collection}.json`);
}

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: {
        revalidate: CONTENT_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: {
        revalidate: CONTENT_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.text()).trim();
  } catch {
    return null;
  }
}

export interface ArticleManifestItem {
  slug: string;
  year: string;
  objectKey: string;
  publicUrl: string;
  urlPath: string;
  title: string | null;
  description: string | null;
  date: string | null;
  tags: string[];
  categories: string[];
  published: boolean;
  private: boolean;
  image: string | null;
  ogImage: string | null;
  readTime: number;
}

export interface CommunityManifestItem {
  slug: string;
  year: string;
  objectKey: string;
  publicUrl: string;
  urlPath: string;
  title: string | null;
  description: string | null;
  date: string | null;
  published: boolean;
  image: string | null;
  ogImage: string | null;
  youtubeUrl: string | null;
  externalLinks: { title: string; url: string }[];
  type: string | null;
  event: string | null;
}

export interface AppManifestItem {
  slug: string;
  year: string;
  objectKey: string;
  publicUrl: string;
  urlPath: string;
  title: string | null;
  shortDescription: string | null;
  description: string | null;
  date: string | null;
  stack: string[];
  image: string | null;
  ogImage: string | null;
  url: string | null;
  githubUrl: string | null;
  appStoreUrl: string | null;
  coAuthors: string[];
}

export interface WorkManifestItem {
  slug: string;
  year: string;
  objectKey: string;
  publicUrl: string;
  urlPath: string;
  role: string | null;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  skills: string[];
  image: string | null;
  ogImage: string | null;
}

export interface EducationManifestItem {
  slug: string;
  year: string;
  objectKey: string;
  publicUrl: string;
  urlPath: string;
  degree: string | null;
  school: string | null;
  startDate: string | null;
  endDate: string | null;
  image: string | null;
  ogImage: string | null;
}

export interface ProfileManifestItem {
  name: string;
  objectKey: string;
  publicUrl: string;
  urlPath: string | null;
}

export interface SitemapManifestRoute {
  path: string;
  source: string;
  lastModified?: string | null;
}

export interface ArticleManifest {
  collection: "articles";
  generatedAt: string;
  count: number;
  items: ArticleManifestItem[];
}

export interface CommunityManifest {
  collection: "community";
  generatedAt: string;
  intro: {
    objectKey: string;
    publicUrl: string;
    urlPath: string;
  } | null;
  count: number;
  items: CommunityManifestItem[];
}

export interface AppManifest {
  collection: "apps";
  generatedAt: string;
  count: number;
  items: AppManifestItem[];
}

export interface WorkManifest {
  collection: "work";
  generatedAt: string;
  count: number;
  items: WorkManifestItem[];
}

export interface EducationManifest {
  collection: "education";
  generatedAt: string;
  count: number;
  items: EducationManifestItem[];
}

export interface ProfileManifest {
  collection: "profile";
  generatedAt: string;
  count: number;
  items: ProfileManifestItem[];
}

export interface SitemapManifest {
  collection: "sitemap";
  generatedAt: string;
  count: number;
  routes: SitemapManifestRoute[];
}

const EMPTY_ARTICLE_MANIFEST: ArticleManifest = {
  collection: "articles",
  generatedAt: "",
  count: 0,
  items: [],
};

const EMPTY_COMMUNITY_MANIFEST: CommunityManifest = {
  collection: "community",
  generatedAt: "",
  intro: null,
  count: 0,
  items: [],
};

const EMPTY_APP_MANIFEST: AppManifest = {
  collection: "apps",
  generatedAt: "",
  count: 0,
  items: [],
};

const EMPTY_WORK_MANIFEST: WorkManifest = {
  collection: "work",
  generatedAt: "",
  count: 0,
  items: [],
};

const EMPTY_EDUCATION_MANIFEST: EducationManifest = {
  collection: "education",
  generatedAt: "",
  count: 0,
  items: [],
};

const EMPTY_PROFILE_MANIFEST: ProfileManifest = {
  collection: "profile",
  generatedAt: "",
  count: 0,
  items: [],
};

const EMPTY_SITEMAP_MANIFEST: SitemapManifest = {
  collection: "sitemap",
  generatedAt: "",
  count: 0,
  routes: [],
};

export const getArticleManifest = cache(async () =>
  fetchJson<ArticleManifest>(
    buildManifestUrl("articles"),
    EMPTY_ARTICLE_MANIFEST,
  ),
);

export const getCommunityManifest = cache(async () =>
  fetchJson<CommunityManifest>(
    buildManifestUrl("community"),
    EMPTY_COMMUNITY_MANIFEST,
  ),
);

export const getAppManifest = cache(async () =>
  fetchJson<AppManifest>(buildManifestUrl("apps"), EMPTY_APP_MANIFEST),
);

export const getWorkManifest = cache(async () =>
  fetchJson<WorkManifest>(buildManifestUrl("work"), EMPTY_WORK_MANIFEST),
);

export const getEducationManifest = cache(async () =>
  fetchJson<EducationManifest>(
    buildManifestUrl("education"),
    EMPTY_EDUCATION_MANIFEST,
  ),
);

export const getProfileManifest = cache(async () =>
  fetchJson<ProfileManifest>(
    buildManifestUrl("profile"),
    EMPTY_PROFILE_MANIFEST,
  ),
);

export const getSitemapManifest = cache(async () =>
  fetchJson<SitemapManifest>(
    buildManifestUrl("sitemap"),
    EMPTY_SITEMAP_MANIFEST,
  ),
);

export async function getManifestByCollection(collection: ContentCollection) {
  switch (collection) {
    case "apps":
      return getAppManifest();
    case "articles":
      return getArticleManifest();
    case "community":
      return getCommunityManifest();
    case "education":
      return getEducationManifest();
    case "profile":
      return getProfileManifest();
    case "sitemap":
      return getSitemapManifest();
    case "work":
      return getWorkManifest();
  }
}

export const getContentByObjectKey = cache(async (objectKey: string) =>
  fetchText(buildContentUrl(objectKey)),
);
