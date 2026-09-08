export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatLong(iso) {
  const d = parseISODate(iso);
  return `${WEEKDAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShort(iso) {
  const d = parseISODate(iso);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Monday-first day-of-week index (0 = Monday ... 6 = Sunday), matching the
// calendar layout in the spec (Mon Tue Wed Thu Fri Sat Sun).
export function mondayIndex(jsDay) {
  return (jsDay + 6) % 7;
}

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
