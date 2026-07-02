/**
 * Fut seed/locations.json në tabelën `locations`.
 * Idempotent: ON DUPLICATE KEY UPDATE — mund të ekzekutohet sa herë të duash.
 * Nëse seed/locations.json mungon, e gjeneron automatikisht duke thirrur build-seed.
 */
import "dotenv/config";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = join(__dirname, "..", "seed", "locations.json");

if (!existsSync(seedPath)) {
  console.log("seed/locations.json mungon — po e gjeneroj…");
  execFileSync(process.execPath, [join(__dirname, "build-seed.mjs")], { stdio: "inherit" });
}

const rows = JSON.parse(readFileSync(seedPath, "utf8"));
if (!Array.isArray(rows) || rows.length === 0) {
  console.error("Seed bosh — asgjë për të futur.");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "moti",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "moti",
});

const sql =
  "INSERT INTO `locations` (`id`,`name`,`nameAl`,`region`,`country`,`lat`,`lon`,`population`,`isPopular`) VALUES ? " +
  "ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`nameAl`=VALUES(`nameAl`),`region`=VALUES(`region`)," +
  "`country`=VALUES(`country`),`lat`=VALUES(`lat`),`lon`=VALUES(`lon`),`population`=VALUES(`population`),`isPopular`=VALUES(`isPopular`)";

const values = rows.map((r) => [
  r.id,
  r.name,
  r.nameAl,
  r.region,
  r.country,
  r.lat,
  r.lon,
  r.population ?? 0,
  r.isPopular ? 1 : 0,
]);

const [result] = await conn.query(sql, [values]);
console.log(`✅ Seed u fut: ${rows.length} rreshta të dërguar (affected: ${result.affectedRows}).`);
await conn.end();
