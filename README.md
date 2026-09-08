# Chicken Day — Should You Eat Chicken Today?

A premium, playful, single-page MERN app built around an interactive 3D chicken.
Pick a date (or click through the calendar) and it tells you whether today is a
"chicken day," a "maybe" (a widely observed weekly/festival custom), or a "not
today" (an official meat-ban day) — based on *No-Chicken-Days-India-2026-2027.docx*.

- **MongoDB** — `states`, `occasions`, `towns` (from the earlier per-state tool,
  still available via `/api`) plus a new `CalendarDay` collection: one default,
  India-wide "tradition" precomputed for 2026–2027 from the broadly-observed
  entries in `occasions.js` (nationwide bans, and customs observed by 15+
  states/UTs) plus a commonly-cited weekly pattern. No setup needed: if
  `MONGODB_URI` isn't set, the server boots a real, local, in-memory MongoDB
  automatically (via `mongodb-memory-server`).
- **Express** — `/api/calendar/date/:date`, `/api/calendar/:year/:month`
  (the new calendar API), plus the older `/api/states`, `/api/towns`, `/api/check`.
- **React + Vite** — Tailwind CSS, React Three Fiber / drei / three.js for the
  3D chicken, Framer Motion for UI animation.
- **Node** — runtime for the above.

## Run it

```bash
npm run install:all   # first time only
npm run dev            # starts server (5050) and client (5173) together
```

Then open http://localhost:5173.

Or run each piece separately:

```bash
cd server && npm install && npm run dev   # http://localhost:5050
cd client && npm install && npm run dev   # http://localhost:5173
```

## How the calendar works

`server/src/data/defaultCalendar.js` computes, for any date, one of:

- **allowed** (🟢 "chicken day") — nothing notable applies.
- **special** (🟡 "maybe") — a widely observed custom applies (a Tuesday/
  Thursday/Saturday weekly pattern, or a broad festival like Navratri or
  Janmashtami) but no official ban.
- **restricted** (🔴 "not today") — an official/municipal ban applies
  (Gandhi Jayanti, Mahavir Jayanti, Paryushan closures, etc.).

This is deliberately a single **default calendar/tradition**, not a claim that
applies to everyone — wording throughout the UI says "widely observed" /
"according to the default calendar," never "no one eats chicken today."

## State / UT selector

