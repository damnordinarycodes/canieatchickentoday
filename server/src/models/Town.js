import mongoose from "mongoose";

const townSchema = new mongoose.Schema({
  town: { type: String, required: true },
  state: { type: String, required: true },
  status: { type: String, required: true },
});

export default mongoose.model("Town", townSchema);
