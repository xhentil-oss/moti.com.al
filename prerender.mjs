/**
 * Prerender / SSG për moti.com.al
 *
 * Ekzekutohet PAS `vite build`. Për çdo vendbanim gjeneron një HTML statik
 * (dist/vendbanim/<id>.html) me titull/meta/canonical/OG/JSON-LD dhe përmbajtje
 * UNIKE të lexueshme nga crawler-at. JS-i ende ngarkohet dhe e zëvendëson me
 * aplikacionin interaktiv (moti live) pas montimit.
 *
 * Burimi i vendbanimeve:
 *   1) DB live përmes API (default) → mbulon çdo location të shtuar nga admin
 *   2) fallback: server/seed/locations.json (437 kryesoret) nëse API s'arrihet
 *   Kontroll: PRERENDER_SOURCE=seed  ose  PRERENDER_API=<url>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { countryLabel, longDescription, faqs, climateType, bestTime, slugify, regionDescription } from "./shared/cityContent.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const SEED = join(__dirname, "server", "seed", "locations.json");
const SITE = "https://moti.com.al";
const API = process.env.PRERENDER_API || `${SITE}/api/locations/query`;

// ─── Burimi i të dhënave ─────────────────────────────────────────────────────
function loadSeed() {
  if (!existsSync(SEED)) {
    execFileSync(process.execPath, [join(__dirname, "server", "scripts", "build-seed.mjs")], { stdio: "inherit" });
  }
  return JSON.parse(readFileSync(SEED, "utf8"));
}

async function loadCities() {
  if (process.env.PRERENDER_SOURCE === "seed") return loadSeed();
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderBy: { population: "desc" }, limit: 50000 }),
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length) {
        console.log(`Prerender nga DB (API): ${rows.length} vendbanime`);
        return rows;
      }
    }
    throw new Error(`API ktheu ${res.status}`);
  } catch (e) {
    console.warn(`API s'u arrit (${e.message}) — po përdor seed-in statik.`);
    return loadSeed();
  }
}

const allCities = await loadCities();

// Para-rendero vetëm vendet me popullsi reale (cilësi mbi sasi; parandalon "thin content").
// Fshatrat pa popullsi mbeten në sitemap + CSR — prapë të indeksueshëm.
// Ndrysho pragun me PRERENDER_MIN_POP (0 = të gjitha).
const MIN_POP = Number(process.env.PRERENDER_MIN_POP ?? 1000);
const cities = allCities.filter((c) => c.isPopular || (Number(c.population) || 0) >= MIN_POP);
console.log(`Prerender: ${cities.length} / ${allCities.length} vendbanime (prag popullsie ≥ ${MIN_POP})`);

const templatePath = join(DIST, "index.html");
if (!existsSync(templatePath)) {
  console.error("dist/index.html mungon — ekzekuto 'vite build' së pari.");
  process.exit(1);
}
const template = readFileSync(templatePath, "utf8");

// ─── Helpers ─────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const escAttr = (s) => String(s).replace(/"/g, "&quot;");

function setHead(html, { title, description, canonical, ogType }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escAttr(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escAttr(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escAttr(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType || "website"}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escAttr(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escAttr(description)}$2`);
}

function injectJsonLd(html, objs) {
  const scripts = objs.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return html.replace("</head>", `${scripts}\n</head>`);
}

function injectBody(html, bodyHtml) {
  return html.replace(
    '<div id="app"></div>',
    `<div id="app"><div data-prerender style="max-width:1100px;margin:0 auto;padding:24px 16px;color:#e7edf5;background:#0B1E3D;min-height:100vh;font-family:Inter,system-ui,sans-serif">${bodyHtml}</div></div>`
  );
}

function write(relPath, html) {
  const full = join(DIST, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, "utf8");
}

// ─── Trupi SEO për një qytet (përmbajtje unike nga gjeografia) ───────────────
function cityBody(city, others) {
  const facts = [
    ["Rajoni", city.region],
    ["Shteti", countryLabel(city.country)],
    ["Tipi i klimës", climateType(city)],
    ["Gjerësia gjeografike", `${city.lat.toFixed(4)}° V`],
    ["Gjatësia gjeografike", `${city.lon.toFixed(4)}° L`],
    ...(city.population ? [["Popullsia", `~${city.population.toLocaleString("sq-AL")} banorë`]] : []),
  ];
  const nearby = others
    .filter((o) => o.region === city.region && o.id !== city.id)
    .concat(others.filter((o) => o.region !== city.region))
    .slice(0, 8);

  return `
    <nav aria-label="Shtegu i navigimit" style="font-size:13px;opacity:.7;margin-bottom:14px">
      <a href="/" style="color:#7fb4f5">Kryefaqja</a> ›
      <a href="/vendbanimet" style="color:#7fb4f5">Vendbanimet</a> ›
      <span>${esc(city.nameAl)}</span>
    </nav>
    <h1 style="font-size:28px;font-weight:800;margin:0 0 10px">Moti në ${esc(city.nameAl)} — parashikimi 10-ditor dhe orar</h1>
    <p style="opacity:.85;line-height:1.6;max-width:72ch">${esc(longDescription(city))}</p>
    <p style="opacity:.6;margin-top:10px">⏳ Duke ngarkuar motin live nga MET/Yr…</p>

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Të dhëna klimatike për ${esc(city.nameAl)}</h2>
    <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">
      ${facts.map(([k, v]) => `<li style="background:#132843;padding:10px 12px;border-radius:10px"><strong style="color:#7fb4f5">${esc(k)}:</strong> ${esc(v)}</li>`).join("")}
    </ul>

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Kur të vizitosh ${esc(city.nameAl)}</h2>
    <p style="opacity:.8;line-height:1.6;max-width:72ch">${esc(bestTime(city))}</p>

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Pyetje të shpeshta për motin në ${esc(city.nameAl)}</h2>
    ${faqs(city)
      .map(
        (f) =>
          `<div style="background:#132843;padding:12px 14px;border-radius:10px;margin-bottom:8px"><h3 style="font-size:15px;margin:0 0 6px">${esc(f.q)}</h3><p style="opacity:.78;margin:0;line-height:1.55">${esc(f.a)}</p></div>`
      )
      .join("")}

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Qytete të tjera në ${esc(city.region)} e më gjerë</h2>
    <p>${nearby.map((o) => `<a href="/vendbanim/${esc(o.id)}" style="color:#7fb4f5;margin-right:14px;display:inline-block">${esc(o.nameAl)}</a>`).join("")}</p>
  `;
}

function cityJsonLd(city) {
  const url = `${SITE}/vendbanim/${city.id}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kryefaqja", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Vendbanimet", item: `${SITE}/vendbanimet` },
        { "@type": "ListItem", position: 3, name: city.nameAl, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Place",
      name: city.nameAl,
      description: longDescription(city),
      url,
      geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lon },
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: city.region,
        containedInPlace: { "@type": "Country", name: countryLabel(city.country) },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs(city).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

// ─── Gjenero faqet e qyteteve ────────────────────────────────────────────────
let count = 0;
for (const city of cities) {
  const canonical = `${SITE}/vendbanim/${city.id}`;
  let html = setHead(template, {
    title: `Moti në ${city.nameAl} — Parashikimi 10-ditor & orar | Moti.com.al`,
    description: `Parashikimi i motit për ${city.nameAl}, ${city.region}: temperatura, reshjet, era, orë-pas-ore dhe 10-ditor. Klimë ${climateType(city).toLowerCase()}. Të dhëna live nga MET/Yr.`,
    canonical,
    ogType: "article",
  });
  html = injectJsonLd(html, cityJsonLd(city));
  html = injectBody(html, cityBody(city, cities));
  write(`vendbanim/${city.id}.html`, html);
  count++;
}

// ─── Faqja /vendbanimet ──────────────────────────────────────────────────────
{
  const byCountry = cities.reduce((acc, c) => {
    (acc[c.country] = acc[c.country] || []).push(c);
    return acc;
  }, {});
  const body = `
    <h1 style="font-size:28px;font-weight:800;margin:0 0 10px">Të gjitha vendbanimet</h1>
    <p style="opacity:.8">Parashikimi i motit për ${cities.length}+ qytete e fshatra në Shqipëri, Kosovë dhe Maqedoni.</p>
    ${Object.entries(byCountry)
      .map(
        ([country, list]) =>
          `<h2 style="font-size:20px;margin:20px 0 8px">${esc(countryLabel(country))}</h2><p>${list
            .map((c) => `<a href="/vendbanim/${esc(c.id)}" style="color:#7fb4f5;margin-right:14px;display:inline-block">${esc(c.nameAl)}</a>`)
            .join("")}</p>`
      )
      .join("")}
  `;
  let html = setHead(template, {
    title: "Të gjitha vendbanimet — Moti për qytetet e Shqipërisë, Kosovës & Maqedonisë | Moti.com.al",
    description:
      "Lista e plotë e qyteteve dhe fshatrave me parashikim moti: Shqipëri, Kosovë dhe Maqedoni e Veriut. Zgjidh vendbanimin për motin live, orar dhe 10-ditor.",
    canonical: `${SITE}/vendbanimet`,
    ogType: "website",
  });
  html = injectJsonLd(html, [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kryefaqja", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Vendbanimet", item: `${SITE}/vendbanimet` },
      ],
    },
  ]);
  html = injectBody(html, body);
  write("vendbanimet.html", html);
  count++;
}

// ─── Faqet e rajoneve (nga seed-i statik, si RegionPage në React) ────────────
{
  const seedCities = loadSeed();
  const byRegion = new Map();
  for (const c of seedCities) {
    const slug = slugify(c.region);
    if (!byRegion.has(slug)) byRegion.set(slug, { region: c.region, country: c.country, list: [] });
    byRegion.get(slug).list.push(c);
  }
  for (const [slug, { region, country, list }] of byRegion) {
    list.sort((a, b) => (b.population || 0) - (a.population || 0));
    const canonical = `${SITE}/rajoni/${slug}`;
    const body = `
      <nav aria-label="Shtegu" style="font-size:13px;opacity:.7;margin-bottom:14px"><a href="/" style="color:#7fb4f5">Kryefaqja</a> › <a href="/vendbanimet" style="color:#7fb4f5">Vendbanimet</a> › <span>${esc(region)}</span></nav>
      <h1 style="font-size:28px;font-weight:800;margin:0 0 10px">Moti në rajonin e ${esc(region)}</h1>
      <p style="opacity:.85;line-height:1.6;max-width:72ch">${esc(regionDescription(region, country, list.length))}</p>
      <h2 style="font-size:20px;font-weight:700;margin:22px 0 8px">Qytetet dhe fshatrat e rajonit</h2>
      <p>${list.map((c) => `<a href="/vendbanim/${esc(c.id)}" style="color:#7fb4f5;margin-right:14px;display:inline-block">${esc(c.nameAl)}</a>`).join("")}</p>
    `;
    let html = setHead(template, {
      title: `Moti në rajonin e ${region} — parashikimi për qytetet | Moti.com.al`,
      description: regionDescription(region, country, list.length),
      canonical,
      ogType: "website",
    });
    html = injectJsonLd(html, [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kryefaqja", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Vendbanimet", item: `${SITE}/vendbanimet` },
          { "@type": "ListItem", position: 3, name: region, item: canonical },
        ],
      },
    ]);
    html = injectBody(html, body);
    write(`rajoni/${slug}.html`, html);
    count++;
  }
}

// ─── Faqet e besimit (Rreth nesh, Kontakt, Privatësia, Kushtet) ──────────────
{
  const infoPages = [
    { path: "rreth-nesh", title: "Rreth nesh — Moti.com.al", h1: "Rreth Moti.com.al", desc: "Moti.com.al është platforma e parashikimit të motit për Shqipëri, Kosovë dhe Maqedoni, me të dhëna live nga MET/Yr.", p: "Moti.com.al ofron parashikime të sakta për çdo qytet e fshat në Shqipëri, Kosovë dhe Maqedoni. Të dhënat bazohen mbi MET Norway (Yr), një nga burimet më të besueshme në botë — temperatura, reshjet, era, lagështia, presioni dhe UV, orë-pas-ore dhe deri në 10 ditë." },
    { path: "kontakt", title: "Kontakt — Moti.com.al", h1: "Na kontaktoni", desc: "Kontaktoni ekipin e Moti.com.al për pyetje, sugjerime ose bashkëpunime.", p: "Për çdo pyetje, sugjerim ose bashkëpunim, na shkruani në info@moti.com.al. Vlerësojmë çdo koment që na ndihmon ta përmirësojmë shërbimin." },
    { path: "privatesia", title: "Politika e privatësisë — Moti.com.al", h1: "Politika e privatësisë", desc: "Si i trajton Moti.com.al të dhënat dhe privatësinë e përdoruesve.", p: "Moti.com.al respekton privatësinë tuaj. Faqja nuk kërkon regjistrim dhe nuk mbledh të dhëna personale identifikuese. Vendndodhja (nëse e lejoni) përdoret vetëm për të shfaqur motin e zonës dhe nuk ruhet në serverët tanë." },
    { path: "kushtet", title: "Kushtet e përdorimit — Moti.com.al", h1: "Kushtet e përdorimit", desc: "Kushtet e përdorimit të shërbimit Moti.com.al.", p: "Duke përdorur Moti.com.al ju pranoni këto kushte. Parashikimet janë informative dhe mund të ndryshojnë; për vendime kritike konsultoni burimet zyrtare meteorologjike. Të dhënat vijnë nga MET Norway (Yr)." },
  ];
  for (const info of infoPages) {
    const canonical = `${SITE}/${info.path}`;
    let html = setHead(template, { title: info.title, description: info.desc, canonical, ogType: "website" });
    const body = `
      <nav aria-label="Shtegu" style="font-size:13px;opacity:.7;margin-bottom:14px"><a href="/" style="color:#7fb4f5">Kryefaqja</a> › <span>${esc(info.h1)}</span></nav>
      <h1 style="font-size:28px;font-weight:800;margin:0 0 12px">${esc(info.h1)}</h1>
      <p style="opacity:.85;line-height:1.6;max-width:72ch">${esc(info.p)}</p>
    `;
    html = injectBody(html, body);
    write(`${info.path}.html`, html);
    count++;
  }
}

// ─── Kryefaqja (përmbajtje e lexueshme + linqe të brendshme) ─────────────────
{
  const popular = cities.filter((c) => c.isPopular).slice(0, 12);
  const body = `
    <h1 style="font-size:28px;font-weight:800;margin:0 0 10px">Parashikimi i motit për Shqipëri, Kosovë &amp; Maqedoni</h1>
    <p style="opacity:.85;max-width:72ch;line-height:1.6">Moti.com.al ofron parashikime të sakta orë-pas-ore dhe 10-ditore për çdo qytet e fshat, të përditësuara nga MET/Yr. Zgjidh vendbanimin tënd më poshtë ose kërko në krye.</p>
    <h2 style="font-size:20px;margin:22px 0 8px">Qytetet kryesore</h2>
    <p>${popular.map((c) => `<a href="/vendbanim/${esc(c.id)}" style="color:#7fb4f5;margin-right:14px;display:inline-block">${esc(c.nameAl)}</a>`).join("")}</p>
    <p style="margin-top:16px"><a href="/vendbanimet" style="color:#7fb4f5">→ Të gjitha vendbanimet</a></p>
    <p style="opacity:.6;margin-top:14px">⏳ Duke ngarkuar motin live…</p>
  `;
  const html = injectBody(template, body);
  write("index.html", html);
}

console.log(`✅ Prerender: ${count} faqe statike + kryefaqja`);
