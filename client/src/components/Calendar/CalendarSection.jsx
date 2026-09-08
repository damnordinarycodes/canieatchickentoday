import { useState } from "react";
import { motion } from "framer-motion";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import { useMonthDays } from "../../hooks/useMonthDays";
import { parseISODate } from "../../utils/date";

const LEGEND = [
  { dot: "bg-muted-green", label: "Chicken day" },
  { dot: "bg-soft-orange", label: "Maybe / weekly custom" },
  { dot: "bg-accent-red", label: "Not today" },
];

export default function CalendarSection({ selectedDate, state, religion, region, onSelect }) {
  const initial = parseISODate(selectedDate);
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() + 1 });
  const { days, loading } = useMonthDays(view.year, view.month, state, religion, region);

  const goPrev = () =>
    setView((v) => (v.month === 1 ? { year: v.year - 1, month: 12 } : { year: v.year, month: v.month - 1 }));
  const goNext = () =>
    setView((v) => (v.month === 12 ? { year: v.year + 1, month: 1 } : { year: v.year, month: v.month + 1 }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass rounded-3xl p-4 shadow-[0_20px_50px_-25px_rgba(38,34,29,0.25)] sm:p-6 lg:p-8"
    >
      <CalendarHeader
        year={view.year}
        month={view.month}
        state={state}
        religion={religion}
        region={region}
        onPrev={goPrev}
        onNext={goNext}
      />
      <CalendarGrid
        year={view.year}
        month={view.month}
        days={days}
        selectedDate={selectedDate}
        onSelect={onSelect}
        loading={loading}
      />
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-charcoal-soft sm:mt-6 sm:gap-x-6 sm:text-xs">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
            {l.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
