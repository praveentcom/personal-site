# Personal site

[praveent.com](https://www.praveent.com), built with Next.js and local Markdown posts.

## Development

Use Node 26 and pnpm 12 (`npm install --global pnpm@12.16.1`).

```sh
pnpm install
pnpm dev
```

Open [localhost:8001](http://localhost:8001). Run `pnpm verify` for formatting,
lint, and TypeScript checks, and `pnpm build` to check the production build.

Site details live in `src/lib/site.ts`; styles live in `src/app/globals.css`.

## Writing

Add `content/blog/<slug>/index.mdx` with standard Markdown and frontmatter:

```md
---
title: My post
description: A short summary.
date: "2026-11-01"
tags: [software]
---

Post content.
```

The post appears at `/blog/<slug>`. Set `published: false` or `private: true` to
exclude it from pages, feeds, and lookups. Optional `emoji` appears beside the
title. Store images in `public/images/blog/` and reference their `/images/blog/`
paths. Markdown supports tables, task lists, syntax highlighting, and copyable
code blocks; JSX is not supported.

## Deployment

Import `praveentcom/personal-site` into Vercel with the Next.js preset. Keep the
default build command and output directory. Vercel detects the Node and pnpm
versions declared in `package.json`.

No custom environment variables are needed for `https://www.praveent.com`.
Crawling is enabled for Vercel Production deployments and blocked for Preview,
Development, and local builds using Vercel's automatic `VERCEL_ENV` value.

To use another domain, set `NEXT_PUBLIC_BASE_URL` before building. For local
overrides, copy `.env.example` to `.env.local`.
