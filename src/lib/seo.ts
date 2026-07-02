import { useEffect } from "react";

/**
 * Hook qendror për SEO per-faqe: titull, meta description, canonical, Open Graph,
 * Twitter cards, robots dhe JSON-LD. Pa varësi të jashtme.
 *
 * Punon në kohë ekzekutimi (client) dhe kapet nga prerender-i (DOM serialization),
 * ndaj përgatit edhe hapin e ardhshëm SSG.
 */

export const SITE_URL = "https://moti.com.al";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export interface SeoOptions {
  title: string;
  description: string;
  /** Rrugë (/vendbanim/tirana) ose URL e plotë. Nëse mungon, merret pathname aktual. */
  canonical?: string;
  image?: string;
  /** og:type — "website" (default) ose "article" */
  type?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo(opts: SeoOptions) {
  const key = JSON.stringify(opts);
  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const canonical = opts.canonical
      ? opts.canonical.startsWith("http")
        ? opts.canonical
        : SITE_URL + opts.canonical
      : SITE_URL + path;
    const image = opts.image || DEFAULT_OG_IMAGE;

    document.title = opts.title;
    upsertMeta("name", "description", opts.description);
    upsertMeta("name", "robots", opts.noindex ? "noindex, nofollow" : "index, follow");

    // Canonical
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    // Open Graph
    upsertMeta("property", "og:title", opts.title);
    upsertMeta("property", "og:description", opts.description);
    upsertMeta("property", "og:type", opts.type || "website");
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:site_name", "Moti.com.al");
    upsertMeta("property", "og:locale", "sq_AL");
    upsertMeta("property", "og:image", image);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", opts.title);
    upsertMeta("name", "twitter:description", opts.description);
    upsertMeta("name", "twitter:image", image);

    // JSON-LD specifik i faqes
    const scriptId = "page-jsonld";
    document.getElementById(scriptId)?.remove();
    if (opts.jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = scriptId;
      s.textContent = JSON.stringify(opts.jsonLd);
      document.head.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
