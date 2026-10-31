"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="status-page">
      <h1 className="home-title">Couldn’t load this page</h1>
      <p>Please try again, or return to the homepage.</p>
      <div className="status-actions">
        <button type="button" className="retry-button" onClick={reset}>
          Try again
        </button>
        <Link href="/">Home</Link>
      </div>
    </section>
  );
}
