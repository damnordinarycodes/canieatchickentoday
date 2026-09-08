// Default calendar/tradition for the MVP: a single, India-wide view built from
// the broadly-observed entries in occasions.js (nationwide, observed by 15+
// states/UTs, or individually flagged `prominent` for festivals whose public
// visibility is much bigger than their "official" state list — e.g. Ganesh
// Chaturthi) plus a commonly-cited weekly pattern. This is deliberately NOT
// "every religious day means no chicken" — regional-only occasions are left out
// of this default view so it doesn't overclaim. Additional calendars/traditions
// (region-specific, per-state, per-community) can be added as sibling modules
// later and selected via a `tradition` query param.
import { occasions } from "./occasions.js";

const WEEKLY_PATTERN = ["Tuesday", "Thursday", "Saturday"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const broadOccasions = occasions.filter(
  (o) => o.states === "ALL" || o.prominent || (Array.isArray(o.states) && o.states.length >= 15)
);

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function findOccasion(dateStr) {
  for (const occ of broadOccasions) {
    const hit = occ.ranges.find((r) => dateStr >= r.start && dateStr <= r.end);
    if (hit) return { occ, approx: !!hit.approx };
  }
  return null;
}

export function computeDayInfo(dateStr) {
  const weekday = WEEKDAYS[new Date(`${dateStr}T00:00:00`).getDay()];
  const found = findOccasion(dateStr);

  if (found && found.occ.severity === "ban") {
    return {
      date: dateStr,
      weekday,
      status: "restricted",
      occasion: found.occ.name,
      description: found.occ.note + (found.approx ? " (approx. date)" : ""),
    };
  }

  if (found) {
    return {
      date: dateStr,
      weekday,
      status: "special",
      occasion: found.occ.name,
      description: found.occ.note + (found.approx ? " (approx. date)" : ""),
    };
  }

  if (WEEKLY_PATTERN.includes(weekday)) {
    return {
      date: dateStr,
      weekday,
      status: "special",
      occasion: "Weekly custom",
      description: `${weekday} is a widely observed no-meat day for many households, according to the default calendar.`,
    };
  }

  return {
    date: dateStr,
    weekday,
    status: "allowed",
    occasion: null,
    description: "No widely observed religious restriction today, according to the default calendar.",
  };
}

export function buildDefaultCalendar(startISO = "2026-01-01", endISO = "2027-12-31") {
  const days = [];
  const cur = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  while (cur <= end) {
    days.push(computeDayInfo(toISO(cur)));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}
