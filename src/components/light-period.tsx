"use client";

import { useEffect } from "react";
import { getLightPeriod } from "@/components/helpers/light-period";

export function LightPeriod() {
  useEffect(() => {
    const update = () => {
      let period = getLightPeriod(new Date().getHours());
      try {
        const saved = localStorage.getItem("personal-site-light-period");
        if (saved === "day" || saved === "dusk") period = saved;
      } catch {
        // Storage can be unavailable in private browsing; keep the current appearance.
      }
      document.documentElement.dataset.lightPeriod = period;
    };
    update();
    const timer = window.setInterval(update, 30_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return null;
}
