import CalendarDay from "./CalendarDay";
import { mondayIndex, todayISO } from "../../utils/date";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid({ year, month, days, selectedDate, onSelect, loading }) {
  const firstDay = new Date(year, month - 1, 1);
  const leadingBlanks = mondayIndex(firstDay.getDay());
  const today = todayISO();

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-charcoal-soft/70 sm:gap-2 sm:text-xs">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {loading
          ? Array.from({ length: days.length || 28 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="aspect-square animate-pulse rounded-xl bg-warm-white/60 sm:rounded-2xl" />
            ))
          : days.map((day) => (
              <CalendarDay
                key={day.date}
                day={day}
                isSelected={day.date === selectedDate}
                isToday={day.date === today}
                onSelect={onSelect}
              />
            ))}
      </div>
    </div>
  );
}
