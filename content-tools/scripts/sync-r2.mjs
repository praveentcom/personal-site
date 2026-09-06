import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUCKET = process.env.R2_BUCKET_NAME || "praveen-blog";
const UPLOAD_CONCURRENCY = Number.parseInt(
  process.env.R2_UPLOAD_CONCURRENCY || "8",
  10,
);
const PUBLIC_BASE_URL =
  (process.env.R2_PUBLIC_BASE_URL || "https://cdn.praveent.com").replace(
    /\/$/,
    "",
  );

const MANAGED_ROOTS = [
  "apps",
  "articles",
  "community",
  "education",
  "images",
  "profile",
  "work",
  "manifests",
];

function collectManagedFiles() {
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (
        ext === ".mdx" ||
        ext === ".json" ||
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".webp" ||
        ext === ".svg" ||
        ext === ".gif" ||
        ext === ".avif" ||
        ext === ".ico"
      ) {
        files.push(fullPath);
      }
    }
  }

  for (const root of MANAGED_ROOTS) {
    const dir = path.join(ROOT, root);
    if (fs.existsSync(dir)) walk(dir);
  }

  return files.sort().map((filePath) => ({
    filePath,
    objectKey: path.relative(ROOT, filePath).split(path.sep).join("/"),
  }));
}

function checksumFor(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

async function getPreviousManagedKeys() {
  const url = `${PUBLIC_BASE_URL}/manifests/upload-manifest.json`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return {
      managedKeys: Array.isArray(payload.managedKeys) ? payload.managedKeys : [],
      managedFiles: Array.isArray(payload.managedFiles)
        ? payload.managedFiles
        : [],
    };
  } catch {
    return {
      managedKeys: [],
      managedFiles: [],
    };
  }
}

function runWrangler(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["wrangler", ...args], {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`wrangler ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function runWithConcurrency(items, limit, iteratee) {
  const queue = [...items];
  const workers = Array.from({
    length: Math.max(1, Math.min(limit, queue.length || 1)),
  }).map(async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) {
        return;
      }

      await iteratee(item);
    }
  });

  await Promise.all(workers);
}

async function main() {
  if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
    throw new Error(
      "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required.",
    );
  }

  const currentFiles = collectManagedFiles();
  const currentKeys = new Set(currentFiles.map((file) => file.objectKey));
  const previousManifest = await getPreviousManagedKeys();
  const previousChecksums = new Map(
    previousManifest.managedFiles
      .filter((file) => file?.key)
      .map((file) => [file.key, file.checksum ?? null]),
  );
  const staleKeys = previousManifest.managedKeys.filter(
    (key) => !currentKeys.has(key),
  );
  const filesToUpload = currentFiles.filter((file) => {
    const currentChecksum = previousChecksums.get(file.objectKey);

    if (!currentChecksum) {
      return true;
    }

    const nextChecksum = checksumFor(file.filePath);

    return currentChecksum !== nextChecksum;
  });

  await runWithConcurrency(staleKeys, UPLOAD_CONCURRENCY, (key) =>
    runWrangler(["r2", "object", "delete", `${BUCKET}/${key}`, "--remote"]),
  );

  await runWithConcurrency(filesToUpload, UPLOAD_CONCURRENCY, (file) =>
    runWrangler([
      "r2",
      "object",
      "put",
      `${BUCKET}/${file.objectKey}`,
      "--remote",
      "--file",
      file.filePath,
    ]),
  );
}

await main();
