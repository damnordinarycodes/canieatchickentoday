import { useEffect, useState } from "react";

// Tracks which of the given section ids is most visible right now, using a
// single shared IntersectionObserver rather than one per section. Sections
// that don't exist on the current page (e.g. on /privacy) are skipped
// rather than throwing.
export function useActiveSection(ids) {
  const key = ids.join(",");
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    // IntersectionObserver only fires for elements whose own intersection
    // just crossed a threshold, reporting *their* boundingClientRect at
    // that moment — during a smooth (animated) scroll that passes through a
    // section without settling there, that snapshot goes stale the instant
    // the scroll moves on. So the observer is used purely as the "something
    // changed, worth rechecking" signal; positions are always read live.
    const pickActive = () => {
      const doc = document.documentElement;
      // If scrolled (essentially) all the way down, the last section is
      // "active" by definition — a short final section often can't reach
      // top<=0 itself because there's no more room to scroll it up to, so
      // the position-based check below would otherwise never pick it.
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      const rects = elements.map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }));
      // Among sections whose top has already reached the top of the
      // viewport, the one that reached it most recently (top closest to,
      // but not over, 0) is the one currently occupying the top of the
      // screen — this is height-agnostic, unlike an intersection-ratio
      // comparison, so a short section isn't out-voted by a taller one
      // that merely peeks in beneath it.
      const passed = rects.filter((r) => r.top <= 1);
      const best =
        passed.length > 0
          ? passed.reduce((a, b) => (b.top > a.top ? b : a))
          : rects.reduce((a, b) => (b.top < a.top ? b : a));
      setActiveId(best.id);
    };

    const observer = new IntersectionObserver(pickActive, { threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1] });

    pickActive(); // cover loading directly onto a mid-page scroll position
    elements.forEach((el) => observer.observe(el));
    window.addEventListener("resize", pickActive);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", pickActive);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
}
