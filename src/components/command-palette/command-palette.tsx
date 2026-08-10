"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/web-design-system/components/command";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { commands, commandGroups, type CommandContext } from "@/lib/commands";

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, close } = useCommandPaletteStore();

  useKeyboardShortcut();

  const contextRef = useRef<CommandContext>({
    router,
  });
  contextRef.current = { router };

  const handleSelect = useCallback(
    (commandId: string) => {
      const command = commands.find((c) => c.id === commandId);
      if (command) {
        close();
        command.action(contextRef.current);
      }
    },
    [close],
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandGroups.map((group) => {
            const groupCommands = commands.filter((c) => c.group === group.key);
            if (groupCommands.length === 0) return null;
            return (
              <CommandGroup key={group.key} heading={group.heading}>
                {groupCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    value={command.id}
                    onSelect={handleSelect}
                    keywords={command.keywords}
                  >
                    <HugeiconsIcon icon={command.icon} />
                    {command.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
