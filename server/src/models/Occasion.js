import mongoose from "mongoose";

const rangeSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
    approx: { type: Boolean, default: false },
  },
  { _id: false }
);

const occasionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  severity: { type: String, enum: ["ban", "custom"], required: true },
  states: { type: mongoose.Schema.Types.Mixed, required: true }, // "ALL" or array of state names
  ranges: { type: [rangeSchema], default: [] },
  note: { type: String, default: "" },
  prominent: { type: Boolean, default: false },
  religions: { type: [String], default: [] },
});

export default mongoose.model("Occasion", occasionSchema);
