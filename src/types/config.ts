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

export interface ConfigData {
  seo: ConfigSeoData;
}
