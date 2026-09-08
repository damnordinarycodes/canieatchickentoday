import { Router } from "express";
import State from "../models/State.js";
import Town from "../models/Town.js";
import { checkChicken } from "../logic/checkChicken.js";

const router = Router();

router.get("/states", async (req, res, next) => {
  try {
    const states = await State.find().sort({ name: 1 }).select("name -_id");
    res.json(states.map((s) => s.name));
  } catch (err) {
    next(err);
  }
});

router.get("/towns", async (req, res, next) => {
  try {
    const towns = await Town.find().select("-_id town state status");
    res.json(towns);
  } catch (err) {
    next(err);
  }
});

router.get("/check", async (req, res, next) => {
  try {
    const { state, date } = req.query;
    const dateStr = date || new Date().toISOString().slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    }

    const result = await checkChicken(state || null, dateStr);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
