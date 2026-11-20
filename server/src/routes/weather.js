import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";

export const weatherRouter = Router();

// Nominatim lejon max ~1 kërkesë/sek — e mbajmë brenda kësaj norme edhe për admin-in.
const geocodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Shumë kërkesa gjeokodimi. Prisni pak." },
});

const MET_FORECAST = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const MET_ALERTS = "https://api.met.no/weatherapi/metalerts/2.0/current.json";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = process.env.MET_USER_AGENT || "Moti.com.al contact@moti.com.al";

// Cache i thjeshtë në memorie (respekton header-in Expires kur ekziston).
// Madhësia kufizohet (MAX_CACHE_ENTRIES) që koordinatat arbitrare të mos e rrisin pa fund.
const cache = new Map(); // key -> { body, expiresAt, contentType }
const FALLBACK_TTL_MS = 30 * 60 * 1000; // 30 min
const MAX_CACHE_ENTRIES = 5000;

function cacheSet(key, value) {
  if (cache.has(key)) cache.delete(key);
  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Hiq së pari hyrjet e skaduara; nëse s'mjafton, më të vjetrat (Map ruan rendin e futjes).
    const now = Date.now();
    for (const [k, v] of cache) if (v.expiresAt <= now) cache.delete(k);
    while (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
  }
  cache.set(key, value);
}

function coords(req) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  // Rrumbullakim në 2 shifra (~1 km): parashikimi s'ndryshon, por cache-i ndahet mes
  // kërkesave afër njëra-tjetrës dhe s'mund të anashkalohet me koordinata të rastësishme.
  return { lat: lat.toFixed(2), lon: lon.toFixed(2) };
}

async function proxyMet(upstreamUrl, cacheKey, res) {
  const hit = cache.get(cacheKey);
  if (hit && Date.now() < hit.expiresAt) {
    res.set("Content-Type", hit.contentType);
    res.set("X-Moti-Cache", "HIT");
    return res.send(hit.body);
  }

  const upstream = await fetch(upstreamUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
    },
  });

  if (!upstream.ok) {
    return res.status(upstream.status).json({ error: `MET upstream ${upstream.status}` });
  }

  const body = await upstream.text();
  const contentType = upstream.headers.get("content-type") || "application/json";

  // Përcakto TTL nga header-i Expires nëse ekziston
  let expiresAt = Date.now() + FALLBACK_TTL_MS;
  const expiresHeader = upstream.headers.get("expires");
  if (expiresHeader) {
    const t = Date.parse(expiresHeader);
    if (!Number.isNaN(t) && t > Date.now()) expiresAt = t;
  }

  cacheSet(cacheKey, { body, expiresAt, contentType });
  res.set("Content-Type", contentType);
  res.set("X-Moti-Cache", "MISS");
  res.send(body);
}

// GET /api/weather?lat=&lon=  → locationforecast compact
weatherRouter.get("/weather", async (req, res) => {
  const c = coords(req);
  if (!c) return res.status(400).json({ error: "lat/lon të pavlefshme" });
  try {
    await proxyMet(`${MET_FORECAST}?lat=${c.lat}&lon=${c.lon}`, `fc:${c.lat},${c.lon}`, res);
  } catch (err) {
    console.error("[weather] error:", err.message);
    res.status(502).json({ error: "Lidhja me MET dështoi" });
  }
});

// GET /api/metalerts?lat=&lon=  → paralajmërimet aktive
weatherRouter.get("/metalerts", async (req, res) => {
  const c = coords(req);
  if (!c) return res.status(400).json({ error: "lat/lon të pavlefshme" });
  try {
    await proxyMet(`${MET_ALERTS}?lat=${c.lat}&lon=${c.lon}`, `al:${c.lat},${c.lon}`, res);
  } catch (err) {
    console.error("[metalerts] error:", err.message);
    res.status(502).json({ error: "Lidhja me MET dështoi" });
  }
});

// POST /api/overpass  { query }  → proxy te Overpass (import masiv vendbanimesh nga OSM)
// Vetëm për admin-in: përndryshe kushdo do ta përdorte si proxy të hapur me User-Agent-in tonë.
weatherRouter.post("/overpass", requireAuth, async (req, res) => {
  const query = req.body?.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query mungon" });
  }
  if (query.length > 10000) {
    return res.status(400).json({ error: "query shumë e gjatë" });
  }
  try {
    const upstream = await fetch(OVERPASS, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
      body: "data=" + encodeURIComponent(query),
    });
    const text = await upstream.text();
    res
      .status(upstream.status)
      .set("Content-Type", upstream.headers.get("content-type") || "application/json")
      .send(text);
  } catch (err) {
    console.error("[overpass] error:", err.message);
    res.status(502).json({ error: "Lidhja me Overpass dështoi" });
  }
});

// GET /api/geocode?q=&countrycodes=&limit=  → proxy te Nominatim (gjeokodim)
// Vetëm për admin-in (përdoret te paneli për shtim/import vendbanimesh).
weatherRouter.get("/geocode", requireAuth, geocodeLimiter, async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 200);
  if (!q) return res.status(400).json({ error: "q mungon" });
  const limitNum = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
  const params = new URLSearchParams({
    format: "json",
    q,
    addressdetails: "1",
    limit: String(limitNum),
  });
  const cc = String(req.query.countrycodes || "").toLowerCase();
  if (/^[a-z]{2}(,[a-z]{2})*$/.test(cc)) params.set("countrycodes", cc);
  try {
    const upstream = await fetch(`${NOMINATIM}?${params.toString()}`, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    const text = await upstream.text();
    res.status(upstream.status).set("Content-Type", "application/json").send(text);
  } catch (err) {
    console.error("[geocode] error:", err.message);
    res.status(502).json({ error: "Lidhja me Nominatim dështoi" });
  }
});
