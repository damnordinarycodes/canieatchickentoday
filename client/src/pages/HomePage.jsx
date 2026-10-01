import { useEffect, useState } from "react";
import Hero from "../components/Hero/Hero";
import CalendarSection from "../components/Calendar/CalendarSection";
import DayDetails from "../components/DayDetails/DayDetails";
import TownsSection from "../components/Towns/TownsSection";
import About from "../components/About/About";
import { useDayInfo } from "../hooks/useDayInfo";
import { usePageMeta } from "../hooks/usePageMeta";
import { todayISO } from "../utils/date";

function getInitialDate() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("date");
  return fromUrl && /^\d{4}-\d{2}-\d{2}$/.test(fromUrl) ? fromUrl : todayISO();
}

export default function HomePage() {
  usePageMeta(
    "Can I Eat Chicken Today? | Chicken Day",
    "Can I eat chicken today? Check India's chicken-friendly calendar by date, state, religion, or region."
  );

  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const { dayInfo, loading } = useDayInfo(selectedDate, "", "", "");

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("date", selectedDate);
    url.searchParams.delete("state");
    url.searchParams.delete("religion");
    url.searchParams.delete("region");
    window.history.replaceState(null, "", url);
  }, [selectedDate]);

  // If we arrived here via a same-page nav link (e.g. "/#calendar" clicked
  // from /privacy), scroll to that section once mounted — a client-rendered
  // route change doesn't get the browser's automatic hash-scroll behavior.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "auto", block: "start" }));
    }
  }, []);

  return (
    <>
      <Hero
        dateISO={selectedDate}
        dayInfo={dayInfo}
        onCheckToday={() => setSelectedDate(todayISO())}
      />

      <section id="calendar" className="mx-auto grid max-w-6xl scroll-mt-20 grid-cols-1 gap-6 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.4fr_1fr]">
        <CalendarSection
          selectedDate={selectedDate}
          state=""
          religion=""
          region=""
          onSelect={setSelectedDate}
        />
        <DayDetails
          dateISO={selectedDate}
          state=""
          religion=""
          region=""
          dayInfo={dayInfo}
          loading={loading}
        />
      </section>

      <TownsSection />
      <About />
    </>
  );
}
