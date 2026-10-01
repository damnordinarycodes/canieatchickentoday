import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-2xl px-5 py-14 text-center sm:px-6 sm:py-20"
    >
      <h2 className="text-2xl font-extrabold tracking-tight text-charcoal">Can I eat chicken today?</h2>
      <p className="mt-4 text-base text-charcoal-soft">
        Chicken Day checks the date against widely observed chicken and meat restrictions in India. Choose a
        state, religion, or region for a more specific answer.
      </p>
      <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-charcoal-soft/80">
        Religious practices vary between families, communities and traditions. This tool is informational and
        should not be treated as religious authority.
      </p>
    </motion.section>
  );
}
