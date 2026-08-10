"use client";

import { useEffect } from "react";
import { useCommandPaletteStore } from "@/stores/command-palette";

export function useKeyboardShortcut() {
  const toggle = useCommandPaletteStore((s) => s.toggle);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);
}
