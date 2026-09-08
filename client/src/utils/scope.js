export const RELIGION_LABELS = {
  hindu: "Hindu",
  jain: "Jain",
  sikh: "Sikh / Punjabi",
  muslim: "Muslim",
  christian: "Christian",
};

export const REGION_LABELS = {
  north: "North India",
  south: "South India",
  east: "East India",
  west: "West India",
};

// Single label to show wherever the UI needs to say "what lens are we
// looking through right now" — a religion, a region, a state, or the default.
export function scopeLabel({ state, religion, region }) {
  if (religion) return RELIGION_LABELS[religion] || religion;
  if (region) return REGION_LABELS[region] || region;
  if (state) return state;
  return "All India";
}
