export interface ConfigSeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterSite?: string;
  twitterCreator?: string;
  favicon?: {
    ico?: string;
    png?: string;
  };
}

export interface ConfigNavigationData {
  home?: boolean;
  apps?: boolean;
  articles?: boolean;
  community?: boolean;
  education?: boolean;
  work?: boolean;
  customLinks?: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
}

export interface ConfigMiscData {
  footerLabel?: string;
  locale?: string;
  timezone?: string;
  content?: {
    articleLabel?: string; // e.g., "Article", "Blog", "Essay"
    articleSlug?: string; // e.g., "articles", "blog", "essays"
  };
}

export interface ConfigData {
  navigation?: ConfigNavigationData;
  misc: ConfigMiscData;
  seo: ConfigSeoData;
}
