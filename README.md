# Praveen Website

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

## Writing

Add `content/blog/<slug>/index.mdx`; its URL is `/blog/<slug>`. Frontmatter needs
`title`, `description`, `date` (`YYYY-MM-DD`), and `tags`. Use `published: false`
or `private: true` to exclude a post from public pages and feeds.

Keep article images beside the MDX file and import them with Next Image:

```mdx
import Image from "next/image";
import diagram from "./diagram.png";

<Image
  src={diagram}
  alt="Deployment flow"
  sizes="(max-width: 768px) 100vw, 768px"
/>
```

Keep shared logos and social images in `public/images/`. Content and assets are
committed and deployed together; no content upload or CDN synchronization is needed.

Towbar deployment settings live in `.towbar/deployment.yml`. Automatic previews
remain disabled until Towbar invalidates build caches when build secrets change.
