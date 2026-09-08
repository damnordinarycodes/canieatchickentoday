import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { seedIfEmpty } from "./seed.js";
import apiRouter from "./routes/api.js";
import calendarRouter from "./routes/calendar.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/calendar", calendarRouter);

// In production this one service also serves the built React app (single
// DigitalOcean App Platform component — no separate static site, no CORS).
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

async function start() {
  await connectDB();
  await seedIfEmpty();
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
