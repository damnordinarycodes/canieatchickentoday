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

function getInitialParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

export default function HomePage() {
  usePageMeta(
    "Chicken Day — Should You Eat Chicken Today?",
    "A playful, premium way to check whether today is a chicken-friendly day in India — by state, religion, or region."
  );

  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [selectedState, setSelectedState] = useState(() => getInitialParam("state"));
  const [selectedReligion, setSelectedReligion] = useState(() => getInitialParam("religion"));
  const [selectedRegion, setSelectedRegion] = useState(() => getInitialParam("region"));
  const { dayInfo, loading } = useDayInfo(selectedDate, selectedState, selectedReligion, selectedRegion);

  // State, religion and region are three different lenses on the same
  // calendar — picking one clears the other two rather than trying to
  // combine them (the underlying data doesn't support e.g. "Hindu customs
  // in North India" as a single view).
  const handleStateChange = (value) => {
    setSelectedState(value);
    if (value) {
      setSelectedReligion("");
      setSelectedRegion("");
    }
  };

  const handleReligionChange = (value) => {
    setSelectedReligion(value);
    if (value) {
      setSelectedState("");
      setSelectedRegion("");
    }
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    if (value) {
      setSelectedState("");
      setSelectedReligion("");
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("date", selectedDate);
    if (selectedState) url.searchParams.set("state", selectedState);
    else url.searchParams.delete("state");
    if (selectedReligion) url.searchParams.set("religion", selectedReligion);
    else url.searchParams.delete("religion");
    if (selectedRegion) url.searchParams.set("region", selectedRegion);
    else url.searchParams.delete("region");
    window.history.replaceState(null, "", url);
  }, [selectedDate, selectedState, selectedReligion, selectedRegion]);

  // If we arrived here via a same-page nav link (e.g. "/#calendar" clicked
  // from /privacy), scroll to that section once mounted — a client-rendered
  // route change doesn't get the browser's automatic hash-scroll behavior.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    }
  }, []);

  return (
    <>
      <Hero
        dateISO={selectedDate}
        state={selectedState}
        onStateChange={handleStateChange}
        religion={selectedReligion}
        onReligionChange={handleReligionChange}
        region={selectedRegion}
        onRegionChange={handleRegionChange}
        dayInfo={dayInfo}
        loading={loading}
        onCheckToday={() => setSelectedDate(todayISO())}
      />

      <section id="calendar" className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.4fr_1fr]">
        <CalendarSection
          selectedDate={selectedDate}
          state={selectedState}
          religion={selectedReligion}
          region={selectedRegion}
          onSelect={setSelectedDate}
        />
        <DayDetails
          dateISO={selectedDate}
          state={selectedState}
          religion={selectedReligion}
          region={selectedRegion}
          dayInfo={dayInfo}
          loading={loading}
        />
      </section>

      <TownsSection />
      <About />
    </>
  );
}
