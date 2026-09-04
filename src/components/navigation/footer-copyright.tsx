"use client";

import type { ReactNode } from "react";

import { CookieConsentSettings } from "@workspace/web-runtime/cookie-consent-settings";
import { TypographyText } from "@workspace/web-design-system/typography/typography";

import type { ApplicationPolicy } from "./navigation-types";

type FooterCookieConsent = NonNullable<ApplicationPolicy["cookieConsent"]>;

function FooterCopyright({
  cookieConsent,
  copyright,
}: {
  cookieConsent?: FooterCookieConsent;
  copyright?: ReactNode;
}) {
  if (!copyright && !cookieConsent) {
    return null;
  }

  return (
    <div
      data-slot="application-footer-copyright"
      className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
    >
      {copyright ? (
        <TypographyText textRole="supporting">{copyright}</TypographyText>
      ) : null}
      {copyright && cookieConsent ? " " : null}
      {cookieConsent ? (
        <CookieConsentSettings
          className="footer-cookie-consent-link -my-1 h-8! min-w-0 rounded-none! px-0! text-foreground underline decoration-border underline-offset-4"
          cookiePolicyHref={cookieConsent.cookiePolicyHref}
          privacyHref={cookieConsent.privacyHref}
          sharedCookieDomain={cookieConsent.sharedCookieDomain}
          variant="ghost"
        >
          <TypographyText color="default" textRole="supporting">
            Manage Cookies
          </TypographyText>
        </CookieConsentSettings>
      ) : null}
    </div>
  );
}

export { FooterCopyright };
