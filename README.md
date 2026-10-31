# Praveen’s personal website

Personal website and blog built with Next.js and local MDX.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
pnpm verify
pnpm build
```

Requires Node.js 24 or later and pnpm. All dependencies install from public npm
packages without registry tokens or UI licenses.

Creations are listed in `data/creations.ts` with a name, URL, GitHub repository, and
optional logo path. Star counts come from the GitHub API and refresh hourly.

## Writing

Add `content/blog/<slug>/index.mdx`; its URL is `/blog/<slug>`. Frontmatter needs
`title`, `description`, `date` (`YYYY-MM-DD`), and `tags`; optional `emoji` appears in the list and article header. Use `published: false`
or `private: true` to exclude a post from public pages and feeds.

Blog bodies use the local Markdown renderer, with GitHub-flavored Markdown,
syntax highlighting, and copyable code blocks. Use standard Markdown in the
MDX files, including fenced code blocks. Store images in `public/images/blog/`
and reference them as `![Description](/images/blog/example.png)`.

Keep shared logos and social images in `public/images/`. Content and assets are
committed and deployed together.

## Deployment

The Dockerfile builds a standalone Next.js server. Public build settings can be
passed as Docker build secrets:

```sh
NEXT_PUBLIC_BASE_URL=https://www.praveent.com NEXT_PUBLIC_ALLOW_ROBOTS=true \
  docker build -t personal-site \
  --secret id=NEXT_PUBLIC_BASE_URL,env=NEXT_PUBLIC_BASE_URL \
  --secret id=NEXT_PUBLIC_ALLOW_ROBOTS,env=NEXT_PUBLIC_ALLOW_ROBOTS .
docker run --rm -p 3000:3000 personal-site
```

Use `NEXT_PUBLIC_ALLOW_ROBOTS=false` for previews. `/api/health` reports server
readiness.

Next.js configuration, robots rules, and `/api/health` are owned by this app.
The site has a single twilight appearance owned by `globals.css`. Inter is
self-hosted through the public Fontsource package. The cover scenery is generated from the
pastel sources in `scripts/assets` by `scripts/grade-farm-scenery.mjs` and
`scripts/prepare-palm-layers.mjs`.
