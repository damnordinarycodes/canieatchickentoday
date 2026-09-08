import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  weeklyDays: { type: [String], default: [] },
  note: { type: String, default: "" },
});

export default mongoose.model("State", stateSchema);
