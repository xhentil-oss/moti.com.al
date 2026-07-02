import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ping } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { locationsRouter } from "./routes/locations.js";
import { weatherRouter } from "./routes/weather.js";
import { seoRouter } from "./routes/seo.js";

const app = express();
app.set("trust proxy", 1); // pas Nginx-it — që rate-limit të lexojë IP-në reale

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// CORS: në prod (Nginx same-origin) nuk nevojitet; e lëmë të konfigurueshëm.
const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
  app.use(cors({ origin: corsOrigin.split(",").map((s) => s.trim()) }));
} else if (process.env.NODE_ENV !== "production") {
  app.use(cors()); // zhvillim lokal
}

// Të gjitha rrugët nën një router të vetëm, i montuar EDHE te /api EDHE te /.
// Arsyeja: te cPanel/Passenger, kur app-i montohet te moti.com.al/api, Passenger
// ndonjëherë ia heq prefiksin /api kërkesës. Duke e montuar në të dyja vendet,
// funksionon qoftë kur prefiksi ruhet (/api/...), qoftë kur hiqet (/...).
const api = express.Router();

// Rrugë statusi te rrënja — që kontrolli i cPanel/Passenger të marrë 200 JSON.
api.get("/", (_req, res) => res.json({ ok: true, service: "moti-api" }));

api.get("/health", async (_req, res) => {
  try {
    await ping();
    res.json({ ok: true, db: "up" });
  } catch {
    res.status(503).json({ ok: false, db: "down" });
  }
});

api.use("/auth", authRouter);
api.use("/locations", locationsRouter);
api.use("/", weatherRouter); // /weather, /metalerts, /overpass, /geocode
api.use("/", seoRouter); // /sitemap.xml

app.use("/api", api);
app.use("/", api);

app.use((_req, res) => res.status(404).json({ error: "Endpoint i panjohur" }));

// PORT-in e cakton Passenger përmes env; dotenv nuk e mbishkruan një vlerë ekzistuese.
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`[moti-server] duke dëgjuar në portën ${PORT}`);
});
