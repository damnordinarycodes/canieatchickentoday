import { useEffect, useState } from "react";
import { Link } from "../router";
import CalendarSection from "../components/Calendar/CalendarSection";
import DayDetails from "../components/DayDetails/DayDetails";
import RegionSelector from "../components/Hero/RegionSelector";
import ReligionSelector from "../components/Hero/ReligionSelector";
import StateSelector from "../components/Hero/StateSelector";
import TodayStatus from "../components/Hero/TodayStatus";
import { useDayInfo } from "../hooks/useDayInfo";
import { usePageMeta } from "../hooks/usePageMeta";
import { todayISO } from "../utils/date";

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function getDate() {
  const value = getParam("date");
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : todayISO();
}

export default function CheckPage() {
  usePageMeta(
    "Check by State or Tradition - Chicken Day",
    "Explore chicken-friendly days by state, religion, or region."
  );

  const [selectedDate, setSelectedDate] = useState(getDate);
  const [selectedState, setSelectedState] = useState(() => getParam("state"));
  const [selectedReligion, setSelectedReligion] = useState(() => getParam("religion"));
  const [selectedRegion, setSelectedRegion] = useState(() => getParam("region"));
  const { dayInfo, loading } = useDayInfo(selectedDate, selectedState, selectedReligion, selectedRegion);

  const chooseState = (value) => {
    setSelectedState(value);
    if (value) {
      setSelectedReligion("");
      setSelectedRegion("");
    }
  };

  const chooseReligion = (value) => {
    setSelectedReligion(value);
    if (value) {
      setSelectedState("");
      setSelectedRegion("");
    }
  };

  const chooseRegion = (value) => {
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

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm font-semibold text-charcoal-soft transition-colors hover:text-charcoal">
        Back to today
      </Link>
      <div className="mt-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-soft-orange-dark">A closer look</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-charcoal sm:text-5xl">
          Check by state or tradition
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal-soft sm:text-lg">
          Choose one lens at a time for a more specific answer. Your selection updates the calendar below.
        </p>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="glass rounded-3xl p-5 shadow-[0_20px_50px_-25px_rgba(38,34,29,0.25)] sm:p-7">
          <h2 className="text-xl font-extrabold text-charcoal">Choose your view</h2>
          <p className="mt-1 text-sm text-charcoal-soft">State, religion, and region are separate ways to read the same calendar.</p>
          <div className="mt-6 flex flex-col gap-3">
            <StateSelector state={selectedState} onChange={chooseState} />
            <ReligionSelector religion={selectedReligion} onChange={chooseReligion} />
            <RegionSelector region={selectedRegion} onChange={chooseRegion} />
          </div>
          <div className="mt-6">
            <TodayStatus
              dateISO={selectedDate}
              state={selectedState}
              religion={selectedReligion}
              region={selectedRegion}
              dayInfo={dayInfo}
              loading={loading}
            />
          </div>
        </div>
        <DayDetails
          dateISO={selectedDate}
          state={selectedState}
          religion={selectedReligion}
          region={selectedRegion}
          dayInfo={dayInfo}
          loading={loading}
        />
      </section>

      <section className="mt-6">
        <CalendarSection
          selectedDate={selectedDate}
          state={selectedState}
          religion={selectedReligion}
          region={selectedRegion}
          onSelect={setSelectedDate}
        />
      </section>
    </main>
  );
}
