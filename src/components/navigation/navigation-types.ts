import type { BrandName } from "@avgeek-inc/reference-data/brands";
import type { CompanyOffice } from "@avgeek-inc/ds-web/overlays/office-locations";

import type { IconSvgElement as SidebarIcon } from "@hugeicons/react";

export type ShellIconName =
  | "aircraft"
  | "ai-book"
  | "ai-editing"
  | "ai-image"
  | "ai-video"
  | "album"
  | "airport"
  | "apps"
  | "arrow-right"
  | "award"
  | "briefcase"
  | "camera-ai"
  | "chat-spark"
  | "check-list"
  | "credit-card"
  | "dashboard"
  | "factory"
  | "film"
  | "film-roll"
  | "flow-connection"
  | "graduation"
  | "home"
  | "integrations"
  | "layers"
  | "logout"
  | "menu"
  | "news"
  | "notification"
  | "paint-board"
  | "plane"
  | "provider"
  | "rocket"
  | "search"
  | "security"
  | "settings"
  | "shopping-bag"
  | "star"
  | "user"
  | "users"
  | "webhook"
  | "workflow";

export interface ActiveRouteConfig {
  mode?: "exact" | "prefix";
  paths?: readonly string[];
}

export interface ShellLinkConfig {
  kind: "link";
  id: string;
  label: string;
  href: string;
  accessibleLabel?: string;
  active?: ActiveRouteConfig;
  external?: boolean;
  icon?: ShellIconName;
  iconSrc?: string;
  keywords?: readonly string[];
}

export interface ShellActionConfig {
  kind: "action";
  id: string;
  label: string;
  accessibleLabel?: string;
  destructive?: boolean;
  disabled?: boolean;
  icon?: ShellIconName;
  onSelect: () => void;
}

export interface ShellNavigationSection {
  columns?: 1 | 2;
  id: string;
  label?: string;
  links: readonly ShellLinkConfig[];
}

export interface ShellNavigationGroup {
  kind: "group";
  id: string;
  label: string;
  active?: ActiveRouteConfig;
  icon?: ShellIconName;
  sections: readonly ShellNavigationSection[];
}

export type ShellNavigationItem = ShellLinkConfig | ShellNavigationGroup;

export interface HeaderBrandConfig {
  accessibleLabel: string;
  id: BrandName;
  logoSrc?: string;
  title: string;
}

export interface HeaderCallToActionConfig extends ShellLinkConfig {
  emphasis?: "primary" | "secondary";
}

export interface HeaderAvatarConfig {
  email?: string | null;
  fallbackSeed: string;
  name: string;
}

export type HeaderMenuEntry =
  | ShellLinkConfig
  | ShellActionConfig
  | { kind: "separator"; id: string };

export interface HeaderMenuConfig {
  accessibleLabel: string;
  avatar?: HeaderAvatarConfig;
  badgeCount?: number;
  icon?: ShellIconName;
  id: string;
  items: readonly HeaderMenuEntry[];
  label?: string;
  onOpenChange?: (open: boolean) => void;
  subtitle?: string;
  title?: string;
}

interface HeaderNavigationConfig {
  alignment?: "start" | "center";
  callToAction?: HeaderCallToActionConfig;
  menu?: HeaderMenuConfig;
  mobileNavigation?: {
    accessibleLabel: string;
    side?: "left" | "right";
  };
  navigation?: readonly ShellNavigationItem[];
  notifications?: HeaderMenuConfig;
}

export interface HeaderConfig extends HeaderNavigationConfig {
  brand: HeaderBrandConfig;
  homeHref: string;
  homeHrefOverrides?: readonly {
    external?: boolean;
    href: string;
    pathname: string;
  }[];
}

export interface SidebarBadgeConfig {
  label: string;
  value: number | string;
}

export interface SidebarLinkConfig extends Omit<ShellLinkConfig, "icon"> {
  badge?: SidebarBadgeConfig;
  icon?: SidebarIcon;
  iconColor?: string;
}

export interface SidebarActionConfig extends Omit<ShellActionConfig, "icon"> {
  badge?: SidebarBadgeConfig;
  confirmation?: {
    cancelLabel: string;
    confirmLabel: string;
    description: string;
    title: string;
  };
  icon?: SidebarIcon;
  shortcut?: {
    key: string;
    modifiers?: readonly ("command" | "ctrl" | "shift")[];
  };
}

export interface SidebarExpandableConfig {
  kind: "group";
  id: string;
  label: string;
  icon?: SidebarIcon;
  items: readonly SidebarLinkConfig[];
}

export type SidebarItemConfig =
  | SidebarLinkConfig
  | SidebarActionConfig
  | SidebarExpandableConfig;

export type SidebarContentItemConfig = SidebarLinkConfig | SidebarActionConfig;

export interface SidebarGroupConfig {
  id: string;
  items: readonly SidebarItemConfig[];
  label?: string;
}

export interface SidebarConfig {
  accessibleLabel: string;
  brand: HeaderBrandConfig;
  contentActions?: readonly SidebarContentItemConfig[];
  footerActions?: readonly SidebarActionConfig[];
  groups: readonly SidebarGroupConfig[];
  homeHref: string;
  persistenceKey?: string;
}

export interface FooterLinkGroupConfig {
  id: string;
  links: readonly ShellLinkConfig[];
  title: string;
}

export interface FooterBadgeConfig {
  alt: string;
  height: number;
  href?: string;
  id: string;
  src: string;
  width: number;
}

export interface FooterConfig {
  addresses?: readonly CompanyOffice[];
  badges?: readonly FooterBadgeConfig[];
  brand: HeaderBrandConfig;
  companyName?: string;
  copyright?: string;
  description?: string;
  linkGroups?: readonly FooterLinkGroupConfig[];
  secondaryLinks?: readonly ShellLinkConfig[];
}

export interface ApplicationPolicy {
  cookieConsent?: {
    cookiePolicyHref?: string;
    privacyHref: string;
    sharedCookieDomain?: string;
  };
  themeControl?: "header" | "none";
}
