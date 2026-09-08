import State from "./models/State.js";
import Occasion from "./models/Occasion.js";
import Town from "./models/Town.js";
import CalendarDay from "./models/CalendarDay.js";
import { states } from "./data/states.js";
import { occasions } from "./data/occasions.js";
import { towns } from "./data/towns.js";
import { buildDefaultCalendar } from "./data/defaultCalendar.js";

export async function seedIfEmpty() {
  const [stateCount, occasionCount, townCount, calendarCount] = await Promise.all([
    State.countDocuments(),
    Occasion.countDocuments(),
    Town.countDocuments(),
    CalendarDay.countDocuments(),
  ]);

  if (stateCount === 0) {
    await State.insertMany(states);
    console.log(`Seeded ${states.length} states.`);
  }
  if (occasionCount === 0) {
    await Occasion.insertMany(occasions);
    console.log(`Seeded ${occasions.length} occasions.`);
  }
  if (townCount === 0) {
    await Town.insertMany(towns);
    console.log(`Seeded ${towns.length} permanent-ban towns.`);
  }
  if (calendarCount === 0) {
    const days = buildDefaultCalendar("2026-01-01", "2027-12-31");
    await CalendarDay.insertMany(days);
    console.log(`Seeded ${days.length} default-calendar days.`);
  }
}
