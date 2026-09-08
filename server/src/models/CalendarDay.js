import mongoose from "mongoose";

const calendarDaySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  weekday: { type: String, required: true },
  status: { type: String, enum: ["allowed", "restricted", "special"], required: true },
  occasion: { type: String, default: null },
  description: { type: String, default: "" },
});

export default mongoose.model("CalendarDay", calendarDaySchema);
