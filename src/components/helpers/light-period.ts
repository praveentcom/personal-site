export function getLightPeriod(hour: number): "day" | "dusk" {
  return hour < 8 || hour >= 16 ? "dusk" : "day";
}

export const lightPeriodBootstrapScript = `(() => {
  let period = (${getLightPeriod.toString()})(new Date().getHours());
  try {
    const saved = localStorage.getItem("personal-site-light-period");
    if (saved === "day" || saved === "dusk") period = saved;
  } catch {}
  document.documentElement.dataset.lightPeriod = period;
})();`;
