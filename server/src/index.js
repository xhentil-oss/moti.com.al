import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ping } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { locationsRouter } from "./routes/locations.js";
import { weatherRouter } from "./routes/weather.js";

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

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await ping();
    res.json({ ok: true, db: "up" });
  } catch {
    res.status(503).json({ ok: false, db: "down" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/locations", locationsRouter);
app.use("/api", weatherRouter); // /api/weather, /api/metalerts

app.use((_req, res) => res.status(404).json({ error: "Endpoint i panjohur" }));

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, "127.0.0.1", () => {
  console.log(`[moti-server] duke dëgjuar në http://127.0.0.1:${PORT}`);
});
