export const RELIGION_LABELS = {
  hindu: "Hindu",
  jain: "Jain",
  sikh: "Sikh / Punjabi",
  muslim: "Muslim",
  christian: "Christian",
};

// Single label to show wherever the UI needs to say "what lens are we
// looking through right now" — a religion, a state, or the default.
export function scopeLabel({ state, religion }) {
  if (religion) return RELIGION_LABELS[religion] || religion;
  if (state) return state;
  return "All India";
}
