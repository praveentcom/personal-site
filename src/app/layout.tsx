import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ApplicationRuntime } from "@/components/application-runtime";
import { createPageMetadata } from "@/components/helpers/metadata";
import { site } from "@/lib/site";

export const revalidate = 3600;

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  ...createPageMetadata({ url: "/" }),
  alternates: {
    types: {
      "application/rss+xml": [
        { url: `${site.url}/blog/rss.xml`, title: `${site.title} RSS feed` },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApplicationRuntime>{children}</ApplicationRuntime>
      </body>
    </html>
  );
}
