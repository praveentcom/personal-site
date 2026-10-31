"use client";

import { useState, type ReactNode } from "react";

export function CodeBlock({
  code,
  language,
  children,
}: {
  code: string;
  language: string;
  children: ReactNode;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{language}</span>
        <button
          type="button"
          onClick={copyCode}
          onBlur={() => setCopyState("idle")}
          aria-label={
            copyState === "copied"
              ? "Copied code"
              : copyState === "failed"
                ? "Copy failed, try again"
                : "Copy code"
          }
        >
          {copyState === "copied"
            ? "Copied"
            : copyState === "failed"
              ? "Copy failed"
              : "Copy"}
        </button>
      </div>
      <span className="sr-only" role="status">
        {copyState === "copied"
          ? "Code copied to clipboard"
          : copyState === "failed"
            ? "Could not copy code to clipboard"
            : ""}
      </span>
      <pre tabIndex={0}>{children}</pre>
    </div>
  );
}
