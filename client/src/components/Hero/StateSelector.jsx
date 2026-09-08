import { useStates } from "../../hooks/useStates";

export default function StateSelector({ state, onChange }) {
  const states = useStates();

  return (
    <label className="glass flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-4 py-3 text-sm">
      <span className="shrink-0 text-base">📍</span>
      <span className="hidden shrink-0 font-semibold text-charcoal-soft sm:inline">State / UT</span>
      <select
        value={state}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 flex-1 truncate bg-transparent font-semibold text-charcoal outline-none"
      >
        <option value="">All India (default)</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
}
