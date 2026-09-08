import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroText({ onCheckToday }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
      <motion.p variants={item} className="text-sm font-semibold uppercase tracking-[0.2em] text-soft-orange-dark">
        Before you order
      </motion.p>
      <motion.h1
        variants={item}
        className="mt-3 text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-charcoal sm:text-5xl md:text-4xl lg:text-[3.75rem]"
      >
        Can You Eat
        <br />
        Chicken Today?
      </motion.h1>
      <motion.p variants={item} className="mt-4 max-w-md text-base text-charcoal-soft sm:mt-5 sm:text-lg">
        Check today's date and discover whether it's a chicken-friendly day.
      </motion.p>
      <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
        <button
          type="button"
          onClick={onCheckToday}
          className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-warm-white shadow-lg shadow-charcoal/20 transition-transform hover:scale-[1.03] active:scale-95 sm:px-6 sm:py-3"
        >
          Check Today's Day
        </button>
        <a
          href="#calendar"
          className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal transition-transform hover:scale-[1.03] active:scale-95 sm:px-6 sm:py-3"
        >
          View Calendar
        </a>
      </motion.div>
    </motion.div>
  );
}
