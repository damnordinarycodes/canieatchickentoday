import State from "../models/State.js";
import Occasion from "../models/Occasion.js";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function weekdayOf(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return WEEKDAYS[d.getDay()];
}

function inRange(dateStr, range) {
  return dateStr >= range.start && dateStr <= range.end;
}

export async function checkChicken(stateName, dateStr) {
  const weekday = weekdayOf(dateStr);
  const reasons = [];

  if (stateName) {
    const state = await State.findOne({ name: stateName });
    if (!state) {
      const err = new Error(`Unknown state: ${stateName}`);
      err.status = 400;
      throw err;
    }

    if (state.weeklyDays.includes(weekday)) {
      reasons.push({
        type: "weekly-custom",
        severity: "custom",
        label: `${weekday} is a customary no-meat day in ${stateName}`,
        detail: state.note || undefined,
      });
    }

    const occasions = await Occasion.find({
      $or: [{ states: "ALL" }, { states: stateName }],
    });

    for (const occ of occasions) {
      const hit = occ.ranges.find((r) => inRange(dateStr, r));
      if (hit) {
        reasons.push({
          type: "occasion",
          severity: occ.severity,
          label: occ.name,
          detail: occ.note,
          approx: !!hit.approx,
        });
      }
    }
  }

  const hasBan = reasons.some((r) => r.severity === "ban");
  const hasCustom = reasons.some((r) => r.severity === "custom");

  let verdict;
  if (!stateName) verdict = "UNKNOWN";
  else if (hasBan) verdict = "STRICT_NO";
  else if (hasCustom) verdict = "CUSTOM_NO";
  else verdict = "YES";

  return { date: dateStr, weekday, state: stateName || null, verdict, reasons };
}
