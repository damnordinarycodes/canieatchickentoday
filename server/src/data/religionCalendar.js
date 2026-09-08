// Religion/community view of the calendar. Unlike the state view, this reads
// the doc's own "Coverage" note literally:
//   - Jains are vegetarian year-round (every day, not just festival dates).
//   - Muslims and most Christians have no weekly meat taboo; Christians
//     abstain on Ash Wednesday, Good Friday and (for many) Fridays in Lent.
// So each religion gets its own rule set instead of just filtering the
// state-based occasions list by a `religions` tag.
import { occasions } from "./occasions.js";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HINDU_WEEKLY_PATTERN = ["Tuesday", "Thursday", "Saturday"];

export const RELIGIONS = ["hindu", "jain", "sikh", "muslim", "christian"];
export const RELIGION_LABELS = {
  hindu: "Hindu",
  jain: "Jain",
  sikh: "Sikh / Punjabi",
  muslim: "Muslim",
  christian: "Christian",
};

function weekdayOf(dateStr) {
  return WEEKDAYS[new Date(`${dateStr}T00:00:00`).getDay()];
}

function findMatches(dateStr, religion) {
  const matches = [];
  for (const occ of occasions) {
    const hit = occ.ranges.find((r) => dateStr >= r.start && dateStr <= r.end);
    if (!hit) continue;
    const religions = occ.religions || [];
    // A civic/national closure (no religion tag at all — Gandhi Jayanti,
    // Martyrs' Day) applies to everyone. But a ban driven by a *specific*
    // community's festival (Mahavir Jayanti, Paryushan) only belongs on
    // that community's calendar — even though the shops really are shut,
    // it isn't this religion's holiday, so it's left off other views.
    const isCivic = occ.severity === "ban" && religions.length === 0;
    if (isCivic || religions.includes(religion)) {
      matches.push({ occ, hit });
    }
  }
  return matches;
}

// Ash Wednesday marks the start of Lent and Good Friday its end (both dated
// in occasions.js) — every Friday in between is a traditional meat-free day
// for many Catholics, on top of the two anchor dates themselves.
function isLentenFriday(dateStr, weekday) {
  if (weekday !== "Friday") return false;
  const ash = occasions.find((o) => o.key === "ash_wednesday");
  const good = occasions.find((o) => o.key === "good_friday");
  return ash.ranges.some((r, i) => {
    const end = good.ranges[i]?.start;
    return end && dateStr > r.start && dateStr < end;
  });
}

export function computeReligionDayInfo(religion, dateStr) {
  const weekday = weekdayOf(dateStr);

  if (religion === "jain") {
    return {
      date: dateStr,
      weekday,
      status: "restricted",
      occasion: "Lifelong vegetarianism",
      description: "Jains observe vegetarianism every day of the year, not just on specific festival dates.",
    };
  }

  const matches = findMatches(dateStr, religion);
  const ban = matches.find((m) => m.occ.severity === "ban");
  const custom = matches.find((m) => m.occ.severity === "custom");
  const primary = ban || custom;

  if (primary) {
    return {
      date: dateStr,
      weekday,
      status: ban ? "restricted" : "special",
      occasion: primary.occ.name + (primary.hit.approx ? " (approx. date)" : ""),
      description: primary.occ.note,
    };
  }

  if (religion === "christian" && isLentenFriday(dateStr, weekday)) {
    return {
      date: dateStr,
      weekday,
      status: "special",
      occasion: "Lenten Friday",
      description: "Many Catholics abstain from meat on Fridays during Lent.",
    };
  }

  if (religion === "hindu" && HINDU_WEEKLY_PATTERN.includes(weekday)) {
    return {
      date: dateStr,
      weekday,
      status: "special",
      occasion: "Weekly custom",
      description: `${weekday} is a widely observed no-meat day for many Hindu households.`,
    };
  }

  if (religion === "muslim") {
    return {
      date: dateStr,
      weekday,
      status: "allowed",
      occasion: null,
      description: "No dietary restriction on chicken in mainstream Islamic practice — no weekly meat taboo.",
    };
  }

  return {
    date: dateStr,
    weekday,
    status: "allowed",
    occasion: null,
    description: `No widely observed ${RELIGION_LABELS[religion] || ""} restriction today.`.replace("  ", " "),
  };
}
