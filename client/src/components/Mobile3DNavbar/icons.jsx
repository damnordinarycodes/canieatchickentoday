// Minimal thin-line icons, drawn inline so the floating nav doesn't pull in
// an icon library for four glyphs.
function Sun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.2 12H1.8M22.2 12h-2.4M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
    </svg>
  );
}

function Calendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.2" y="4.8" width="17.6" height="16" rx="2.4" />
      <path d="M3.2 9.6h17.6M8 2.8v3.6M16 2.8v3.6" />
    </svg>
  );
}

function Pin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.5s7-6.4 7-12.2A7 7 0 0 0 5 9.3c0 5.8 7 12.2 7 12.2Z" />
      <circle cx="12" cy="9.3" r="2.4" />
    </svg>
  );
}

function Info() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 11v6M12 7.4v.1" />
    </svg>
  );
}

const ICONS = { sun: Sun, calendar: Calendar, pin: Pin, info: Info };

export default function Icon({ name }) {
  const Cmp = ICONS[name];
  return Cmp ? <Cmp /> : null;
}
