"use client";

import type { ReactNode } from "react";

import { AppShell } from "@workspace/web-design-system/layouts/app-shell";
import { AppShellOverlay } from "@workspace/web-design-system/layouts/app-shell-overlay";

import { CommandPalette } from "@/components/command-palette/command-palette";
import {
  applicationFooter,
  applicationHeader,
  applicationPolicy,
} from "@/lib/application-layout";

export function ApplicationRuntime({ children }: { children: ReactNode }) {
  return (
    <>
      <AppShell
        contentWidth="compact"
        header={applicationHeader}
        footer={applicationFooter}
        policy={applicationPolicy}
      >
        {children}
      </AppShell>
      <AppShellOverlay layer="command">
        <CommandPalette />
      </AppShellOverlay>
    </>
  );
}
