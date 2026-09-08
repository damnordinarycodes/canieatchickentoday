import { motion } from "framer-motion";
import { statusMeta } from "../../utils/status";

export default function ChickenFallback({ status = "allowed" }) {
  const meta = statusMeta(status);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-cream-dark to-warm-white">
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[7rem] drop-shadow-[0_18px_30px_rgba(0,0,0,0.12)] sm:text-[9rem]"
      >
        🐔
      </motion.div>
      <div className={`absolute bottom-8 rounded-full px-4 py-1.5 text-xs font-semibold ${meta.textClass} bg-warm-white/80 shadow-sm`}>
        3D preview unavailable on this device — {meta.shortLabel.toLowerCase()}
      </div>
    </div>
  );
}
