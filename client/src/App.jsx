import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ConsentBanner from "./components/ConsentBanner/ConsentBanner";
import HomePage from "./pages/HomePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useRoute } from "./router";
import { useConsent } from "./hooks/useConsent";

const PAGES = {
  "/": HomePage,
  "/privacy": PrivacyPage,
  "/terms": TermsPage,
};

export default function App() {
  const pathname = useRoute();
  const Page = PAGES[pathname] || NotFoundPage;
  const consent = useConsent();

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal antialiased">
      <div className="grain" />
      <Navbar />
      {/* Reserve space for the fixed consent banner so it never covers the
          footer's links instead of just floating on top of them. */}
      <div className={consent.visible ? "pb-24 sm:pb-28" : undefined}>
        <Page />
        <Footer />
      </div>
      <ConsentBanner visible={consent.visible} onDismiss={consent.dismiss} />
    </div>
  );
}