The Hero has a "State / UT" dropdown (`Hero/StateSelector.jsx`, from
`/api/states`). Picking a state re-runs the check through the original
per-state logic in `logic/checkChicken.js` instead of the default calendar —
`GET /api/calendar/date/:date?state=X` and `GET /api/calendar/:year/:month?state=X`
both accept the same `state` query param and adapt `checkChicken`'s
`{verdict, reasons}` output into the calendar's `{status, occasion,
description}` shape (`toCalendarDay` in `routes/calendar.js`), so the status
card, day-details panel, and the full month grid all become state-specific —
including regional festivals like Ganesh Chaturthi that aren't broad enough
for the nationwide default view. Clearing the dropdown back to "All India"
returns to the default calendar. Selected state is reflected in the URL
(`?state=...`) alongside the date.

## Religion / community selector

The Hero also has a "Religion" dropdown (`Hero/ReligionSelector.jsx`): Hindu,
Jain, Sikh / Punjabi, Muslim, Christian. It's a different lens than the state
selector — rather than filtering the state-based occasions list, each
religion gets its own rule set in `server/src/data/religionCalendar.js`,
following the source doc's own "Coverage" note literally:

- **Jain** — vegetarian every single day of the year, not just on festival
  dates, so this one always returns "restricted" regardless of date.
- **Muslim** — no dietary restriction on chicken in mainstream practice, so
  every day is "allowed" *except* official bans (Gandhi Jayanti, Mahavir
  Jayanti, Paryushan municipal closures, etc.) — a ban closes shops for
  everyone, not just the community whose festival it is.
- **Christian** — Ash Wednesday, Good Friday, plus every Friday in between is
  computed as a Lenten Friday.
- **Hindu** — the same broad festivals as the default calendar, plus the
  Tuesday/Thursday/Saturday weekly pattern.
- **Sikh / Punjabi** — tagged occasions only (e.g. Guru Nanak Jayanti); no
  fixed weekly pattern, since Sangrand isn't a fixed Gregorian date in this
  dataset.

`GET /api/calendar/date/:date?religion=X` and
`GET /api/calendar/:year/:month?religion=X` mirror the `state` param's shape
so the frontend doesn't care which lens is active. The state and religion
selectors are mutually exclusive — picking one clears the other, since the
data doesn't support combining them (e.g. "Jain customs in Maharashtra").

## Region selector (location-based)

A third lens, `Hero/RegionSelector.jsx`: North / South / East / West India.
Unlike the State and Religion selectors it can be filled in automatically —
its "Use my location" button asks the browser for geolocation permission,
sends the coordinates to `GET /api/region?lat=&lon=`, which reverse-geocodes
them via OpenStreetMap's free Nominatim API (no key needed) to find the
Indian state, then maps that state to a region
(`server/src/data/regionCalendar.js`). It can also just be picked by hand
from the dropdown, no location permission required.

Nominatim is a free third-party service and some networks block or
rate-limit it outright — that shouldn't break the feature, so if it's
unreachable (timeout, error, or an unreadable response) `/api/region` falls
back to `regionFromCoords()`, a dependency-free nearest-city approximation
(a hardcoded list of ~40 major Indian city coordinates, each tagged with its
region; the closest one wins). The response marks this with
`approximate: true`, and the UI shows a small "estimated" note when it
happens. Coordinates outside a rough India bounding box still return a clear
"doesn't appear to be in India" error either way.

India doesn't split cleanly into 4 zones — this folds the Northeast into
"East" and the Central states into "North"/"West" — so it's a broad,
approximate grouping, not an official zonal classification. To avoid one
state's local ban flagging an entire region, an occasion (ban, custom, or
weekly pattern) only counts for a region if **at least half its states**
observe it; the State selector remains the precise, single-state answer.
Region is mutually exclusive with State and Religion, same as those two are
with each other.

## 3D chicken

`client/src/components/ChickenViewer/` — a real low-poly 3D chicken model
(`client/public/models/chicken.glb`, "Chicken" by Maf'j Alvarez via
[Poly Pizza](https://poly.pizza), CC-BY 3.0 — see the footer credit) loaded
with `useGLTF` and rendered in React Three Fiber. It's a single merged mesh
(no separate head/wing bones), so it's animated as one rigid body: idle
bob/sway, a yaw/tilt toward the cursor, a jump-and-peck on click with a
tooltip, and a whole-body reaction (a droop vs. a happy hop) whenever the
selected day's status changes. Falls back to a CSS/emoji illustration if
WebGL is unavailable, with shadows/particle counts reduced on mobile for
performance. The loader is structured so the model can be swapped for a
different `.glb` later — see `MODEL_URL` / `BASE_SCALE` / `RECENTER` in
`ChickenModel.jsx`.

## Deploying to DigitalOcean

The app deploys as a **single App Platform service**: in production, Express
(`server/src/index.js`) serves both the API (`/api/...`) and the built React
app (everything else, via `express.static` + an SPA fallback to
`index.html`), backed by a **DigitalOcean Managed MongoDB** database. One
service, one database, no separate static site and no CORS to worry about.

1. **Push this repo to GitHub** (App Platform's easiest path deploys from a
   GitHub repo with auto-deploy on push):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create --source=. --public --push   # or create on github.com and add a remote
   ```
2. `.do/app.yaml` already points at `damnordinarycodes/canieatchickentoday`,
   branch `main` — update it if you deploy from a fork or different branch.
