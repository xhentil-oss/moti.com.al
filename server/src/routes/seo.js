import { Router } from "express";
import { pool } from "../db.js";
import { slugify } from "../../../shared/cityContent.js";

export const seoRouter = Router();

const SITE = (process.env.SITE_URL || "https://moti.com.al").replace(/\/$/, "");

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );
}

// GET /api/sitemap.xml — gjenerohet dinamikisht nga databaza (përfshin çdo vendbanim).
seoRouter.get("/sitemap.xml", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT `id`, `region`, `updatedAt` FROM `locations` ORDER BY `population` DESC"
    );

    // Faqet e rajoneve (slug unik nga rajonet e vendbanimeve)
    const regionSlugs = [...new Set(rows.map((r) => slugify(r.region)).filter(Boolean))];
    const regionUrls = regionSlugs.map((slug) => ({
      loc: `${SITE}/rajoni/${slug}`,
      changefreq: "daily",
      priority: "0.6",
    }));

    const staticUrls = [
      { loc: `${SITE}/`, changefreq: "hourly", priority: "1.0" },
      { loc: `${SITE}/vendbanimet`, changefreq: "daily", priority: "0.8" },
      ...regionUrls,
      { loc: `${SITE}/rreth-nesh`, changefreq: "monthly", priority: "0.3" },
      { loc: `${SITE}/kontakt`, changefreq: "monthly", priority: "0.3" },
      { loc: `${SITE}/privatesia`, changefreq: "yearly", priority: "0.2" },
      { loc: `${SITE}/kushtet`, changefreq: "yearly", priority: "0.2" },
    ];

    const cityUrls = rows.map((r) => ({
      loc: `${SITE}/vendbanim/${encodeURIComponent(r.id)}`,
      lastmod: new Date(r.updatedAt).toISOString().split("T")[0],
      changefreq: "hourly",
      priority: "0.7",
    }));

    const urls = [...staticUrls, ...cityUrls];
    const body = urls
      .map(
        (u) =>
          `  <url><loc>${xmlEscape(u.loc)}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
          `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      )
      .join("\n");

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    console.error("[sitemap] error:", err.message);
    res.status(500).send("error");
  }
});
