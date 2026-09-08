import { Link } from "../../router";

export default function ConsentBanner({ visible, onDismiss }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="glass mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl p-4 text-center shadow-[0_20px_50px_-15px_rgba(38,34,29,0.35)] sm:flex-row sm:justify-between sm:rounded-3xl sm:p-5 sm:text-left">
        <p className="text-xs leading-relaxed text-charcoal-soft sm:text-sm">
          No tracking cookies here — just a small saved preference in your browser. Location is only used if you
          tap "Use my location," and only to estimate a broad region. See the{" "}
          <Link href="/privacy" className="font-semibold text-charcoal underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 whitespace-nowrap rounded-full bg-charcoal px-5 py-2 text-xs font-bold text-warm-white transition-transform hover:scale-105 active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
