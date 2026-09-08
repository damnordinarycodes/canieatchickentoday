// Central mapping for the three calendar statuses so every component agrees
// on labels/colors instead of re-deriving them.
export const STATUS_META = {
  allowed: {
    label: "CHICKEN DAY",
    shortLabel: "Chicken day",
    dot: "🟢",
    dotClass: "bg-muted-green",
    textClass: "text-muted-green-dark",
    ringClass: "ring-muted-green",
    approvedTooltip: "🐔 Chicken approved!",
  },
  special: {
    label: "MAYBE TODAY",
    shortLabel: "Maybe today",
    dot: "🟡",
    dotClass: "bg-soft-orange",
    textClass: "text-soft-orange-dark",
    ringClass: "ring-soft-orange",
    approvedTooltip: "🐔 Maybe save me for another day!",
  },
  restricted: {
    label: "NOT TODAY",
    shortLabel: "Not today",
    dot: "🔴",
    dotClass: "bg-accent-red",
    textClass: "text-accent-red-dark",
    ringClass: "ring-accent-red",
    approvedTooltip: "🐔 Maybe save me for another day!",
  },
};

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.allowed;
}
