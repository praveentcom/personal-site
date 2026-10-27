import { createRequire } from "node:module";
import { Buffer } from "node:buffer";
import path from "node:path";
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const directory = path.resolve(import.meta.dirname, "../public/images/covers");
const sources = path.resolve(import.meta.dirname, "assets");

async function grade(layout) {
  const { data, info } = await sharp(
    path.join(sources, `coimbatore-farm-${layout}-pastel.png`),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const output = Buffer.from(data);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const values = [
      0.9 * r + 0.12 * luminance,
      0.84 * g + 0.1 * luminance,
      0.76 * b + 0.12 * luminance,
    ];
    values.forEach((value, channel) => {
      output[i + channel] = Math.min(255, Math.round(value));
    });
    // Preserve the original alpha exactly, including gaps between palm leaflets.
  }
  await sharp(output, { raw: info })
    .png()
    .toFile(path.join(directory, `coimbatore-farm-${layout}-dusk-clean.png`));
  for (let i = 3; i < data.length; i += 4) {
    if (output[i] !== data[i]) throw new Error("Transparency changed");
  }
  console.info(`${layout} dusk: original alpha preserved`);
}
(async () => {
  for (const layout of ["tablet", "desktop"]) await grade(layout);
})();
