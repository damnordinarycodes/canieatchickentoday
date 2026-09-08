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
const isProd = process.env.NODE_ENV === "production";

// Needed so req.protocol / req.secure reflect the original client scheme
// when running behind a reverse proxy (Caddy, an AWS/DO load balancer) that
// terminates TLS and forwards plain HTTP internally — without this, the
// HTTPS redirect below would loop forever.
app.set("trust proxy", 1);

if (isProd) {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(308, `https://${req.headers.host}${req.originalUrl}`);
    }
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
    next();
  });
}

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/calendar", calendarRouter);

const KNOWN_ROUTES = ["/", "/privacy", "/terms"];

app.get("/robots.txt", (req, res) => {
  const siteUrl = `${req.protocol}://${req.headers.host}`;
  res.type("text/plain").send(`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
});

app.get("/sitemap.xml", (req, res) => {
  const siteUrl = `${req.protocol}://${req.headers.host}`;
  const urls = KNOWN_ROUTES.map(
    (route) => `  <url><loc>${siteUrl}${route}</loc></url>`
  ).join("\n");
  res
    .type("application/xml")
    .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

// In production this one service also serves the built React app (single
// DigitalOcean App Platform component — no separate static site, no CORS).
if (isProd) {
  const clientDist = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    // A real, distinct route (including the client-rendered pages) gets a
    // normal 200; anything else still serves the SPA shell (so the
    // client-side NotFoundPage renders) but with an honest 404 status —
    // search engines shouldn't index a "soft 404" as if it were real content.
    const status = KNOWN_ROUTES.includes(req.path) ? 200 : 404;
    res.status(status).sendFile(path.join(clientDist, "index.html"));
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
