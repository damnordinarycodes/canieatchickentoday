import { useRef, useState } from "react";
import { motion } from "framer-motion";
import NavItem from "./NavItem";

const OPEN_SPRING = { type: "spring", stiffness: 300, damping: 26, mass: 0.7 };
const TILT_SPRING = { type: "spring", stiffness: 220, damping: 30 };
const IDLE_FLOAT = { duration: 5.5, repeat: Infinity, ease: "easeInOut" };

export default function NavCore({ items, open, onToggle, activeId, onSelect, reduceMotion }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [pointer, setPointer] = useState(null); // {x,y} px offset from container center
  const [selectedId, setSelectedId] = useState(null);

  const handlePointerMove = (e) => {
    if (!open || reduceMotion) return;
    const { clientX, clientY } = e;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPointer({ x: clientX - (rect.left + rect.width / 2), y: clientY - (rect.top + rect.height / 2) });
    });
  };

  const clearPointer = () => setPointer(null);

  // Select: glow the tapped card briefly, then hand off to the parent
  // (which closes the nav and navigates) once the glow has read clearly.
  const handleSelect = (item) => {
    if (selectedId) return;
    setSelectedId(item.id);
    clearPointer();
    setTimeout(() => {
      onSelect(item);
      setTimeout(() => setSelectedId(null), 450);
    }, 240);
  };

  const tiltX = pointer && !reduceMotion ? Math.max(-9, Math.min(9, -(pointer.y / 9))) : 0;
  const tiltY = pointer && !reduceMotion ? Math.max(-9, Math.min(9, pointer.x / 9)) : 0;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPointer}
      onPointerLeave={clearPointer}
      onPointerCancel={clearPointer}
      className="relative flex h-[220px] w-[220px] items-center justify-center"
      style={{ perspective: 900, touchAction: open ? "none" : "auto" }}
    >
      {/* restrained ambient glow behind the whole object — static, no per-frame animation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-28 w-28 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,154,98,0.28) 0%, transparent 72%)", filter: "blur(10px)" }}
      />

      {/* pointer-events: none — this is only a 3D positioning wrapper; without
          this it sits flat in front of its own 3D-offset children and steals
          their taps (confirmed via elementFromPoint, a real hit-test bug, not
          just a test artifact). Each NavItem re-enables its own hit target. */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", pointerEvents: "none" }}
        animate={{ rotateX: tiltX, rotateY: tiltY }}
        transition={TILT_SPRING}
      >
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            open={open}
            pointer={pointer}
            isActive={item.sectionId === activeId}
            isSelected={selectedId === item.id}
            anySelected={!!selectedId}
            reduceMotion={reduceMotion}
            onSelect={() => handleSelect(item)}
          />
        ))}
      </motion.div>

      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="relative z-10 flex h-16 w-14 items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
          backgroundColor: "color-mix(in srgb, #1a1714 74%, transparent)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "0 12px 30px -12px rgba(0,0,0,0.6)",
          color: "#fffdf9",
        }}
        initial={false}
        animate={
          reduceMotion
            ? { scale: open ? 0.86 : 1 }
            : open
              ? { scale: 0.86, y: 0, rotateZ: 0 }
              : { scale: [1, 1.03, 1], y: [0, -3, 0], rotateZ: [0, -4, 0, 4, 0] }
        }
        transition={reduceMotion || open ? OPEN_SPRING : IDLE_FLOAT}
      >
        <EggCrackGlyph open={open} reduceMotion={reduceMotion} />
      </motion.button>
    </div>
  );
}

// A hairline crack, barely visible at rest — an affordance hinting the egg
// can be cracked open — that flashes bright the instant it's tapped and
// stays lit while open, then settles back to a faint line when closed.
function EggCrackGlyph({ open, reduceMotion }) {
  return (
    <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
      <motion.path
        d="M10 2 L13.5 9 L7 12.5 L14 17 L8.5 24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={false}
        animate={reduceMotion ? { opacity: open ? 0.9 : 0.32 } : { opacity: open ? [0.32, 1, 0.9] : 0.32 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.42, ease: "easeOut" }}
      />
    </svg>
  );
}
