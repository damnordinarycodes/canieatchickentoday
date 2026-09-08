// Single source of truth for the floating nav — position is expressed as an
// offset from the center in px (x,y) plus a z depth and resting tilt, so
// NavCore/NavItem never hardcode per-item layout logic.
export const NAV_ITEMS = [
  {
    id: "today",
    label: "Today",
    href: "/#hero",
    sectionId: "hero",
    icon: "sun",
    position: { x: 0, y: -92, z: 30, rotateX: 8, rotateY: 0 },
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/#calendar",
    sectionId: "calendar",
    icon: "calendar",
    position: { x: 86, y: -6, z: -16, rotateX: 0, rotateY: -12 },
  },
  {
    id: "towns",
    label: "Towns",
    href: "/#towns",
    sectionId: "towns",
    icon: "pin",
    position: { x: 0, y: 92, z: 8, rotateX: -8, rotateY: 0 },
  },
  {
    id: "about",
    label: "About",
    href: "/#about",
    sectionId: "about",
    icon: "info",
    position: { x: -86, y: -6, z: -16, rotateX: 0, rotateY: 12 },
  },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.sectionId);
