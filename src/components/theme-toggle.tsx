"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribeToHydration = () => () => {};

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const cycleTheme = () => {
    const root = document.documentElement;
    const isNight = root.dataset.theme === "dark";
    const isTwilight = root.dataset.lightPeriod === "dusk";
    const period = isNight ? "day" : "dusk";
    root.dataset.lightPeriod = period;
    try {
      localStorage.setItem("personal-site-light-period", period);
    } catch {
      // Storage can be unavailable in private browsing; keep the current appearance.
    }
    setTheme(!isNight && isTwilight ? "dark" : "light");
  };
  return (
    <button
      type="button"
      className="footer-link theme-toggle"
      disabled={!isHydrated}
      onClick={cycleTheme}
    >
      <span className="theme-label-light">Switch to twilight mode</span>
      <span className="theme-label-twilight">Switch to night mode</span>
      <span className="theme-label-dark">Switch to day mode</span>
    </button>
  );
}
