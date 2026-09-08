import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import ChickenModel from "./ChickenModel";
import Lights from "./Lights";
import Environment from "./Environment";
import CameraController from "./CameraController";
import ChickenFallback from "./ChickenFallback";
import WebglErrorBoundary from "./WebglErrorBoundary";
import { useIsMobile } from "../../hooks/useIsMobile";
import { isWebglAvailable } from "../../utils/webgl";
import { statusMeta } from "../../utils/status";

export default function ChickenViewer({ status = "allowed", dateISO }) {
  const isMobile = useIsMobile();
  const webglOk = useMemo(() => isWebglAvailable(), []);
  const [tooltip, setTooltip] = useState(null);
  const hideTimer = useRef(null);

  const handleReact = (mood) => {
    const meta = statusMeta(status);
    setTooltip(mood === "sad" ? "🐔 Maybe save me for another day!" : "🐔 Chicken approved!");
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setTooltip(null), 1800);
    void meta;
  };

  if (!webglOk) {
    return (
      <div className="h-[300px] w-full sm:h-[380px] md:h-[420px] lg:h-[540px]">
        <ChickenFallback status={status} />
      </div>
    );
  }

  return (
    <div className="relative h-[300px] w-full select-none sm:h-[380px] md:h-[420px] lg:h-[540px]">
      <WebglErrorBoundary fallback={<ChickenFallback status={status} />}>
        <Canvas
          shadows={!isMobile}
          flat
          dpr={[1, isMobile ? 1.25 : 1.75]}
          camera={{ position: [0, 1.3, 4.6], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Lights isMobile={isMobile} />
            <ChickenModel status={status} dateISO={dateISO} isMobile={isMobile} onReact={handleReact} />
            <Environment isMobile={isMobile} />
            <CameraController />
          </Suspense>
        </Canvas>
      </WebglErrorBoundary>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-2xl px-4 py-2 text-sm font-semibold text-charcoal shadow-lg"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide text-charcoal-soft/50">
        tap the chicken
      </p>
    </div>
  );
}
