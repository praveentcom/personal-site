import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Home01Icon,
  News01Icon,
  FolderLibraryIcon,
  UserGroupIcon,
  GraduationScrollIcon,
  Briefcase01Icon,
  UserCircleIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { URLS } from "@/components/helpers/urls";

export interface CommandContext {
  router: AppRouterInstance;
}

export interface CommandItem {
  id: string;
  label: string;
  group: "navigation" | "actions";
  icon: IconSvgElement;
  keywords?: string[];
  action: (ctx: CommandContext) => void;
}

export const commands: CommandItem[] = [
  {
    id: "nav-home",
    label: "Go to Home",
    group: "navigation",
    icon: Home01Icon,
    keywords: ["dashboard", "main", "landing"],
    action: (ctx) => ctx.router.push(URLS.HOME()),
  },
  {
    id: "nav-articles",
    label: "Browse Articles",
    group: "navigation",
    icon: News01Icon,
    keywords: ["blog", "posts", "writing", "read"],
    action: (ctx) => ctx.router.push(URLS.ARTICLES_LIST()),
  },
  {
    id: "nav-apps",
    label: "View Apps",
    group: "navigation",
    icon: FolderLibraryIcon,
    keywords: ["portfolio", "apps", "projects", "open source"],
    action: (ctx) => ctx.router.push(URLS.APPS_LIST()),
  },
  {
    id: "nav-community",
    label: "Community",
    group: "navigation",
    icon: UserGroupIcon,
    keywords: ["talks", "sessions", "workshops", "contributions", "speaking"],
    action: (ctx) => ctx.router.push(URLS.COMMUNITY_LIST()),
  },
  {
    id: "nav-education",
    label: "Education",
    group: "navigation",
    icon: GraduationScrollIcon,
    keywords: ["school", "university", "degree", "learning"],
    action: (ctx) => ctx.router.push(URLS.EDUCATION_LIST()),
  },
  {
    id: "nav-work",
    label: "Work Experience",
    group: "navigation",
    icon: Briefcase01Icon,
    keywords: ["career", "jobs", "employment", "resume"],
    action: (ctx) => ctx.router.push(URLS.WORK_LIST()),
  },
  {
    id: "nav-about",
    label: "About",
    group: "navigation",
    icon: UserCircleIcon,
    keywords: ["bio", "profile", "me", "who"],
    action: (ctx) => ctx.router.push(URLS.ABOUT()),
  },
];

export const commandGroups = [
  { key: "navigation" as const, heading: "Navigation" },
  { key: "actions" as const, heading: "Actions" },
];
