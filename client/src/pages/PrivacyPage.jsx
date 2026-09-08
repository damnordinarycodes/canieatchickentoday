import LegalPage from "./LegalPage";
import { usePageMeta } from "../hooks/usePageMeta";

export default function PrivacyPage() {
  usePageMeta(
    "Privacy Policy — Chicken Day",
    "How Chicken Day handles location data, cookies, and analytics — in plain language."
  );

  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <p>
        Chicken Day is a small, independent, non-commercial project. This page explains in plain language what
        happens to your data when you use it — it's written to be accurate about this specific site, not a
        generic legal template.
      </p>

      <h2>What we don't do</h2>
      <ul>
        <li>No accounts, no sign-up, no passwords.</li>
        <li>No ad tracking, no ad networks, no data sold to anyone.</li>
        <li>No tracking cookies. The only browser storage used is a small preference (like dismissing the cookie
          notice) saved in your browser's local storage, which never leaves your device.</li>
      </ul>

      <h2>The date, state, religion and region filters</h2>
      <p>
        Whatever you pick in the State, Religion or Region selectors is stored only in your browser's address bar
        (as a URL parameter) so you can bookmark or share a specific view. It isn't saved on our servers.
      </p>

      <h2>"Use my location"</h2>
      <p>
        If you tap "Use my location," your browser asks your permission first — nothing happens without it. If you
        allow it, your coordinates are sent once to our server, which uses them to look up a broad region
        (North/South/East/West India), then discards them. That lookup is normally performed by{" "}
        <a href="https://nominatim.org" target="_blank" rel="noreferrer">OpenStreetMap's Nominatim service</a>, so
        your coordinates are shared with them for that single request; if that service is unreachable, we fall back
        to an offline approximation that never leaves our own server. We don't store your coordinates, your exact
        location, or a history of your requests.
      </p>

      <h2>Server logs</h2>
      <p>
        Like effectively every website, our hosting infrastructure keeps standard technical logs (IP address,
        timestamp, requested page, browser type) for a limited time, for security and debugging. We don't cross
        this with anything else or build profiles from it.
      </p>

      <h2>Analytics</h2>
      <p>
        If analytics are enabled, they're privacy-respecting and cookieless — aggregate counts like "how many
        people visited" and "which pages," with no individual tracking, no fingerprinting, and no cross-site
        tracking. See the site footer for whether analytics are currently active.
      </p>

      <h2>Third-party links</h2>
      <p>
        Links to the 3D model credit (Poly Pizza), OpenStreetMap, or our GitHub repository take you to sites we
        don't control, each with their own privacy practices.
      </p>

      <h2>Children</h2>
      <p>This site isn't directed at children and doesn't knowingly collect data from anyone.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes in a way that matters, we'll update the date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:abhinavsingh2621@gmail.com">abhinavsingh2621@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
