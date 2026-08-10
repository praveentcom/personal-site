import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFESTS_DIR = path.join(ROOT, "manifests");
const CDN_BASE_URL = "https://cdn.praveent.com";
const ARTICLE_SEGMENT = "articles";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/cover",
  `/${ARTICLE_SEGMENT}`,
  "/community",
  "/apps",
  "/work",
  "/education",
  "/feed.xml",
  "/sitemap.xml",
];

const CONTENT_EXTENSIONS = new Set([".json", ".mdx"]);
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".json",
  ".mdx",
  ".png",
  ".svg",
  ".webp",
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function getAllFiles(dir, extensions = new Set([".mdx"])) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, extensions));
      continue;
    }

    if (extensions.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function relativeKey(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function publicUrlFor(key) {
  return `${CDN_BASE_URL}/${key}`;
}

function stripExt(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function parseMdxFile(filePath) {
  const raw = readFile(filePath);
  const { data, content } = matter(raw);
  return { raw, data, content };
}

function checksumFor(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function sortByDateDesc(items, field = "date") {
  return [...items].sort((a, b) => {
    const aTime = a[field] ? new Date(a[field]).getTime() : 0;
    const bTime = b[field] ? new Date(b[field]).getTime() : 0;
    return bTime - aTime;
  });
}

function articleManifest(now) {
  const files = getAllFiles(path.join(ROOT, "articles"));
  const items = files.map((filePath) => {
    const { data, content } = parseMdxFile(filePath);
    const year = path.basename(path.dirname(filePath));
    const slug = data.slug || stripExt(filePath);
    const key = relativeKey(filePath);

    return {
      slug,
      year,
      objectKey: key,
      publicUrl: publicUrlFor(key),
      urlPath: `/${ARTICLE_SEGMENT}/${year}/${slug}`,
      title: data.title ?? null,
      description: data.description ?? null,
      date: data.date ?? null,
      tags: data.tags ?? [],
      categories: data.categories ?? [],
      published: data.published ?? true,
      private: data.private ?? false,
      image: data.image ?? null,
      ogImage: data.ogImage ?? null,
      readTime: estimateReadTime(content),
    };
  });

  return {
    collection: "articles",
    generatedAt: now,
    count: items.length,
    items: sortByDateDesc(items),
  };
}

function communityManifest(now) {
  const introPath = path.join(ROOT, "community", "intro.mdx");
  const intro = fs.existsSync(introPath)
    ? {
        objectKey: relativeKey(introPath),
        publicUrl: publicUrlFor(relativeKey(introPath)),
        urlPath: "/community",
      }
    : null;

  const files = getAllFiles(path.join(ROOT, "community", "posts"));
  const items = files.map((filePath) => {
    const { data } = parseMdxFile(filePath);
    const year = path.basename(path.dirname(filePath));
    const slug = data.slug || stripExt(filePath);
    const key = relativeKey(filePath);

    return {
      slug,
      year,
      objectKey: key,
      publicUrl: publicUrlFor(key),
      urlPath: `/community/${year}/${slug}`,
      title: data.title ?? null,
      description: data.description ?? null,
      date: data.date ?? null,
      published: data.published ?? true,
      image: data.image ?? null,
      ogImage: data.ogImage ?? null,
      youtubeUrl: data.youtubeUrl ?? null,
      externalLinks: data.externalLinks ?? [],
      type: data.type ?? null,
      event: data.event ?? null,
    };
  });

  return {
    collection: "community",
    generatedAt: now,
    intro,
    count: items.length,
    items: sortByDateDesc(items),
  };
}

function appsManifest(now) {
  const files = getAllFiles(path.join(ROOT, "apps"));
  const items = files.map((filePath) => {
    const { data } = parseMdxFile(filePath);
    const year = path.basename(path.dirname(filePath));
    const slug = data.slug || stripExt(filePath);
    const key = relativeKey(filePath);

    return {
      slug,
      year,
      objectKey: key,
      publicUrl: publicUrlFor(key),
      urlPath: `/apps/${slug}`,
      title: data.title ?? null,
      shortDescription: data.shortDescription ?? null,
      description: data.description ?? null,
      date: data.date ?? null,
      stack: data.stack ?? [],
      image: data.image ?? null,
      ogImage: data.ogImage ?? null,
      url: data.url ?? null,
      githubUrl: data.githubUrl ?? null,
      appStoreUrl: data.appStoreUrl ?? null,
      coAuthors: data.coAuthors ?? [],
    };
  });

  return {
    collection: "apps",
    generatedAt: now,
    count: items.length,
    items: sortByDateDesc(items),
  };
}

function workManifest(now) {
  const files = getAllFiles(path.join(ROOT, "work"));
  const items = files.map((filePath) => {
    const { data } = parseMdxFile(filePath);
    const year = path.basename(path.dirname(filePath));
    const slug = data.slug || stripExt(filePath);
    const key = relativeKey(filePath);

    return {
      slug,
      year,
      objectKey: key,
      publicUrl: publicUrlFor(key),
      urlPath: `/work/${slug}`,
      role: data.role ?? null,
      company: data.company ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      skills: data.skills ?? [],
      image: data.image ?? null,
      ogImage: data.ogImage ?? null,
    };
  });

  return {
    collection: "work",
    generatedAt: now,
    count: items.length,
    items: sortByDateDesc(items, "startDate"),
  };
}

function educationManifest(now) {
  const files = getAllFiles(path.join(ROOT, "education"));
  const items = files.map((filePath) => {
    const { data } = parseMdxFile(filePath);
    const year = path.basename(path.dirname(filePath));
    const slug = data.slug || stripExt(filePath);
    const key = relativeKey(filePath);

    return {
      slug,
      year,
      objectKey: key,
      publicUrl: publicUrlFor(key),
      urlPath: `/education/${slug}`,
      degree: data.degree ?? null,
      school: data.school ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      image: data.image ?? null,
      ogImage: data.ogImage ?? null,
    };
  });

  return {
    collection: "education",
    generatedAt: now,
    count: items.length,
    items: sortByDateDesc(items, "startDate"),
  };
}

function profileManifest(now) {
  const names = ["about", "cover", "intro"];
  const routeMap = {
    about: "/about",
    cover: "/cover",
    intro: "/",
  };

  const items = names
    .map((name) => path.join(ROOT, "profile", `${name}.mdx`))
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const name = stripExt(filePath);
      const key = relativeKey(filePath);

      return {
        name,
        objectKey: key,
        publicUrl: publicUrlFor(key),
        urlPath: routeMap[name] ?? null,
      };
    });

  return {
    collection: "profile",
    generatedAt: now,
    count: items.length,
    items,
  };
}

function dedupeSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function sitemapManifest(now, manifests) {
  const articles = manifests.articles.items.filter(
    (item) => item.published && !item.private,
  );
  const community = manifests.community.items.filter((item) => item.published);
  const apps = manifests.apps.items;
  const work = manifests.work.items;
  const education = manifests.education.items;

  const articleYears = dedupeSorted(articles.map((item) => item.year));
  const articleTags = dedupeSorted(articles.flatMap((item) => item.tags));
  const articleCategories = dedupeSorted(
    articles.flatMap((item) => item.categories),
  );
  const communityYears = dedupeSorted(community.map((item) => item.year));
  const communityTypes = dedupeSorted(community.map((item) => item.type));
  const appStacks = dedupeSorted(apps.flatMap((item) => item.stack));

  const routes = [
    ...STATIC_ROUTES.map((pathName) => ({
      path: pathName,
      source: "static",
    })),
    ...articles.map((item) => ({
      path: item.urlPath,
      source: "articles",
      lastModified: item.date ?? null,
    })),
    ...articleYears.map((year) => ({
      path: `/${ARTICLE_SEGMENT}/${year}`,
      source: "article-years",
    })),
    ...articleTags.map((tag) => ({
      path: `/${ARTICLE_SEGMENT}/tag/${encodeURIComponent(tag)}`,
      source: "article-tags",
    })),
    ...articleCategories.map((category) => ({
      path: `/${ARTICLE_SEGMENT}/category/${encodeURIComponent(category)}`,
      source: "article-categories",
    })),
    ...community.map((item) => ({
      path: item.urlPath,
      source: "community",
      lastModified: item.date ?? null,
    })),
    ...communityYears.map((year) => ({
      path: `/community/${year}`,
      source: "community-years",
    })),
    ...communityTypes.map((type) => ({
      path: `/community/contributions/${encodeURIComponent(type)}`,
      source: "community-types",
    })),
    ...apps.map((item) => ({
      path: item.urlPath,
      source: "apps",
      lastModified: item.date ?? null,
    })),
    ...appStacks.map((tag) => ({
      path: `/apps/stack/${encodeURIComponent(tag)}`,
      source: "app-stacks",
    })),
    ...work.map((item) => ({
      path: item.urlPath,
      source: "work",
      lastModified: item.startDate ?? null,
    })),
    ...education.map((item) => ({
      path: item.urlPath,
      source: "education",
      lastModified: item.startDate ?? null,
    })),
  ];

  return {
    collection: "sitemap",
    generatedAt: now,
    count: routes.length,
    routes,
  };
}

function uploadManifest(now) {
  const managedRootConfigs = [
    { root: "apps", extensions: CONTENT_EXTENSIONS },
    { root: "articles", extensions: CONTENT_EXTENSIONS },
    { root: "community", extensions: CONTENT_EXTENSIONS },
    { root: "education", extensions: CONTENT_EXTENSIONS },
    { root: "images", extensions: IMAGE_EXTENSIONS },
    { root: "profile", extensions: CONTENT_EXTENSIONS },
    { root: "work", extensions: CONTENT_EXTENSIONS },
    { root: "manifests", extensions: CONTENT_EXTENSIONS },
  ];

  const managedFiles = [
    ...new Set([
      ...managedRootConfigs.flatMap(({ root, extensions }) =>
        getAllFiles(path.join(ROOT, root), extensions),
      ),
      path.join(MANIFESTS_DIR, "upload-manifest.json"),
    ]),
  ]
    .sort()
    .map((filePath) => {
      const key = relativeKey(filePath);
      const exists = fs.existsSync(filePath);

      return {
        key,
        checksum: exists ? checksumFor(filePath) : null,
        size: exists ? fs.statSync(filePath).size : 0,
      };
    });

  return {
    generatedAt: now,
    managedRoots: managedRootConfigs.map(({ root }) => root),
    managedKeys: managedFiles.map((file) => file.key),
    managedFiles,
  };
}

function main() {
  ensureDir(MANIFESTS_DIR);

  const now = new Date().toISOString();
  const manifests = {
    articles: articleManifest(now),
    apps: appsManifest(now),
    community: communityManifest(now),
    education: educationManifest(now),
    profile: profileManifest(now),
    work: workManifest(now),
  };

  manifests.sitemap = sitemapManifest(now, manifests);

  writeJson(path.join(MANIFESTS_DIR, "articles.json"), manifests.articles);
  writeJson(path.join(MANIFESTS_DIR, "apps.json"), manifests.apps);
  writeJson(path.join(MANIFESTS_DIR, "community.json"), manifests.community);
  writeJson(path.join(MANIFESTS_DIR, "education.json"), manifests.education);
  writeJson(path.join(MANIFESTS_DIR, "profile.json"), manifests.profile);
  writeJson(path.join(MANIFESTS_DIR, "work.json"), manifests.work);
  writeJson(path.join(MANIFESTS_DIR, "sitemap.json"), manifests.sitemap);

  const indexManifest = {
    generatedAt: now,
    manifests: [
      "articles.json",
      "apps.json",
      "community.json",
      "education.json",
      "profile.json",
      "work.json",
      "sitemap.json",
      "upload-manifest.json",
    ],
  };
  writeJson(path.join(MANIFESTS_DIR, "index.json"), indexManifest);
  writeJson(
    path.join(MANIFESTS_DIR, "upload-manifest.json"),
    uploadManifest(now),
  );
}

main();