3. **Create the app** from that spec, either via the dashboard
   ("Create App" → "Edit App Spec" → paste `.do/app.yaml`'s contents) or with
   [`doctl`](https://docs.digitalocean.com/reference/doctl/):
   ```bash
   doctl apps create --spec .do/app.yaml
   ```
   This provisions both the `web` service (Basic plan) and the
   `chicken-day-db` Managed MongoDB cluster in one shot, and wires the
   database's connection string into the service as `MONGODB_URI`
   automatically (`${chicken-day-db.DATABASE_URL}`) — no manual env var
   copying needed.
4. Every `git push` to the tracked branch triggers a new build
   (`npm run build`: builds the client, installs server prod deps) and
   redeploy (`npm start`: `node server/src/index.js`).

`server/src/db.js` refuses to fall back to the in-memory dev database when
`NODE_ENV=production` (set automatically by the app spec) — if `MONGODB_URI`
is ever missing in production, the server fails fast at boot instead of
silently running on a throwaway database.

## Deploying to a VPS (Docker)

For any plain VPS (a DigitalOcean Droplet, Hetzner, Linode, a bare EC2 box,
etc. — anywhere you SSH in yourself instead of using a managed platform),
the repo is Docker-based: `Dockerfile` builds the client and runs the same
single Express service from the App Platform setup above, and
`docker-compose.yml` adds a `mongo` container and a `caddy` container in
front of it for automatic HTTPS.

**On your machine**, commit and push these files (already in the repo):
`Dockerfile`, `.dockerignore`, `docker-compose.yml`, `Caddyfile`.

**On the VPS:**

1. Point your domain's `A` record at the VPS's IP (needed for Caddy to get a
   free Let's Encrypt certificate). Skip this if you don't have a domain yet
   — see the `Caddyfile` for the no-domain/plain-HTTP fallback.
2. Install Docker + the Compose plugin (Ubuntu):
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER   # log out/in after this
   ```
3. Open the firewall for SSH, HTTP, and HTTPS only:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80,443/tcp
   sudo ufw enable
   ```
4. Clone the repo and edit `Caddyfile` — replace `your-domain.com` with your
   real domain (or switch to the `:80` fallback block if you have no domain):
   ```bash
   git clone https://github.com/damnordinarycodes/canieatchickentoday.git
   cd canieatchickentoday
   nano Caddyfile
   ```
5. Build and start everything:
   ```bash
   docker compose up -d --build
   ```
   This builds the app image, starts MongoDB (with a persistent
   `mongo-data` volume — the database survives container restarts/rebuilds),
   and starts Caddy, which automatically requests and renews the TLS
   certificate and reverse-proxies to the app.
6. To deploy an update later:
   ```bash
   git pull
   docker compose up -d --build
   ```

No `MONGODB_URI` needs setting by hand here — `docker-compose.yml` points
the app straight at the `mongo` container. The same production guard in
`server/src/db.js` (fail fast instead of falling back to an in-memory
database) still applies, so a Compose misconfiguration surfaces immediately
in `docker compose logs app` rather than silently losing data on restart.

## Deploying to AWS (EC2)

AWS's plain-VPS equivalent is EC2, so this reuses the exact same
`Dockerfile` / `docker-compose.yml` / `Caddyfile` from the VPS section above
— nothing AWS-specific to build, just AWS-specific setup steps. (AWS also
has managed-container options — ECS/Fargate, App Runner — but those need the
server rewritten to not manage its own MongoDB container and to run behind
a load balancer with a separately-hosted database like DocumentDB or Atlas,
which is a bigger lift for no real benefit at this app's scale. EC2 is the
straightforward match for what's already built.)

1. **Launch the instance** — EC2 console → Launch instance:
   - AMI: **Ubuntu Server 24.04 LTS**
   - Instance type: `t3.micro` (free-tier eligible for 12 months) or `t3.small`
     if you want more headroom
   - Key pair: create/select one — you'll need it to SSH in
   - Network settings → Security group: allow **SSH (22)** from your IP,
     **HTTP (80)** and **HTTPS (443)** from anywhere
   - Storage: the default 8 GB gp3 volume is enough
2. **(Optional) Auto-provision on boot** — paste `.aws/ec2-user-data.sh`
   into "Advanced details → User data" before launching. It installs Docker,
   clones the repo, and runs `docker compose up -d --build` automatically —
   the instance is serving traffic by the time it finishes booting, no SSH
   step needed. Edit `REPO_URL` in that file first if you forked the repo.
3. **Allocate an Elastic IP** (EC2 → Elastic IPs → Allocate, then Associate
   with the instance) so the public IP survives a stop/start — otherwise a
   restarted instance gets a new IP and breaks your domain's `A` record.
4. Point your domain's `A` record at the Elastic IP, then either:
   - Skip straight to step 6 if you used the user-data script, or
   - SSH in (`ssh -i your-key.pem ubuntu@<elastic-ip>`) and follow steps 2-5
     from the VPS section above (install Docker, edit `Caddyfile`,
     `docker compose up -d --build`) — identical steps, just on EC2 instead
     of a Droplet.
5. To deploy an update: SSH in, `cd /opt/chicken-day` (or wherever you
   cloned it), `git pull && docker compose up -d --build`.

Same as the VPS section: `MONGODB_URI` doesn't need setting by hand (Compose
points the app at the `mongo` container), and the production guard in
`server/src/db.js` still fails fast instead of silently using an in-memory
database.

## Underlying per-state data

`/api/check`, `/api/states`, and `/api/towns` are the original per-state/date
checker this project started from — still there, and now also what powers the
state selector above (via `checkChicken.js`). See `states.js` and
`occasions.js` for the full state-by-state weekly customs and festival data.
