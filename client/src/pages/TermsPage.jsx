import LegalPage from "./LegalPage";
import { usePageMeta } from "../hooks/usePageMeta";

export default function TermsPage() {
  usePageMeta("Terms & Conditions — Chicken Day", "The terms for using Chicken Day, in plain language.");

  return (
    <LegalPage title="Terms & Conditions" updated="September 2026">
      <p>
        Chicken Day is a free, independent, non-commercial project. By using it, you agree to the points below —
        written in plain language, since this is a small personal project, not a formal legal document from a
        registered company.
      </p>

      <h2>What this site is</h2>
      <p>
        Chicken Day shows widely-observed customs, festivals and official closures related to chicken/meat
        availability in India, filtered by date, state, religion or region. It's{" "}
        <strong>informational only</strong> — a starting point, not an authority on religious practice, local law,
        or what any specific shop near you is actually doing today. Practices vary by family, community, and
        location, and can change without the site being updated. Always verify locally before making plans around
        it (a trip, an order, an event).
      </p>

      <h2>No warranty</h2>
      <p>
        The site is provided "as is," with no guarantee that the information is complete, current, or accurate for
        your specific situation. Use it at your own discretion.
      </p>

      <h2>No liability</h2>
      <p>
        We're not responsible for any loss, inconvenience, or decision made based on this site — including travel
        plans, orders, or events scheduled around what it says.
      </p>

      <h2>Fair use</h2>
      <p>
        The site and its API are free to use for personal, non-commercial purposes. Please don't scrape it
        aggressively, attempt to overload it, or resell its data as your own service. Reasonable rate limits may
        be applied if needed to keep it available for everyone.
      </p>

      <h2>Content and attribution</h2>
      <p>
        The 3D chicken model is CC-BY licensed — see the credit in the site footer. The underlying calendar data
        was compiled from public sources for general reference and may contain errors or omissions; corrections
        are welcome via email.
      </p>

      <h2>Third-party links</h2>
      <p>
        Links to OpenStreetMap, Poly Pizza, GitHub, or anywhere else point to sites we don't control and aren't
        responsible for.
      </p>

      <h2>Changes to the service</h2>
      <p>
        This is a personal project maintained on a best-effort basis. It may change, go down temporarily, or be
        discontinued at any time, without notice.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, corrections, or removal requests: open an issue on{" "}
        <a href="https://github.com/damnordinarycodes/canieatchickentoday/issues" target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </p>
    </LegalPage>
  );
}
