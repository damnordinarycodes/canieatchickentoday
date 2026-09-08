import { Router } from "express";
import State from "../models/State.js";
import Town from "../models/Town.js";
import { checkChicken } from "../logic/checkChicken.js";
import { regionOfState, regionFromCoords, isRoughlyInIndia } from "../data/regionCalendar.js";

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

// Best-effort reverse geocode via OpenStreetMap's free Nominatim API.
// Returns null (never throws) on any failure — network error, timeout,
// non-2xx, unreadable body, or a state we can't map — so the caller can fall
// back instead of hard-failing. Some networks block/rate-limit Nominatim
// outright, which is common enough to design around rather than surface.
async function reverseGeocodeState(lat, lon) {
  let geoRes;
  try {
    geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=5&addressdetails=1`,
      {
        headers: { "User-Agent": "chicken-day-app/1.0 (reverse geocoding for a regional chicken-day calendar)" },
        signal: AbortSignal.timeout(6000),
      }
    );
  } catch {
    return null;
  }
  if (!geoRes.ok) return null;

  let geo;
  try {
    geo = await geoRes.json();
  } catch {
    return null;
  }

  const stateName = geo?.address?.state;
  const countryCode = geo?.address?.country_code;
  if (countryCode !== "in" || !stateName) return null;

  const region = regionOfState(stateName);
  return region ? { state: stateName, region } : null;
}

// Turns browser geolocation coordinates into one of the 4 regions. Tries
// precise reverse-geocoding first; if that's unreachable (blocked/rate
// limited on the user's network — not rare), falls back to a dependency-free
// nearest-major-city approximation instead of failing outright.
router.get("/region", async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: "lat and lon query params are required numbers" });
    }

    const geocoded = await reverseGeocodeState(lat, lon);
    if (geocoded) {
      return res.json(geocoded);
    }

    if (!isRoughlyInIndia(lat, lon)) {
      return res.status(422).json({ error: "This location doesn't appear to be in India" });
    }

    res.json({ state: null, region: regionFromCoords(lat, lon), approximate: true });
  } catch (err) {
    next(err);
  }
});

export default router;
