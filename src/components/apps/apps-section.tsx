"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/web-design-system/components/button";
import { IntegrationsSection } from "@workspace/web-page-sections/integrations-section";

import { URLS } from "@/components/helpers/urls";
import { App } from "@/types/app";
import { HeaderSection } from "@workspace/web-page-sections/header-section";
import { Typography } from "@workspace/web-design-system/components/typography";

interface AppsSectionProps {
  apps: App[];
}

const localAppLogos: Record<string, string> = {
  dnsdeck: "/projects/dnsdeck/logo.png",
  illustrate: "/projects/illustrate/logo.png",
};

export function AppsSection({ apps }: AppsSectionProps) {
  return (
    <IntegrationsSection
      layout="detailed"
      header={
        <HeaderSection
          label={"Independent software"}
          title={"Apps built from real operating needs"}
          description={
            "A selection of developer tools and focused products I design, ship, and maintain."
          }
          action={
            <Button
              variant="secondary"
              render={<Link href={URLS.APPS_LIST()} />}
            >
              View all apps
            </Button>
          }
        />
      }
      items={apps.slice(0, 6).map((app) => ({
        key: app.slug,
        name: app.title,
        description: app.shortDescription ?? app.description,
        href: URLS.APPS(app.slug),
        logo:
          localAppLogos[app.slug] || app.image ? (
            <Image
              src={localAppLogos[app.slug] ?? app.image ?? ""}
              alt=""
              width={64}
              height={64}
              className="size-full object-cover"
            />
          ) : (
            <Typography weight="medium">{app.title.slice(0, 1)}</Typography>
          ),
        badges: app.stack.slice(0, 3),
      }))}
      renderLink={(item, children, className) => (
        <Link href={item.href ?? "#"} className={className}>
          {children}
        </Link>
      )}
    />
  );
}
