# Praveen’s personal website

Personal website and blog built with Next.js and local MDX.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
pnpm verify
pnpm build
```

Private dependencies require npm read access to the Avgeek organization and Hugeicons credentials in your user npm configuration, plus `HEROUI_AUTH_TOKEN` during installation.

Creations are listed in `data/creations.ts` with a name, URL, GitHub repository, and
optional logo path. Star counts come from the GitHub API and refresh hourly.

## Writing

Add `content/blog/<slug>/index.mdx`; its URL is `/blog/<slug>`. Frontmatter needs
`title`, `description`, `date` (`YYYY-MM-DD`), and `tags`; optional `emoji` appears in the list and article header. Use `published: false`
or `private: true` to exclude a post from public pages and feeds.

Blog bodies use the design system Markdown renderer. Use standard Markdown in the
MDX files, including fenced code blocks. Store images in `public/images/blog/`
and reference them as `![Description](/images/blog/example.png)`.

Keep shared logos and social images in `public/images/`. Content and assets are
committed and deployed together.

## Deployment

`towbar.yml` declares the production environment. The website settings live in
`.towbar/services/website.service.yml` and target the Praveen Apps server.
Builds run on the larger Platform Services server so they do not compete with the
website for memory.

Set the declared build secrets in Towbar before deploying. Use
`NEXT_PUBLIC_BASE_URL=https://www.praveent.com`, `NEXT_PUBLIC_ALLOW_ROBOTS=true`,
`NEXT_PUBLIC_TOWBAR_ANALYTICS=true`. Private dependency
credentials are passed through Docker build secrets and are not stored in the image.

Towbar collects request and pageview analytics for 30 days. The production page
template loads the same-origin tracking script. Random browser identifiers enable
visitor counts, bounce rate, and exit pages; health checks are excluded.
Scout Agent on the Praveen Apps server provides CPU, memory, disk, and network
monitoring in Towbar.

Next.js configuration, robots rules, and `/api/health` are owned by this app.
Theme persistence uses `next-themes` with the existing `workspace-ui-theme` key;
day/twilight/night scenery keeps its separate light-period preference. The site uses the private npm package `@avgeek/ds-web`; configure npm read access for the Avgeek organization. Runtime Web is not required.
