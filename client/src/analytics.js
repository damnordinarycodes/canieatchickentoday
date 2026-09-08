// Optional, privacy-friendly analytics — does nothing unless configured, so
// there's no fake tracking call shipped by default. Plausible is cookieless
// (page views + referrers only, no personal data, no cross-site tracking),
// which is why the consent banner doesn't need an "accept analytics" toggle.
// To turn it on: set VITE_PLAUSIBLE_DOMAIN to your domain in the deploy
// environment (see client/.env.example) and rebuild.
const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

if (domain) {
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = domain;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}
