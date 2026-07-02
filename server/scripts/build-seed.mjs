/**
 * Gjeneron server/seed/locations.json nga lista statike src/lib/albanianCities.ts.
 * Kështu baza e të dhënave mbjellet me të njëjtat vendbanime që përdorte fallback-u.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = join(__dirname, "..", "..", "src", "lib", "albanianCities.ts");
const outDir = join(__dirname, "..", "seed");
const outPath = join(outDir, "locations.json");

const text = readFileSync(srcPath, "utf8");

// 1) Gjej fillimin e vargut ALBANIAN_CITIES
const marker = "ALBANIAN_CITIES";
const eqIdx = text.indexOf("=", text.indexOf(marker));
const startIdx = text.indexOf("[", eqIdx);
const endIdx = text.indexOf("];", startIdx);
if (startIdx === -1 || endIdx === -1) {
  throw new Error("Nuk u gjet vargu ALBANIAN_CITIES në albanianCities.ts");
}
let block = text.slice(startIdx, endIdx + 1); // përfshi ]

// 2) Hiq komentet e rreshtit (// ...)
block = block
  .split("\n")
  .map((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("//")) return "";
    return line;
  })
  .join("\n");

// 3) Vër thonjëza te çelësat: { id: ... } -> { "id": ... }
block = block.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

// 4) Hiq presjet e fundit para } ose ]
block = block.replace(/,(\s*[}\]])/g, "$1");

let cities;
try {
  cities = JSON.parse(block);
} catch (err) {
  console.error("Dështoi parsimi i vargut. Fragment:\n", block.slice(0, 400));
  throw err;
}

// 5) Shto isPopular (prag ≥ 15000, njësoj si logjika e aplikacionit)
const seed = cities.map((c) => ({
  id: c.id,
  name: c.name,
  nameAl: c.nameAl,
  region: c.region,
  country: c.country,
  lat: c.lat,
  lon: c.lon,
  population: c.population ?? 0,
  isPopular: (c.population ?? 0) >= 15000,
}));

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(seed, null, 2), "utf8");
console.log(`✅ U gjeneruan ${seed.length} vendbanime → ${outPath}`);
