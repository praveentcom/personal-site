import { PersistedThemeProvider } from "@avgeek-inc/runtime-web/browser-theme";
import { themeBootstrapScript } from "@avgeek-inc/runtime-web/theme-bootstrap";
import { ToastProvider } from "@avgeek-inc/ds-web/overlays/toast";
import type { Metadata } from "next";

import "./globals.css";

import { LightPeriod } from "@/components/light-period";
import { lightPeriodBootstrapScript } from "@/components/helpers/light-period";
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
          dangerouslySetInnerHTML={{
            __html: themeBootstrapScript + lightPeriodBootstrapScript,
          }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground font-sans">
        <PersistedThemeProvider>
          <LightPeriod />
          <ApplicationRuntime>{children}</ApplicationRuntime>
          <ToastProvider />
        </PersistedThemeProvider>
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
