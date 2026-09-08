import { AnimatePresence, motion } from "framer-motion";
import { formatLong } from "../../utils/date";
import { statusMeta } from "../../utils/status";
import { scopeLabel } from "../../utils/scope";

export default function TodayStatus({ dateISO, state, religion, dayInfo, loading }) {
  const status = dayInfo?.status || "allowed";
  const meta = statusMeta(status);

  return (
    <div className="glass w-full max-w-md rounded-2xl p-5 shadow-[0_20px_50px_-20px_rgba(38,34,29,0.25)] sm:rounded-3xl sm:p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? "loading" : `${dateISO}-${state}-${religion}-${status}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${meta.dotClass}`} />
              <span className={`text-sm font-bold tracking-wider ${meta.textClass}`}>{meta.label}</span>
            </div>
            <span className="rounded-full bg-charcoal/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal-soft">
              {scopeLabel({ state, religion })}
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-charcoal">{formatLong(dateISO)}</p>
          <p className="mt-1 text-sm text-charcoal-soft">
            {loading
              ? "Checking today's status…"
              : dayInfo?.occasion
                ? `${dayInfo.occasion} — ${dayInfo.description}`
                : dayInfo?.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
