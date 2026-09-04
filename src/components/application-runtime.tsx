"use client";

import { AppFooter } from "@/components/navigation/app-footer";
import { AppNavbar } from "@/components/navigation/app-navbar";
import type { ReactNode } from "react";

import { CommandPalette } from "@/components/command-palette/command-palette";
import {
  applicationFooter,
  applicationHeader,
  applicationPolicy,
} from "@/lib/application-layout";

export function ApplicationRuntime({ children }: { children: ReactNode }) {
  return (
    <>
      <AppNavbar
        config={applicationHeader}
        showThemeSwitcher={applicationPolicy.themeControl === "header"}
      />
      <main className="mx-auto min-w-0 w-full max-w-5xl">{children}</main>
      <AppFooter config={applicationFooter} policy={applicationPolicy} />
      <CommandPalette />
    </>
  );
}
