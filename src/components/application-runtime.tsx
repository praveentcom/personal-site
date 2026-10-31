import { getImageProps } from "next/image";
import { PalmScenery } from "@/components/palm-scenery";
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
  const mobile = imageProps(
    "/images/covers/coimbatore-farm-mobile-dusk.png",
    1536,
    1024,
  );
  const tablet = imageProps(
    "/images/covers/coimbatore-farm-tablet-dusk-clean.png",
    1536,
    1024,
  );
  const desktop = imageProps(
    "/images/covers/coimbatore-farm-desktop-dusk-clean.png",
    2172,
    724,
  );
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
          <a
            href="/blog/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Subscribe via RSS"
          >
            Subscribe via RSS
          </a>
          <p className="footer-contact">
            You can find me on{" "}
            <a href="https://github.com/praveentcom">GitHub</a> and{" "}
            <a href="https://x.com/praveentcom">X</a>, or{" "}
            <a href="mailto:mail@praveent.com">send an email</a>.
          </p>
        </footer>
      </div>
      <div className="site-cover" aria-hidden="true">
        <PalmScenery />
        <picture>
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
      </div>
    </div>
  );
}
