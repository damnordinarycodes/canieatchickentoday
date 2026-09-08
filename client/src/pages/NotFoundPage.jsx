import { Link } from "../router";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFoundPage() {
  usePageMeta("Page not found — Chicken Day", "This page doesn't exist.");

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center sm:px-6 sm:py-32">
      <span className="text-6xl">🐔</span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-charcoal">Nothing to see here</h1>
      <p className="mt-3 text-base text-charcoal-soft">
        This page doesn't exist — maybe it wandered off looking for a chicken day.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-bold text-warm-white transition-transform hover:scale-105 active:scale-95"
      >
        Back to Chicken Day
      </Link>
    </section>
  );
}
