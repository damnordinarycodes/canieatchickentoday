import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTowns } from "../../hooks/useTowns";

export default function TownsSection() {
  const { towns, loading } = useTowns();
  const [open, setOpen] = useState(false);

  if (!loading && towns.length === 0) return null;

  return (
    <motion.section
      id="towns"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-6xl px-5 pb-16 sm:px-6"
    >
      <div className="glass rounded-3xl p-5 shadow-[0_20px_50px_-25px_rgba(38,34,29,0.25)] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-red-dark">
              Always no-chicken zones
            </p>
            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-charcoal sm:text-2xl">
              Some places don't sell chicken on any day
            </h3>
            <p className="mt-1 max-w-xl text-sm text-charcoal-soft">
              In these towns, meat isn't sold at all — not just on specific dates like the rest of this calendar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="glass shrink-0 self-start rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal transition-transform hover:scale-[1.03] active:scale-95 sm:self-auto"
          >
            {open ? "Hide the list ↑" : `Show ${towns.length} towns ↓`}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {towns.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl bg-warm-white/70 p-4"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-red" />
                    <div>
                      <p className="text-sm font-bold text-charcoal">{t.town}</p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft/80">
                        {t.state}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-charcoal-soft">{t.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
