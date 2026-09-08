import HeroText from "./HeroText";
import StateSelector from "./StateSelector";
import ReligionSelector from "./ReligionSelector";
import TodayStatus from "./TodayStatus";
import ChickenViewer from "../ChickenViewer/ChickenViewer";

export default function Hero({
  dateISO,
  state,
  onStateChange,
  religion,
  onReligionChange,
  dayInfo,
  loading,
  onCheckToday,
}) {
  return (
    <section
      id="hero"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:grid-cols-2 md:gap-8 lg:gap-10 lg:pt-16"
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <HeroText onCheckToday={onCheckToday} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <StateSelector state={state} onChange={onStateChange} />
          <ReligionSelector religion={religion} onChange={onReligionChange} />
        </div>
        <TodayStatus dateISO={dateISO} state={state} religion={religion} dayInfo={dayInfo} loading={loading} />
      </div>
      <ChickenViewer status={dayInfo?.status || "allowed"} dateISO={dateISO} />
    </section>
  );
}
