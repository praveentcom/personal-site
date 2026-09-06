"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@avgeek-inc/ds-web/buttons/button";
import { IntegrationsSection } from "@avgeek-inc/ds-web-sections/integrations-section";

import { URLS } from "@/components/helpers/urls";
import { App } from "@/types/app";
import { HeaderSection } from "@avgeek-inc/ds-web-sections/header-section";
import { Typography } from "@avgeek-inc/ds-web/typography/typography";

interface AppsSectionProps {
  apps: App[];
}

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
            <ButtonLink variant="secondary" href={URLS.APPS_LIST()}>
              View all apps
            </ButtonLink>
          }
        />
      }
      items={apps.slice(0, 6).map((app) => ({
        key: app.slug,
        name: app.title,
        description: app.shortDescription ?? app.description,
        href: URLS.APPS(app.slug),
        logo: app.image ? (
          <Image
            src={app.image}
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
