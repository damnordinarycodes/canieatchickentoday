import { Router } from "express";
import State from "../models/State.js";
import Town from "../models/Town.js";
import { checkChicken } from "../logic/checkChicken.js";
import { regionOfState } from "../data/regionCalendar.js";

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

// Turns browser geolocation coordinates into one of the 4 regions, via
// OpenStreetMap's free Nominatim reverse-geocoder (no API key needed) to
// find the Indian state, then the same state->region mapping used by the
// region-filtered calendar.
router.get("/region", async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: "lat and lon query params are required numbers" });
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=5&addressdetails=1`,
      { headers: { "User-Agent": "chicken-day-app/1.0 (reverse geocoding for a regional chicken-day calendar)" } }
    );
    if (!geoRes.ok) {
      return res.status(502).json({ error: "Reverse geocoding lookup failed" });
    }
    const geo = await geoRes.json();
    const stateName = geo?.address?.state;
    const countryCode = geo?.address?.country_code;

    if (countryCode !== "in" || !stateName) {
      return res.status(422).json({ error: "This location doesn't appear to be in India" });
    }

    const region = regionOfState(stateName);
    if (!region) {
      return res.status(422).json({ error: `Couldn't map "${stateName}" to a region` });
    }

    res.json({ state: stateName, region });
  } catch (err) {
    next(err);
  }
});

export default router;
