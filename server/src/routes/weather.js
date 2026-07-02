import { Router } from "express";

export const weatherRouter = Router();

const MET_FORECAST = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const MET_ALERTS = "https://api.met.no/weatherapi/metalerts/2.0/current.json";
const USER_AGENT = process.env.MET_USER_AGENT || "Moti.com.al contact@moti.com.al";

// Cache i thjeshtë në memorie (respekton header-in Expires kur ekziston).
const cache = new Map(); // key -> { body, expiresAt, contentType }
const FALLBACK_TTL_MS = 30 * 60 * 1000; // 30 min

function coords(req) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  // MET Norway kërkon max 4 shifra dhjetore
  return { lat: lat.toFixed(4), lon: lon.toFixed(4) };
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

  cache.set(cacheKey, { body, expiresAt, contentType });
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
