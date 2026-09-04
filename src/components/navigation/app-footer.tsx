"use client";
import { getBrandLogoProps } from "@workspace/image-assets/constants/brand-assets";

import { cn } from "@avgeek-inc/ds-web/lib/utils";
import { BrandLockup } from "@avgeek-inc/ds-web/media/brand-lockup";
import { Link } from "@avgeek-inc/ds-web/navigation/link";
import { OfficeLocations } from "@avgeek-inc/ds-web/overlays/office-locations";
import {
  TypographyParagraph,
  TypographyText,
} from "@avgeek-inc/ds-web/typography/typography";
import { FooterCopyright } from "./footer-copyright";

import type {
  ApplicationPolicy,
  FooterBadgeConfig,
  FooterConfig,
  ShellLinkConfig,
} from "./navigation-types";

export function AppFooter({
  config,
  policy,
}: {
  config: FooterConfig;
  policy: ApplicationPolicy;
}) {
  const copyright = config.copyright?.replace(
    "{year}",
    String(new Date().getFullYear()),
  );
  const hasLinkGroups = Boolean(config.linkGroups?.length);
  const showsFooterUtilities = Boolean(
    copyright || config.secondaryLinks?.length || policy.cookieConsent,
  );

  return (
    <footer className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6">
      <div
        data-slot="application-footer"
        className={cn(
          "grid gap-10",
          hasLinkGroups && "lg:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.8fr)]",
        )}
      >
        <div className="grid content-start gap-3">
          <BrandLockup
            {...getBrandLogoProps(config.brand.id, {
              src: config.brand.logoSrc,
            })}
          >
            <span>{config.brand.title}</span>
          </BrandLockup>
          {config.description ? (
            <TypographyParagraph color="muted" size="sm">
              {config.description}
            </TypographyParagraph>
          ) : null}
          {config.addresses?.length ? (
            <OfficeLocations offices={config.addresses} />
          ) : null}
          {showsFooterUtilities ? (
            <div
              data-slot="application-footer-utilities"
              className="grid justify-items-start"
            >
              <div
                data-slot="application-footer-meta"
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
              >
                <FooterCopyright
                  cookieConsent={policy.cookieConsent}
                  copyright={copyright}
                />
                {config.secondaryLinks?.map((link) => (
                  <FooterLink key={link.id} link={link} />
                ))}
                <span className="basis-full sm:hidden">
                  <TypographyText textRole="label" weight="normal">
                    <Link href="#">Back to top</Link>
                  </TypographyText>
                </span>
              </div>
            </div>
          ) : null}
          {config.badges?.length ? (
            <div className="flex flex-wrap items-start gap-3">
              {config.badges.map((badge) => (
                <FooterBadge key={badge.id} badge={badge} />
              ))}
            </div>
          ) : null}
        </div>
        {config.linkGroups?.length ? (
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {config.linkGroups.map((group) => (
              <div key={group.id} className="grid content-start gap-5">
                <TypographyText textRole="label" weight="semibold">
                  {group.title}
                </TypographyText>
                <div className="grid gap-2">
                  {group.links.map((link) => (
                    <FooterLink key={link.id} link={link} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}

function FooterLink({ link }: { link: ShellLinkConfig }) {
  return (
    <TypographyText textRole="label" weight="normal">
      <Link
        href={link.href}
        aria-label={link.accessibleLabel}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
      >
        {link.label}
        {link.external ? <span aria-hidden="true">↗</span> : null}
      </Link>
    </TypographyText>
  );
}

function FooterBadge({ badge }: { badge: FooterBadgeConfig }) {
  const image = (
    <img
      src={badge.src}
      alt={badge.alt}
      width={badge.width}
      height={badge.height}
      loading="lazy"
      decoding="async"
      className="h-auto max-w-full object-contain"
    />
  );

  return badge.href ? (
    <a href={badge.href} target="_blank" rel="noopener noreferrer">
      {image}
    </a>
  ) : (
    image
  );
}
