import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./globals.css";

import { LightPeriod } from "@/components/light-period";
import { lightPeriodBootstrapScript } from "@/components/helpers/light-period";
import { ThemeProvider } from "@/components/theme-provider";
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

export const viewport: Viewport = {
  viewportFit: "cover",
};

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
            __html: lightPeriodBootstrapScript,
          }}
        />
      </head>
      <body className="min-h-dvh text-foreground font-sans">
        <ThemeProvider>
          <LightPeriod />
          <ApplicationRuntime>{children}</ApplicationRuntime>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_TOWBAR_ANALYTICS === "true" && (
          <Script
            src="/.well-known/towbar-analytics/script.js"
            strategy="afterInteractive"
          />
        )}
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
