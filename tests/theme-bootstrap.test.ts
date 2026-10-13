import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "next-themes";

const html = renderToStaticMarkup(
  createElement(ThemeProvider, {
    attribute: ["class", "data-theme"],
    storageKey: "workspace-ui-theme",
    defaultTheme: "system",
    enableSystem: true,
  }),
);
const bootstrap = html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap);

for (const [stored, systemDark, expected] of [
  ["dark", false, "dark"],
  ["light", true, "light"],
  ["system", true, "dark"],
  [null, false, "light"],
] as const) {
  test(`theme bootstrap restores ${stored ?? "default"} as ${expected} before hydration`, () => {
    const classes = new Set<string>();
    const attributes: Record<string, string> = {};
    const root = {
      classList: {
        remove: (...names: string[]) =>
          names.forEach((name) => classes.delete(name)),
        add: (name: string) => classes.add(name),
      },
      setAttribute: (name: string, value: string) => {
        attributes[name] = value;
      },
      style: {} as Record<string, string>,
    };
    vm.runInNewContext(bootstrap, {
      document: { documentElement: root },
      localStorage: {
        getItem: (key: string) => {
          assert.equal(key, "workspace-ui-theme");
          return stored;
        },
      },
      window: { matchMedia: () => ({ matches: systemDark }) },
    });
    assert.ok(classes.has(expected));
    assert.equal(attributes["data-theme"], expected);
    assert.equal(root.style.colorScheme, expected);
  });
}
