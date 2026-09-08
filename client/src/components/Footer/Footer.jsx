import { Link } from "../../router";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-cream-dark/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div>
          <p className="flex items-center justify-center gap-2 text-sm font-extrabold text-charcoal sm:justify-start">
            <span>🐔</span> Chicken Day
          </p>
          <p className="mt-1 text-xs text-charcoal-soft">Know the day. Choose your meal.</p>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-charcoal-soft">
          <Link href="/privacy" className="hover:text-charcoal">Privacy</Link>
          <Link href="/terms" className="hover:text-charcoal">Terms</Link>
          <Link href="/#about" className="hover:text-charcoal">About</Link>
          <a href="mailto:abhinavsingh2621@gmail.com" className="hover:text-charcoal">Contact</a>
        </div>
        <p className="text-[11px] text-charcoal-soft/80">Built with MERN + Three.js</p>
      </div>
      <p className="border-t border-black/5 px-5 py-3 text-center text-[10px] text-charcoal-soft/80 sm:px-6">
        "Chicken" 3D model by{" "}
        <a href="https://poly.pizza/m/87XZ2kDlAhh" target="_blank" rel="noreferrer" className="underline hover:text-charcoal-soft">
          Maf'j Alvarez
        </a>{" "}
        via{" "}
        <a href="https://poly.pizza" target="_blank" rel="noreferrer" className="underline hover:text-charcoal-soft">
          Poly Pizza
        </a>{" "}
        (
        <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer" className="underline hover:text-charcoal-soft">
          CC-BY 3.0
        </a>
        )
      </p>
    </footer>
  );
}
