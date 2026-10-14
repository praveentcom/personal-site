import { getImageProps } from "next/image";
import { Link } from "@avgeek/ds-web/base/link";
import { Typography } from "@avgeek/ds-web/base/typography";
import { PalmScenery } from "@/components/palm-scenery";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ReactNode } from "react";

export function ApplicationRuntime({ children }: { children: ReactNode }) {
  const imageProps = (src: string, width: number, height: number) =>
    getImageProps({
      src,
      width,
      height,
      alt: "",
      sizes: "100vw",
      quality: 95,
      loading: "eager",
    }).props;
  const scenery = [
    {
      theme: "light",
      mobile: "mobile-fields",
      tablet: "tablet-pastel",
      desktop: "desktop-pastel",
    },
    {
      theme: "dark",
      mobile: "mobile-night",
      tablet: "tablet-night-clean",
      desktop: "desktop-night-clean",
    },
    {
      theme: "dusk",
      mobile: "mobile-dusk",
      tablet: "tablet-dusk-clean",
      desktop: "desktop-dusk-clean",
    },
  ].map(({ theme, mobile, tablet, desktop }) => ({
    theme,
    mobile: imageProps(
      `/images/covers/coimbatore-farm-${mobile}.png`,
      1536,
      1024,
    ),
    tablet: imageProps(
      `/images/covers/coimbatore-farm-${tablet}.png`,
      1536,
      1024,
    ),
    desktop: imageProps(
      `/images/covers/coimbatore-farm-${desktop}.png`,
      2172,
      724,
    ),
  }));
  return (
    <div className="site-shell">
      <div className="personal-site">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-actions">
            <a
              href="/blog/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="Subscribe via RSS"
            >
              Subscribe via RSS
            </a>
            <ThemeToggle />
          </div>
          <Typography.Paragraph
            color="muted"
            size="sm"
            className="footer-contact"
          >
            You can find me on{" "}
            <Link href="https://github.com/praveentcom">GitHub</Link> and{" "}
            <Link href="https://x.com/praveentcom">X</Link>, or{" "}
            <Link href="mailto:mail@praveent.com">send an email</Link>.
          </Typography.Paragraph>
        </footer>
      </div>
      <div className="site-cover" aria-hidden="true">
        <PalmScenery />
        {scenery.map(({ theme, mobile, tablet, desktop }) => (
          <picture key={theme} className={`scenery-${theme}`}>
            <source
              media="(max-width: 639px)"
              srcSet={mobile.srcSet}
              sizes="100vw"
              width={1536}
              height={1024}
            />
            <source
              media="(max-width: 1279px)"
              srcSet={tablet.srcSet}
              sizes="100vw"
              width={1536}
              height={1024}
            />
            {/* Native img is required for picture art direction; sources are optimized by Next. */}
            <img {...desktop} alt="" draggable={false} />
          </picture>
        ))}
      </div>
    </div>
  );
}
