import { Link } from "../router";

export default function LegalPage({ title, updated, children }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="text-sm font-semibold text-charcoal-soft hover:text-charcoal">
        ← Back to Chicken Day
      </Link>
      <div className="glass mt-6 rounded-3xl p-6 shadow-[0_20px_50px_-25px_rgba(38,34,29,0.25)] sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">{title}</h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
          Last updated {updated}
        </p>
        <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-charcoal-soft [&_a]:font-semibold [&_a]:text-charcoal [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-charcoal [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </section>
  );
}
