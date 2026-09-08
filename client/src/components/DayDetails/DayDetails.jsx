import { AnimatePresence, motion } from "framer-motion";
import { formatLong } from "../../utils/date";
import { statusMeta } from "../../utils/status";
import { scopeLabel, RELIGION_LABELS, REGION_LABELS } from "../../utils/scope";

function disclaimer({ state, religion, region }) {
  if (religion) {
    return `According to customs commonly associated with the ${RELIGION_LABELS[religion] || religion} community — observed by many people, not a universal rule.`;
  }
  if (region) {
    return `A broad ${REGION_LABELS[region] || region} read based on customs observed by at least half the states in that region — for an exact answer, use the State selector instead.`;
  }
  if (state) {
    return `According to customs commonly observed in ${state} — observed by many people, not a universal rule.`;
  }
  return "According to the default (all-India) calendar — observed by many people, not a universal rule.";
}

export default function DayDetails({ dateISO, state, religion, region, dayInfo, loading }) {
  const status = dayInfo?.status || "allowed";
  const meta = statusMeta(status);

  return (
    <div className="glass flex h-full flex-col justify-center rounded-3xl p-5 shadow-[0_20px_50px_-25px_rgba(38,34,29,0.25)] sm:p-6 lg:p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? "loading" : `${dateISO}-${state}-${religion}-${region}-${status}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{meta.dot}</span>
              <span className={`text-lg font-extrabold tracking-tight ${meta.textClass}`}>{meta.label}</span>
            </div>
            <span className="rounded-full bg-charcoal/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal-soft">
              {scopeLabel({ state, religion, region })}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-charcoal-soft/70">
            {formatLong(dateISO)}
          </p>

          {dayInfo?.occasion && (
            <p className="mt-4 text-xl font-bold text-charcoal">{dayInfo.occasion}</p>
          )}

          <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
            {loading ? "Loading…" : dayInfo?.description}
          </p>

          <p className="mt-5 text-xs italic text-charcoal-soft/60">{disclaimer({ state, religion, region })}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
