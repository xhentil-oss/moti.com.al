/**
 * Ndërton sitemap.xml nga lista e vendbanimeve ({ id, region, updatedAt? }).
 * Përdoret nga prerender.mjs (skedar statik /sitemap.xml) DHE nga backend-i (/api/sitemap.xml),
 * që të dy të japin të njëjtin rezultat.
 */
import { slugify } from "./cityContent.js";

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );
}

function isoDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
}

export function buildSitemapXml(rows, site = "https://moti.com.al") {
  const SITE = site.replace(/\/$/, "");
  const regionSlugs = [...new Set(rows.map((r) => slugify(r.region)).filter(Boolean))];

  const urls = [
    { loc: `${SITE}/`, changefreq: "hourly", priority: "1.0" },
    { loc: `${SITE}/vendbanimet`, changefreq: "daily", priority: "0.8" },
    ...regionSlugs.map((slug) => ({ loc: `${SITE}/rajoni/${slug}`, changefreq: "daily", priority: "0.6" })),
    { loc: `${SITE}/rreth-nesh`, changefreq: "monthly", priority: "0.3" },
    { loc: `${SITE}/kontakt`, changefreq: "monthly", priority: "0.3" },
    { loc: `${SITE}/privatesia`, changefreq: "yearly", priority: "0.2" },
    { loc: `${SITE}/kushtet`, changefreq: "yearly", priority: "0.2" },
    ...rows.map((r) => ({
      loc: `${SITE}/vendbanim/${encodeURIComponent(r.id)}`,
      lastmod: isoDate(r.updatedAt),
      changefreq: "hourly",
      priority: "0.7",
    })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url><loc>${xmlEscape(u.loc)}</loc>` +
        (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
        `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    )
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}
