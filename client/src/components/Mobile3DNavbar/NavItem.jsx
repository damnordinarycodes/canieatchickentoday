import { motion } from "framer-motion";
import Icon from "./icons";

const SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.6 };

// Radius (in the same px-from-center space as item.position) within which
// the pointer starts pulling a card toward it / lighting it up.
const MAGNET_RADIUS = 130;

export default function NavItem({ item, open, pointer, isActive, isSelected, anySelected, reduceMotion, onSelect }) {
  const { x, y, z, rotateX, rotateY } = item.position;

  let closeness = 0;
  if (pointer && open && !reduceMotion) {
    const dx = pointer.x - x;
    const dy = pointer.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    closeness = Math.max(0, 1 - dist / MAGNET_RADIUS);
  }

  let target;
  let glow = 0;

  if (!open) {
    target = { x: 0, y: 0, z: -30, scale: 0.15, opacity: 0, rotateX: 0, rotateY: 0 };
  } else if (isSelected) {
    target = { x, y, z: z + 74, scale: 1.2, opacity: 1, rotateX: 0, rotateY: 0 };
    glow = 1;
  } else if (anySelected) {
    target = { x: x * 0.65, y: y * 0.65, z: z - 46, scale: 0.82, opacity: 0.35, rotateX, rotateY };
  } else {
    const magnetX = pointer ? Math.sign(pointer.x - x) * closeness * 9 : 0;
    const magnetY = pointer ? Math.sign(pointer.y - y) * closeness * 9 : 0;
    target = {
      x: x + magnetX,
      y: y + magnetY,
      z: z + closeness * 26,
      scale: 1 + closeness * 0.14,
      opacity: 1,
      rotateX,
      rotateY,
    };
    glow = isActive ? 0.55 : closeness * 0.5;
  }

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "true" : undefined}
      aria-label={item.label}
      tabIndex={open ? 0 : -1}
      className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ transformStyle: "preserve-3d", pointerEvents: open ? "auto" : "none" }}
      initial={false}
      animate={target}
      transition={reduceMotion ? { duration: 0.18 } : SPRING}
    >
      <div
        className="relative flex h-14 w-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "color-mix(in srgb, #1a1714 74%, transparent)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: `1px solid ${isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.14)"}`,
          boxShadow: isActive
            ? "0 0 0 1px rgba(255,255,255,0.18), 0 10px 26px -10px rgba(0,0,0,0.65)"
            : "0 8px 20px -10px rgba(0,0,0,0.55)",
        }}
      >
        <span className="relative z-10 text-warm-white/90">
          <Icon name={item.icon} />
        </span>
        <span className="relative z-10 text-[8.5px] font-semibold uppercase tracking-wide text-warm-white/85">
          {item.label}
        </span>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-warm-white"
          initial={false}
          animate={{ opacity: glow * 0.22 }}
          transition={SPRING}
        />
        {isActive && (
          // A static border (set once) with only its opacity animated —
          // box-shadow itself is never touched per-frame here.
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: "rgba(255,154,98,0.75)" }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.95, 0.4] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.button>
  );
}
