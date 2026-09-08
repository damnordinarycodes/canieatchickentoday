import { useEffect, useState } from "react";
import { Link } from "../../router";

const LINKS = [
  { label: "Today", href: "/#hero" },
  { label: "Calendar", href: "/#calendar" },
  { label: "Towns", href: "/#towns" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/#hero" className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight text-charcoal sm:gap-2 sm:text-base">
          <span className="text-lg sm:text-xl">🐔</span>
          <span className="whitespace-nowrap">CHICKEN DAY</span>
        </Link>
        <div className="flex items-center gap-3 text-xs font-medium text-charcoal-soft sm:gap-6 sm:text-sm">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-charcoal">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
