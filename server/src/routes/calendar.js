import { Router } from "express";
import CalendarDay from "../models/CalendarDay.js";
import { computeDayInfo } from "../data/defaultCalendar.js";
import { checkChicken } from "../logic/checkChicken.js";
import { RELIGIONS, computeReligionDayInfo } from "../data/religionCalendar.js";

const router = Router();
const DAY_FIELDS = "-_id date weekday status occasion description";

function pad(n) {
  return String(n).padStart(2, "0");
}

// Adapts checkChicken's per-state {verdict, reasons} shape into the same
// {status, occasion, description} shape the default (nationwide) calendar
// uses, so the frontend doesn't need to know which one it's looking at.
// Priority mirrors the default calendar: an official ban wins, then any
// applicable festival/custom, then the weekly pattern, then "allowed".
function toCalendarDay({ date, weekday, reasons }) {
  const banOccasion = reasons.find((r) => r.type === "occasion" && r.severity === "ban");
  const anyOccasion = reasons.find((r) => r.type === "occasion");
  const weekly = reasons.find((r) => r.type === "weekly-custom");

  const primary = banOccasion || anyOccasion;
  if (primary) {
    return {
      date,
      weekday,
      status: primary.severity === "ban" ? "restricted" : "special",
      occasion: primary.label + (primary.approx ? " (approx. date)" : ""),
      description: primary.detail || primary.label,
    };
  }

  if (weekly) {
    return {
      date,
      weekday,
      status: "special",
      occasion: "Weekly custom",
      description: weekly.detail ? `${weekly.label}. ${weekly.detail}` : weekly.label,
    };
  }

  return {
    date,
    weekday,
    status: "allowed",
    occasion: null,
    description: "No weekly custom, festival period or official ban applies today.",
  };
}

router.get("/date/:date", async (req, res, next) => {
  try {
    const { date } = req.params;
    const { state, religion } = req.query;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    }

    if (religion) {
      if (!RELIGIONS.includes(religion)) {
        return res.status(400).json({ error: `Unknown religion: ${religion}` });
      }
      return res.json(computeReligionDayInfo(religion, date));
    }

    if (state) {
      const result = await checkChicken(state, date);
      return res.json(toCalendarDay(result));
    }

    const stored = await CalendarDay.findOne({ date }).select(DAY_FIELDS);
    res.json(stored || computeDayInfo(date));
  } catch (err) {
    next(err);
  }
});

router.get("/:year/:month", async (req, res, next) => {
  try {
    const year = parseInt(req.params.year, 10);
    const month = parseInt(req.params.month, 10);
    const { state, religion } = req.query;

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "year/month must be numeric, month between 1 and 12" });
    }

    if (religion) {
      if (!RELIGIONS.includes(religion)) {
        return res.status(400).json({ error: `Unknown religion: ${religion}` });
      }
      const daysInMonth = new Date(year, month, 0).getDate();
      const results = Array.from({ length: daysInMonth }, (_, i) =>
        computeReligionDayInfo(religion, `${year}-${pad(month)}-${pad(i + 1)}`)
      );
      return res.json(results);
    }

    if (state) {
      const daysInMonth = new Date(year, month, 0).getDate();
      const results = await Promise.all(
        Array.from({ length: daysInMonth }, (_, i) => {
          const dateStr = `${year}-${pad(month)}-${pad(i + 1)}`;
          return checkChicken(state, dateStr).then(toCalendarDay);
        })
      );
      return res.json(results);
    }

    const prefix = `${year}-${pad(month)}`;
    const days = await CalendarDay.find({ date: { $regex: `^${prefix}` } })
      .sort({ date: 1 })
      .select(DAY_FIELDS);

    res.json(days);
  } catch (err) {
    next(err);
  }
});

export default router;
