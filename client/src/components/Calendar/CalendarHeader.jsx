import { MONTH_NAMES } from "../../utils/date";
import { scopeLabel } from "../../utils/scope";

export default function CalendarHeader({ year, month, state, religion, region, onPrev, onNext }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-extrabold tracking-tight text-charcoal">
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
          {scopeLabel({ state, religion, region })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous month"
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-lg text-charcoal transition-transform hover:scale-105 active:scale-95"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next month"
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-lg text-charcoal transition-transform hover:scale-105 active:scale-95"
        >
          ›
        </button>
      </div>
    </div>
  );
}
