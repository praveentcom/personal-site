"use client";

import { ApplicationFooter } from "@workspace/web-design-system/layouts/application-footer";
import { ApplicationNavbar } from "@workspace/web-design-system/layouts/application-navbar";
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
      <ApplicationNavbar
        config={applicationHeader}
        showThemeSwitcher={applicationPolicy.themeControl === "header"}
      />
      <main className="mx-auto min-w-0 w-full max-w-5xl">{children}</main>
      <ApplicationFooter
        config={applicationFooter}
        policy={applicationPolicy}
      />
      <CommandPalette />
    </>
  );
}
