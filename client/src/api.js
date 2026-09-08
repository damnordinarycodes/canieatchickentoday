export async function fetchStates() {
  const res = await fetch("/api/states");
  if (!res.ok) throw new Error("Failed to load states");
  return res.json();
}

function buildParams({ state, religion }) {
  const params = new URLSearchParams();
  if (religion) params.set("religion", religion);
  else if (state) params.set("state", state);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchDay(dateISO, state, religion) {
  const res = await fetch(`/api/calendar/date/${dateISO}${buildParams({ state, religion })}`);
  if (!res.ok) throw new Error(`Failed to load ${dateISO}`);
  return res.json();
}

export async function fetchMonth(year, month, state, religion) {
  const res = await fetch(`/api/calendar/${year}/${month}${buildParams({ state, religion })}`);
  if (!res.ok) throw new Error(`Failed to load ${year}-${month}`);
  return res.json();
}
