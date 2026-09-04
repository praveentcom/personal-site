"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { CommandPalette as CommandPalettePrimitive } from "@avgeek-inc/ds-web/navigation/command-palette";
import { commands, commandGroups, type CommandContext } from "@/lib/commands";

export function CommandPalette() {
  const router = useRouter();
  const contextRef = useRef<CommandContext>({ router });
  contextRef.current = { router };

  return (
    <CommandPalettePrimitive
      groups={commandGroups}
      items={commands}
      onAction={(command) => command.action(contextRef.current)}
      renderItemIcon={(command) => (
        <HugeiconsIcon aria-hidden="true" icon={command.icon} />
      )}
    />
  );
}
