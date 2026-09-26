# Praveen’s personal website

Personal website and blog built with Next.js and local MDX.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
pnpm verify
pnpm build
```

Private dependencies require GitHub Packages and Hugeicons credentials in your
user npm configuration, plus `HEROUI_AUTH_TOKEN` during installation.

Creations are listed in `data/creations.ts` with a name, URL, and optional logo path.

## Writing

Add `content/blog/<slug>/index.mdx`; its URL is `/blog/<slug>`. Frontmatter needs
`title`, `description`, `date` (`YYYY-MM-DD`), and `tags`; optional `emoji` appears in the list and article header. Use `published: false`
or `private: true` to exclude a post from public pages and feeds.

Blog bodies use the design system Markdown renderer. Use standard Markdown in the
MDX files, including fenced code blocks. Store images in `public/images/blog/`
and reference them as `![Description](/images/blog/example.png)`.

Keep shared logos and social images in `public/images/`. Content and assets are
committed and deployed together.

Towbar deployment settings live in `.towbar/deployment.yml`.
