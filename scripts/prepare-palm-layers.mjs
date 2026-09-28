import { createHash } from "node:crypto";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const directory = path.resolve(import.meta.dirname, "../public/images/covers");
const width = 2172;
const height = 724;
const original = path.join(directory, "coimbatore-farm-desktop-pastel.png");
const clean = path.resolve(import.meta.dirname, "assets/palms-clean-plate.png");
// Only borrow the generated pixels behind the palms; retain the rest exactly.
const mask = Buffer.from(
  `<svg width="${width}" height="${height}"><path fill="white" d="M20 70H340V395H208L132 545H65L119 397H20Z"/></svg>`,
);
const { data: source, info } = await sharp(original)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const replacement = await sharp(clean).ensureAlpha().raw().toBuffer();
const leftReplacement = await sharp(
  path.resolve(import.meta.dirname, "assets/left-tree-clean-plate.png"),
)
  .ensureAlpha()
  .raw()
  .toBuffer();
const rightBlend = await sharp(
  Buffer.from(
    `<svg width="${width}" height="${height}"><path fill="white" d="M1720 -100H2300V580H1720Z"/></svg>`,
  ),
)
  .blur(20)
  .ensureAlpha()
  .raw()
  .toBuffer();
const blend = await sharp(mask).blur(3).ensureAlpha().raw().toBuffer();
const output = Buffer.from(source);
for (let i = 0; i < source.length; i += 4) {
  const right = (i / 4) % width > width / 2;
  const amount = (right ? rightBlend[i + 3] : blend[i + 3]) / 255;
  const plate = right ? replacement : leftReplacement;
  const a = (source[i + 3] / 255) * (1 - amount);
  const b = (plate[i + 3] / 255) * amount;
  for (let c = 0; c < 3; c++)
    output[i + c] =
      a + b ? Math.round((source[i + c] * a + plate[i + c] * b) / (a + b)) : 0;
  output[i + 3] = Math.round((a + b) * 255);
}
await sharp(output, { raw: info })
  .png()
  .toFile(path.join(directory, "palm/landscape-day.png"));
const treeMask = Buffer.from(
  `<svg width="${width}" height="${height}"><path fill="white" d="M20 70H340V395H20Z M196 254C184 319 153 408 138 454C125 489 115 515 117 530L83 530C102 494 116 466 128 426C149 365 171 291 177 245Z"/></svg>`,
);
await sharp(
  await sharp(original)
    .composite([{ input: treeMask, blend: "dest-in" }])
    .png()
    .toBuffer(),
)
  .extract({ left: 20, top: 70, width: 320, height: 470 })
  .png()
  .toFile(path.join(directory, "palm/tree-day.png"));
const rightMask = Buffer.from(
  `<svg width="${width}" height="${height}"><path fill="white" d="M1760 60H2172V425H1760Z M1955 418H1975L2016 537H1990Z M2069 418H2083L2092 537H2075Z"/></svg>`,
);
await sharp(
  await sharp(original)
    .composite([{ input: rightMask, blend: "dest-in" }])
    .png()
    .toBuffer(),
)
  .extract({ left: 1760, top: 60, width: 412, height: 485 })
  .png()
  .toFile(path.join(directory, "palm/right-trees-day.png"));
for (const name of ["landscape", "tree", "right-trees"]) {
  const { data, info: meta } = await sharp(
    path.join(directory, `palm/${name}-day.png`),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (const theme of ["twilight", "night"]) {
    const graded = Buffer.from(data);
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const channels =
        theme === "night"
          ? [0.22 * r + 0.23 * l, 0.22 * g + 0.34 * l, 0.22 * b + 0.49 * l]
          : [0.9 * r + 0.12 * l, 0.84 * g + 0.1 * l, 0.76 * b + 0.12 * l];
      channels.forEach(
        (v, c) => (graded[i + c] = Math.min(255, Math.round(v))),
      );
    }
    await sharp(graded, { raw: meta })
      .png()
      .toFile(path.join(directory, `palm/${name}-${theme}.png`));
  }
}

for (const name of ["landscape", "tree", "right-trees"]) {
  for (const theme of ["day", "twilight", "night"]) {
    await sharp(path.join(directory, `palm/${name}-${theme}.png`))
      .webp({ quality: 95, alphaQuality: 100 })
      .toFile(path.join(directory, `palm/${name}-${theme}.webp`));
    await unlink(path.join(directory, `palm/${name}-${theme}.png`));
  }
}

const revision = createHash("sha256");
for (const layer of ["landscape", "tree", "right-trees"]) {
  for (const theme of ["day", "twilight", "night"]) {
    revision.update(
      await readFile(path.join(directory, `palm/${layer}-${theme}.webp`)),
    );
  }
}
await writeFile(
  path.resolve(import.meta.dirname, "../data/palm-assets.json"),
  JSON.stringify({ revision: revision.digest("hex").slice(0, 16) }, null, 2) +
    "\n",
);
