// A coarser, 4-way lens on top of the same per-state data (occasions.js,
// states.js) — North/South/East/West instead of an exact state. Useful when
// a user shares their location instead of picking a state by hand: precise
// enough to be meaningful, coarse enough not to over-claim precision from a
// geolocation-derived state guess.
import { occasions } from "./occasions.js";
import { states } from "./states.js";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const REGIONS = ["north", "south", "east", "west"];
export const REGION_LABELS = {
  north: "North India",
  south: "South India",
  east: "East India",
  west: "West India",
};

// India doesn't split cleanly into 4 — this folds the Northeast into "East"
// and the Central states into "North"/"West" by geography, since the user
// asked for exactly 4 buckets. It's a broad grouping for a quick regional
// read, not an official zonal classification — the State selector remains
// the precise option.
const STATE_TO_REGION = {
  "Jammu and Kashmir": "north",
  "Ladakh": "north",
  "Himachal Pradesh": "north",
  "Punjab": "north",
  "Chandigarh": "north",
  "Haryana": "north",
  "Delhi": "north",
  "Uttarakhand": "north",
  "Uttar Pradesh": "north",
  "Rajasthan": "north",

  "Gujarat": "west",
  "Maharashtra": "west",
  "Goa": "west",
  "Dadra and Nagar Haveli and Daman and Diu": "west",
  "Madhya Pradesh": "west",

  "Andhra Pradesh": "south",
  "Telangana": "south",
  "Karnataka": "south",
  "Tamil Nadu": "south",
  "Kerala": "south",
  "Puducherry": "south",
  "Lakshadweep": "south",

  "Bihar": "east",
  "Jharkhand": "east",
  "West Bengal": "east",
  "Odisha": "east",
  "Chhattisgarh": "east",
  "Sikkim": "east",
  "Assam": "east",
  "Arunachal Pradesh": "east",
  "Manipur": "east",
  "Meghalaya": "east",
  "Mizoram": "east",
  "Nagaland": "east",
  "Tripura": "east",
  "Andaman and Nicobar Islands": "east",
};

export function regionOfState(stateName) {
  return STATE_TO_REGION[stateName] || null;
}

const REGION_STATES = REGIONS.reduce((acc, region) => {
  acc[region] = states.map((s) => s.name).filter((name) => STATE_TO_REGION[name] === region);
  return acc;
}, {});

function weekdayOf(dateStr) {
  return WEEKDAYS[new Date(`${dateStr}T00:00:00`).getDay()];
}

// An occasion "belongs" to a region only if a majority of the region's
// states observe it — otherwise one state's local ban would flag the whole
// region, which overstates it (mirrors the default calendar's "broadly
// observed" threshold, just scoped to the region instead of all of India).
function findOccasionMatches(dateStr, region) {
  const regionStates = REGION_STATES[region];
  const half = Math.ceil(regionStates.length / 2);
  const matches = [];

  for (const occ of occasions) {
    const hit = occ.ranges.find((r) => dateStr >= r.start && dateStr <= r.end);
    if (!hit) continue;

    if (occ.states === "ALL") {
      matches.push({ occ, hit });
      continue;
    }
    if (Array.isArray(occ.states)) {
      const coverage = occ.states.filter((s) => regionStates.includes(s)).length;
      if (coverage >= half) matches.push({ occ, hit });
    }
  }
  return matches;
}

function regionWeeklyCustom(region, weekday) {
  const regionStates = REGION_STATES[region];
  const observing = regionStates.filter((name) => {
    const s = states.find((st) => st.name === name);
    return s && s.weeklyDays.includes(weekday);
  });
  return observing.length >= Math.ceil(regionStates.length / 2);
}

export function computeRegionDayInfo(region, dateStr) {
  const weekday = weekdayOf(dateStr);

  const matches = findOccasionMatches(dateStr, region);
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

  if (regionWeeklyCustom(region, weekday)) {
    return {
      date: dateStr,
      weekday,
      status: "special",
      occasion: "Weekly custom",
      description: `${weekday} is a widely observed no-meat day across much of ${REGION_LABELS[region]}.`,
    };
  }

  return {
    date: dateStr,
    weekday,
    status: "allowed",
    occasion: null,
    description: `No widely observed ${REGION_LABELS[region]} restriction today.`,
  };
}
