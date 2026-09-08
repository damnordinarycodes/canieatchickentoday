const RELIGIONS = [
  { value: "hindu", label: "Hindu" },
  { value: "jain", label: "Jain" },
  { value: "sikh", label: "Sikh / Punjabi" },
  { value: "muslim", label: "Muslim" },
  { value: "christian", label: "Christian" },
];

export default function ReligionSelector({ religion, onChange }) {
  return (
    <label className="glass flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-4 py-3 text-sm">
      <span className="shrink-0 text-base">🙏</span>
      <span className="hidden shrink-0 font-semibold text-charcoal-soft sm:inline">Religion</span>
      <select
        value={religion}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 flex-1 truncate bg-transparent font-semibold text-charcoal outline-none"
      >
        <option value="">All communities</option>
        {RELIGIONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </label>
  );
}
