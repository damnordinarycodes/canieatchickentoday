import { lazy, Suspense } from "react";
import HeroText from "./HeroText";
import StateSelector from "./StateSelector";
import ReligionSelector from "./ReligionSelector";
import RegionSelector from "./RegionSelector";
import TodayStatus from "./TodayStatus";
import ChickenFallback from "../ChickenViewer/ChickenFallback";

// Three.js + @react-three/fiber/drei are the single biggest chunk of the
// bundle — code-split them out so the initial page load (and the meta tags,
// first paint) doesn't wait on a 3D engine nobody's looked at yet.
const ChickenViewer = lazy(() => import("../ChickenViewer/ChickenViewer"));

export default function Hero({
  dateISO,
  state,
  onStateChange,
  religion,
  onReligionChange,
  region,
  onRegionChange,
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
        <RegionSelector region={region} onChange={onRegionChange} />
        <TodayStatus
          dateISO={dateISO}
          state={state}
          religion={religion}
          region={region}
          dayInfo={dayInfo}
          loading={loading}
        />
      </div>
      <Suspense
        fallback={
          <div className="h-[300px] w-full sm:h-[380px] md:h-[420px] lg:h-[540px]">
            <ChickenFallback status={dayInfo?.status || "allowed"} />
          </div>
        }
      >
        <ChickenViewer status={dayInfo?.status || "allowed"} dateISO={dateISO} />
      </Suspense>
    </section>
  );
}
