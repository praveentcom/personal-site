"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Command } from "@workspace/web-design-system/components/command";
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
    <Command>
      <Command.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && close()}
      >
        <Command.Container>
          <Command.Dialog>
            <Command.InputGroup>
              <Command.InputGroup.Input placeholder="Type a command or search…" />
              <Command.InputGroup.ClearButton />
            </Command.InputGroup>
            <Command.List
              aria-label="Commands"
              renderEmptyState={() => "No results found."}
            >
              {commandGroups.map((group) => {
                const groupCommands = commands.filter(
                  (c) => c.group === group.key,
                );
                if (groupCommands.length === 0) return null;
                return (
                  <Command.Group key={group.key} heading={group.heading}>
                    {groupCommands.map((command) => (
                      <Command.Item
                        id={command.id}
                        key={command.id}
                        textValue={[
                          command.label,
                          ...(command.keywords ?? []),
                        ].join(" ")}
                        onAction={() => handleSelect(command.id)}
                      >
                        <HugeiconsIcon icon={command.icon} />
                        {command.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                );
              })}
            </Command.List>
          </Command.Dialog>
        </Command.Container>
      </Command.Backdrop>
    </Command>
  );
}
