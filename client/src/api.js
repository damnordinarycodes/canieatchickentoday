export async function fetchStates() {
  const res = await fetch("/api/states");
  if (!res.ok) throw new Error("Failed to load states");
  return res.json();
}

function buildParams({ state, religion, region }) {
  const params = new URLSearchParams();
  if (religion) params.set("religion", religion);
  else if (region) params.set("region", region);
  else if (state) params.set("state", state);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchDay(dateISO, state, religion, region) {
  const res = await fetch(`/api/calendar/date/${dateISO}${buildParams({ state, religion, region })}`);
  if (!res.ok) throw new Error(`Failed to load ${dateISO}`);
  return res.json();
}

export async function fetchMonth(year, month, state, religion, region) {
  const res = await fetch(`/api/calendar/${year}/${month}${buildParams({ state, religion, region })}`);
  if (!res.ok) throw new Error(`Failed to load ${year}-${month}`);
  return res.json();
}

// Reverse-geocodes browser geolocation coordinates to an Indian state/region
// via the server (which proxies OpenStreetMap Nominatim).
export async function fetchRegionFromCoords(lat, lon) {
  const res = await fetch(`/api/region?lat=${lat}&lon=${lon}`);
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Couldn't determine your region — try again.");
  }
  if (!res.ok) throw new Error(data.error || "Failed to determine region from location");
  return data;
}
