import type {
  ApplicationPolicy,
  FooterConfig,
  HeaderConfig,
  ShellIconName,
} from "@workspace/web-design-system/layouts/application-shell-types";
import { avgeekOfficeAddresses } from "@workspace/web-design-system/lib/legal-entities";

import { getNavigationItems } from "@/components/helpers/config";
import { URLS } from "@/components/helpers/urls";
import { configData } from "@/data/config";
import { profile } from "@/data/profile";

const title = `${profile.firstName} ${profile.lastName}`;
const brand = {
  accessibleLabel: `${title} home`,
  id: "praveen",
  logoSrc: "/favicon.png",
  title,
} as const;

function getIcon(href: string): ShellIconName {
  if (href === URLS.ABOUT()) return "user";
  if (href === URLS.ARTICLES_LIST()) return "news";
  if (href === URLS.COMMUNITY_LIST()) return "users";
  if (href === URLS.APPS_LIST()) return "apps";
  if (href === URLS.WORK_LIST()) return "briefcase";
  if (href === URLS.EDUCATION_LIST()) return "graduation";
  return "arrow-right";
}

export const applicationHeader = {
  brand,
  homeHref: URLS.HOME(),
  homeHrefOverrides: [{ pathname: URLS.HOME(), href: URLS.ABOUT() }],
  mobileNavigation: {
    accessibleLabel: "Primary navigation",
    side: "left",
  },
  navigation: getNavigationItems()
    .filter((item) => item.href !== URLS.HOME())
    .map((item) => ({
      kind: "link" as const,
      id: `navigation-${item.href}`,
      label: item.label,
      href: item.href,
      icon: getIcon(item.href),
    })),
} satisfies HeaderConfig;

const socialLinks: readonly (readonly [string, string | undefined])[] = [
  ["LinkedIn", profile.socialLinks?.linkedin],
  ["X", profile.socialLinks?.x],
  ["Instagram", profile.socialLinks?.instagram],
  ["YouTube", profile.socialLinks?.youtube],
  ["GitHub", profile.socialLinks?.github],
  ["Stack Overflow", profile.socialLinks?.stackoverflow],
];

export const applicationFooter = {
  addresses: avgeekOfficeAddresses,
  brand,
  copyright: "© {year} Praveen Thirumurugan.",
  description: configData.misc.footerLabel,
  linkGroups: [
    {
      id: "social",
      title: "Social",
      links: socialLinks.flatMap(([label, href]) =>
        href
          ? [
              {
                kind: "link" as const,
                id: `social-${label.toLowerCase().replaceAll(" ", "-")}`,
                label,
                href,
                external: true,
              },
            ]
          : [],
      ),
    },
  ],
} satisfies FooterConfig;

export const applicationPolicy = {
  cookieConsent: {
    privacyHref: "https://www.avgeek.io/privacy",
  },
  kind: "public",
  themeControl: "header",
  toasts: true,
} satisfies ApplicationPolicy;
