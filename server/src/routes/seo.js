import { Router } from "express";
import { pool } from "../db.js";
import { buildSitemapXml } from "../../../shared/sitemap.js";

export const seoRouter = Router();

const SITE = (process.env.SITE_URL || "https://moti.com.al").replace(/\/$/, "");

// GET /api/sitemap.xml — gjenerohet dinamikisht nga databaza (përfshin çdo vendbanim).
// Sitemap-i kryesor për Google është /sitemap.xml (statik, nga prerender.mjs, i njëjti format).
seoRouter.get("/sitemap.xml", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT `id`, `region`, `updatedAt` FROM `locations` ORDER BY `population` DESC"
    );
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(buildSitemapXml(rows, SITE));
  } catch (err) {
    console.error("[sitemap] error:", err.message);
    res.status(500).send("error");
  }
});
