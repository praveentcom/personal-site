import type { Metadata } from "next";

import "@workspace/web-design-system/styles/globals.css";
import "@workspace/web-page-sections/styles.css";
import { WorkspaceDocument } from "@workspace/web-design-system/layouts/workspace-document";
import { workspaceThemes } from "@workspace/web-design-system/lib/workspace-theme";

import {
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_TITLE,
} from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { BASE_URL, URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { ApplicationRuntime } from "@/components/application-runtime";

export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WorkspaceDocument config={{ theme: workspaceThemes.praveen }}>
      <ApplicationRuntime>{children}</ApplicationRuntime>
    </WorkspaceDocument>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createPageMetadata({
    description: SITE_DESCRIPTION,
    keywords: configData.seo.keywords,
    url: BASE_URL,
    image: SITE_IMAGE,
  });

  return {
    ...metadata,
    other: {
      ...metadata.other,
    },
    alternates: {
      ...metadata.alternates,
      types: {
        "application/rss+xml": [
          {
            url: `${BASE_URL}${URLS.RSS_FEED()}`,
            title: `${SITE_TITLE} RSS feed`,
          },
        ],
      },
    },
  };
}
