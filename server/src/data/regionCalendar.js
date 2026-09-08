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

// Fallback for when reverse-geocoding (Nominatim) is unreachable — some
// networks block/rate-limit it. Nearest-neighbor against a spread of major
// Indian cities, each tagged with the same region its state maps to above.
// A flat-earth distance is fine here; this only needs to pick the closest of
// a few dozen points, not measure real distance.
const REFERENCE_POINTS = [
  { lat: 28.7041, lon: 77.1025, region: "north" }, // Delhi
  { lat: 26.9124, lon: 75.7873, region: "north" }, // Jaipur
  { lat: 24.5854, lon: 73.7125, region: "north" }, // Udaipur
  { lat: 26.8467, lon: 80.9462, region: "north" }, // Lucknow
  { lat: 30.7333, lon: 76.7794, region: "north" }, // Chandigarh
  { lat: 30.9010, lon: 75.8573, region: "north" }, // Ludhiana
  { lat: 31.1048, lon: 77.1734, region: "north" }, // Shimla
  { lat: 30.3165, lon: 78.0322, region: "north" }, // Dehradun
  { lat: 34.0837, lon: 74.7973, region: "north" }, // Srinagar
  { lat: 34.1526, lon: 77.5771, region: "north" }, // Leh

  { lat: 19.076, lon: 72.8777, region: "west" }, // Mumbai
  { lat: 21.1458, lon: 79.0882, region: "west" }, // Nagpur
  { lat: 23.0225, lon: 72.5714, region: "west" }, // Ahmedabad
  { lat: 15.4909, lon: 73.8278, region: "west" }, // Panaji
  { lat: 23.2599, lon: 77.4126, region: "west" }, // Bhopal
  { lat: 22.7196, lon: 75.8577, region: "west" }, // Indore
  { lat: 22.3072, lon: 73.1812, region: "west" }, // Vadodara

  { lat: 12.9716, lon: 77.5946, region: "south" }, // Bengaluru
  { lat: 13.0827, lon: 80.2707, region: "south" }, // Chennai
  { lat: 17.385, lon: 78.4867, region: "south" }, // Hyderabad
  { lat: 8.5241, lon: 76.9366, region: "south" }, // Thiruvananthapuram
  { lat: 9.9312, lon: 76.2673, region: "south" }, // Kochi
  { lat: 11.9139, lon: 79.8083, region: "south" }, // Puducherry
  { lat: 16.5062, lon: 80.648, region: "south" }, // Vijayawada
  { lat: 10.5667, lon: 72.6417, region: "south" }, // Lakshadweep

  { lat: 22.5726, lon: 88.3639, region: "east" }, // Kolkata
  { lat: 25.5941, lon: 85.1376, region: "east" }, // Patna
  { lat: 23.3441, lon: 85.3096, region: "east" }, // Ranchi
  { lat: 20.2961, lon: 85.8245, region: "east" }, // Bhubaneswar
  { lat: 21.2514, lon: 81.6296, region: "east" }, // Raipur
  { lat: 26.1445, lon: 91.7362, region: "east" }, // Guwahati
  { lat: 27.3389, lon: 88.6065, region: "east" }, // Gangtok
  { lat: 23.8315, lon: 91.2868, region: "east" }, // Agartala
  { lat: 24.817, lon: 93.9368, region: "east" }, // Imphal
  { lat: 25.5788, lon: 91.8933, region: "east" }, // Shillong
  { lat: 23.7271, lon: 92.7176, region: "east" }, // Aizawl
  { lat: 25.6751, lon: 94.1086, region: "east" }, // Kohima
  { lat: 27.0844, lon: 93.6053, region: "east" }, // Itanagar
  { lat: 11.6234, lon: 92.7265, region: "east" }, // Port Blair
];

const INDIA_BOUNDS = { minLat: 6, maxLat: 38, minLon: 68, maxLon: 98 };

export function isRoughlyInIndia(lat, lon) {
  return (
    lat >= INDIA_BOUNDS.minLat && lat <= INDIA_BOUNDS.maxLat && lon >= INDIA_BOUNDS.minLon && lon <= INDIA_BOUNDS.maxLon
  );
}

export function regionFromCoords(lat, lon) {
  let best = null;
  let bestDist = Infinity;
  for (const p of REFERENCE_POINTS) {
    const dLat = lat - p.lat;
    const dLon = (lon - p.lon) * Math.cos(((lat + p.lat) / 2) * (Math.PI / 180));
    const dist = dLat * dLat + dLon * dLon;
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }
  return best ? best.region : null;
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
