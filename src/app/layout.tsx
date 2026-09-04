import { createAccessibilityScript } from "@workspace/web-design-system/lib/accessibility-script";
import { themeBootstrapScript } from "@workspace/web-design-system/lib/theme";
import { ToastProvider } from "@workspace/web-design-system/overlays/toast";
import { AgentationFeedback } from "@workspace/web-design-system/utilities/agentation-feedback";
import { Providers } from "@workspace/web-design-system/utilities/providers";
import type { Metadata } from "next";

import "@workspace/web-design-system/styles/globals.css";
import "@workspace/web-page-sections/styles.css";

import { ApplicationRuntime } from "@/components/application-runtime";
import {
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_TITLE,
} from "@/components/helpers/config";
import { createPageMetadata } from "@/components/helpers/metadata";
import { BASE_URL, URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";

export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="default" suppressHydrationWarning>
      <head>
        <script
          id="color-scheme-bootstrap"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <script
          id="accessibility-bootstrap"
          dangerouslySetInnerHTML={{ __html: createAccessibilityScript({}) }}
        />
      </head>
      <body className="font-sans min-h-dvh max-w-full overflow-x-clip">
        <Providers>
          <ApplicationRuntime>{children}</ApplicationRuntime>
          <ToastProvider />
          <AgentationFeedback />
        </Providers>
      </body>
    </html>
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
