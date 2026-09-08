import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavCore from "./NavCore";
import { NAV_ITEMS, SECTION_IDS } from "./navConfig";
import { useActiveSection } from "../../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { navigate } from "../../router";

// A floating 3D nav "device" for mobile only — see NavCore for the actual
// orb <-> four-card interaction. This component owns the open/closed state,
// active-section tracking, body-scroll locking while open, and the
// select -> close -> navigate sequencing.
export default function Mobile3DNavbar() {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSelect = (item) => {
    setOpen(false);
    navigate(item.href);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[65]"
            style={{ backgroundColor: "rgba(20,17,14,0.32)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.25 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div
        className="fixed inset-x-0 z-[70] flex justify-center sm:hidden"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <NavCore
          items={NAV_ITEMS}
          open={open}
          onToggle={() => setOpen((v) => !v)}
          activeId={activeSection}
          onSelect={handleSelect}
          reduceMotion={reduceMotion}
        />
      </div>
    </>
  );
}
