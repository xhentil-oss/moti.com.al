import { Router } from "express";
import { pool } from "../db.js";
import { translateQuery, rowToLocation } from "../queryTranslator.js";
import { requireAuth } from "../middleware/auth.js";

export const locationsRouter = Router();

// ─── Slug helper (id-të gjenerohen nga emri, pa diakritikë) ───────────────────
function slugify(input) {
  return String(input || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // hiq theksat kombinuese
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ë/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "vendbanim";
}

async function uniqueId(base) {
  let id = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [rows] = await pool.query("SELECT 1 FROM `locations` WHERE `id` = ? LIMIT 1", [id]);
    if (rows.length === 0) return id;
    id = `${base}-${++n}`;
  }
}

function sanitizeLocationInput(body) {
  const name = String(body.name ?? "").trim();
  const nameAl = String(body.nameAl ?? "").trim();
  const region = String(body.region ?? "").trim();
  const country = String(body.country ?? "").trim();
  const lat = Number(body.lat);
  const lon = Number(body.lon);
  const population = Number.isFinite(Number(body.population)) ? Math.round(Number(body.population)) : 0;
  const isPopular = body.isPopular ? 1 : 0;

  const errors = [];
  if (!name) errors.push("name mungon");
  if (!nameAl) errors.push("nameAl mungon");
  if (!region) errors.push("region mungon");
  if (!country) errors.push("country mungon");
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.push("lat i pavlefshëm");
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) errors.push("lon i pavlefshëm");

  return { data: { name, nameAl, region, country, lat, lon, population, isPopular }, errors };
}

// ─── QUERY (publik) — përdoret nga useQuery/useLazyQuery në frontend ──────────
locationsRouter.post("/query", async (req, res) => {
  try {
    const { sql, params } = translateQuery(req.body || {});
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(rowToLocation));
  } catch (err) {
    console.error("[locations] query error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// ─── GET një lokacion sipas id (publik) ───────────────────────────────────────
locationsRouter.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `locations` WHERE `id` = ? LIMIT 1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Nuk u gjet" });
    res.json(rowToLocation(rows[0]));
  } catch (err) {
    console.error("[locations] get error:", err.message);
    res.status(500).json({ error: "Gabim i brendshëm" });
  }
});

// ─── CREATE (auth) ────────────────────────────────────────────────────────────
locationsRouter.post("/", requireAuth, async (req, res) => {
  const { data, errors } = sanitizeLocationInput(req.body || {});
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });

  try {
    const id = await uniqueId(slugify(data.nameAl || data.name));
    await pool.query(
      "INSERT INTO `locations` (`id`,`name`,`nameAl`,`region`,`country`,`lat`,`lon`,`population`,`isPopular`) VALUES (?,?,?,?,?,?,?,?,?)",
      [id, data.name, data.nameAl, data.region, data.country, data.lat, data.lon, data.population, data.isPopular]
    );
    const [rows] = await pool.query("SELECT * FROM `locations` WHERE `id` = ?", [id]);
    res.status(201).json(rowToLocation(rows[0]));
  } catch (err) {
    console.error("[locations] create error:", err.message);
    res.status(500).json({ error: "Gabim gjatë ruajtjes" });
  }
});

// ─── UPDATE (auth) ────────────────────────────────────────────────────────────
locationsRouter.patch("/:id", requireAuth, async (req, res) => {
  const { data, errors } = sanitizeLocationInput(req.body || {});
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });
  try {
    const [result] = await pool.query(
      "UPDATE `locations` SET `name`=?,`nameAl`=?,`region`=?,`country`=?,`lat`=?,`lon`=?,`population`=?,`isPopular`=? WHERE `id`=?",
      [data.name, data.nameAl, data.region, data.country, data.lat, data.lon, data.population, data.isPopular, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Nuk u gjet" });
    const [rows] = await pool.query("SELECT * FROM `locations` WHERE `id` = ?", [req.params.id]);
    res.json(rowToLocation(rows[0]));
  } catch (err) {
    console.error("[locations] update error:", err.message);
    res.status(500).json({ error: "Gabim gjatë përditësimit" });
  }
});

// ─── DELETE (auth) ────────────────────────────────────────────────────────────
locationsRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM `locations` WHERE `id` = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Nuk u gjet" });
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    console.error("[locations] delete error:", err.message);
    res.status(500).json({ error: "Gabim gjatë fshirjes" });
  }
});
