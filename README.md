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
default build command and output directory. The repo specifies Node 26 and pnpm 12.

Set these project environment variables in Vercel:

| Variable                       | Value                      | Environment |
| ------------------------------ | -------------------------- | ----------- |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`                        | All         |
| `NEXT_PUBLIC_BASE_URL`         | `https://www.praveent.com` | Production  |
| `NEXT_PUBLIC_ALLOW_ROBOTS`     | `true`                     | Production  |

[Corepack](https://vercel.com/docs/builds/configure-a-build#corepack) makes Vercel
use the pnpm version declared in `package.json`. Leave `NEXT_PUBLIC_ALLOW_ROBOTS`
unset in Preview and Development so those builds block crawlers. Public settings
are read at build time. For local overrides, copy `.env.example` to `.env.local`.
