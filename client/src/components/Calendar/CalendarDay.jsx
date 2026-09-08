import { motion } from "framer-motion";
import { statusMeta } from "../../utils/status";

export default function CalendarDay({ day, isSelected, isToday, onSelect }) {
  const meta = statusMeta(day.status);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(day.date)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      title={day.occasion || meta.shortLabel}
      className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border text-xs font-semibold transition-colors sm:gap-1 sm:rounded-2xl sm:text-sm ${
        isSelected
          ? `border-transparent bg-charcoal text-warm-white shadow-lg shadow-charcoal/20`
          : "border-black/5 bg-warm-white/70 text-charcoal hover:bg-warm-white"
      }`}
    >
      {isToday && !isSelected && (
        <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-soft-orange" />
      )}
      <span>{Number(day.date.slice(-2))}</span>
      <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-warm-white" : meta.dotClass}`} />
    </motion.button>
  );
}
