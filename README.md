# Personal site

[praveent.com](https://www.praveent.com), built with Next.js and local Markdown posts.

## Development

Use Node 26 and pnpm 12 (`npm install --global pnpm@12.16.1`).

```sh
pnpm install
pnpm dev
```

Open [localhost:8001](http://localhost:8001). Run `pnpm verify` before committing
and `pnpm build` to check the production build.

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

## Production

```sh
docker build -t personal-site \
  --build-arg NEXT_PUBLIC_BASE_URL=https://www.praveent.com \
  --build-arg NEXT_PUBLIC_ALLOW_ROBOTS=true .
docker run --rm -p 3000:3000 personal-site
```

`/api/health` reports readiness. Previews block crawlers by default; enable
`NEXT_PUBLIC_ALLOW_ROBOTS` only for production. These public settings are read
at build time. For local overrides, copy `.env.example` to `.env.local`.
