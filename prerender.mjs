/**
 * Prerender / SSG për moti.com.al
 *
 * Ekzekutohet PAS `vite build`. Për çdo qytet gjeneron një HTML statik
 * (dist/vendbanim/<id>.html) me titull/meta/canonical/OG/JSON-LD dhe përmbajtje
 * të lexueshme nga crawler-at brenda HTML-it fillestar. JS-i ende ngarkohet dhe
 * e zëvendëson përmbajtjen me aplikacionin interaktiv (moti live) pas montimit.
 *
 * Burimi i qyteteve: server/seed/locations.json (437 qytetet kryesore).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const SEED = join(__dirname, "server", "seed", "locations.json");
const SITE = "https://moti.com.al";

// ─── Burimi i të dhënave ─────────────────────────────────────────────────────
if (!existsSync(SEED)) {
  console.log("seed/locations.json mungon — po e gjeneroj…");
  execFileSync(process.execPath, [join(__dirname, "server", "scripts", "build-seed.mjs")], {
    stdio: "inherit",
  });
}
const cities = JSON.parse(readFileSync(SEED, "utf8"));

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

const countryLabel = (c) =>
  c === "Albania" ? "Shqipëri" : c === "Kosovo" ? "Kosovë" : c === "Maqedonia e Veriut" ? "Maqedoni e Veriut" : c;

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
  const scripts = objs
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n");
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

// ─── Përmbajtja SEO për një qytet ────────────────────────────────────────────
function cityDescription(city) {
  return `${city.nameAl} ndodhet në rajonin e ${city.region}, ${countryLabel(city.country)}. Këtu gjeni parashikimin e detajuar të motit: temperatura, reshjet, era, lagështia dhe indeksi UV — orë-pas-ore dhe për 10 ditë, të përditësuara nga MET/Yr.`;
}

const faqs = (city) => [
  {
    q: `Sa është temperatura mesatare verore në ${city.nameAl}?`,
    a: `Temperatura mesatare gjatë verës (qershor–gusht) në ${city.nameAl} luhatet ndërmjet 24°C dhe 35°C, me kulme mbi 38°C gjatë valëve të nxehtit.`,
  },
  {
    q: `Kur është moti më i mirë për të vizituar ${city.nameAl}?`,
    a: `Periudha ideale për të vizituar ${city.nameAl} është nga maji deri në shtator, me mot të qëndrueshëm, shumë diell dhe temperatura të këndshme.`,
  },
  {
    q: `Sa reshje ka ${city.nameAl} gjatë vitit?`,
    a: `${city.nameAl} merr mesatarisht 700–1200 mm reshje në vit, kryesisht gjatë muajve nëntor–mars. Vera zakonisht është e thatë.`,
  },
];

function cityBody(city, others) {
  const facts = [
    ["Rajoni", city.region],
    ["Shteti", countryLabel(city.country)],
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
    <p style="opacity:.8;line-height:1.6;max-width:70ch">${esc(cityDescription(city))}</p>
    <p style="opacity:.6;margin-top:10px">⏳ Duke ngarkuar motin live nga MET/Yr…</p>

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Të dhëna për ${esc(city.nameAl)}</h2>
    <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">
      ${facts.map(([k, v]) => `<li style="background:#132843;padding:10px 12px;border-radius:10px"><strong style="color:#7fb4f5">${esc(k)}:</strong> ${esc(v)}</li>`).join("")}
    </ul>

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Pyetje të shpeshta për motin në ${esc(city.nameAl)}</h2>
    ${faqs(city)
      .map(
        (f) =>
          `<div style="background:#132843;padding:12px 14px;border-radius:10px;margin-bottom:8px"><h3 style="font-size:15px;margin:0 0 6px">${esc(f.q)}</h3><p style="opacity:.75;margin:0;line-height:1.55">${esc(f.a)}</p></div>`
      )
      .join("")}

    <h2 style="font-size:20px;font-weight:700;margin:24px 0 10px">Qytete të tjera</h2>
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
    description: `Parashikimi i motit për ${city.nameAl}, ${city.region}: temperatura, reshjet, era, orë-pas-ore dhe 10-ditor. Të dhëna live nga MET/Yr.`,
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

// ─── Kryefaqja (përmbajtje e lexueshme + linqe të brendshme) ─────────────────
{
  const popular = cities.filter((c) => c.isPopular).slice(0, 12);
  const body = `
    <h1 style="font-size:28px;font-weight:800;margin:0 0 10px">Parashikimi i motit për Shqipëri, Kosovë &amp; Maqedoni</h1>
    <p style="opacity:.8;max-width:70ch;line-height:1.6">Moti.com.al ofron parashikime të sakta orë-pas-ore dhe 10-ditore për çdo qytet e fshat, të përditësuara nga MET/Yr. Zgjidh vendbanimin tënd më poshtë ose kërko në krye.</p>
    <h2 style="font-size:20px;margin:22px 0 8px">Qytetet kryesore</h2>
    <p>${popular.map((c) => `<a href="/vendbanim/${esc(c.id)}" style="color:#7fb4f5;margin-right:14px;display:inline-block">${esc(c.nameAl)}</a>`).join("")}</p>
    <p style="margin-top:16px"><a href="/vendbanimet" style="color:#7fb4f5">→ Të gjitha vendbanimet</a></p>
    <p style="opacity:.6;margin-top:14px">⏳ Duke ngarkuar motin live…</p>
  `;
  const html = injectBody(template, body);
  write("index.html", html);
}

console.log(`✅ Prerender: ${count} faqe statike + kryefaqja (dist/vendbanim/*.html, vendbanimet.html, index.html)`);
