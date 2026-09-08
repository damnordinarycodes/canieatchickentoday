import { useState } from "react";
import { fetchRegionFromCoords } from "../../api";

const REGIONS = [
  { value: "north", label: "North India" },
  { value: "south", label: "South India" },
  { value: "east", label: "East India" },
  { value: "west", label: "West India" },
];

export default function RegionSelector({ region, onChange }) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [approximate, setApproximate] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported in this browser.");
      return;
    }
    setError("");
    setApproximate(false);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const result = await fetchRegionFromCoords(coords.latitude, coords.longitude);
          onChange(result.region);
          setApproximate(!!result.approximate);
        } catch (err) {
          setError(err.message || "Couldn't determine your region.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="glass flex min-w-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm">
        <span className="shrink-0 text-base">🧭</span>
        <span className="hidden shrink-0 font-semibold text-charcoal-soft sm:inline">Region</span>
        <select
          value={region}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 flex-1 truncate bg-transparent font-semibold text-charcoal outline-none"
        >
          <option value="">All India (default)</option>
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="shrink-0 whitespace-nowrap rounded-full bg-charcoal/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal-soft transition-colors hover:bg-charcoal/10 disabled:opacity-50"
        >
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>
      {error && <p className="px-1 text-xs text-accent-red-dark">{error}</p>}
      {!error && approximate && (
        <p className="px-1 text-xs text-charcoal-soft/80">Estimated from your coordinates (precise lookup was unavailable).</p>
      )}
    </div>
  );
}
