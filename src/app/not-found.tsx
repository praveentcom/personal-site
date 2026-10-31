import Link from "next/link";

export default function NotFound() {
  return (
    <section className="status-page">
      <p className="status-code">404</p>
      <h1 className="home-title">Page not found</h1>
      <p>This page may have moved, or the link may be incorrect.</p>
      <Link href="/">Back to Praveen’s homepage</Link>
    </section>
  );
}
