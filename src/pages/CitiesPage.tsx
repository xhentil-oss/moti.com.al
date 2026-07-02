import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { ALBANIAN_CITIES } from "../lib/albanianCities";
import { useSeo, SITE_URL } from "../lib/seo";

const COUNTRY_FLAGS: Record<string, string> = {
  Albania: "🇦🇱",
  Kosovo: "🇽🇰",
  "Maqedonia e Veriut": "🇲🇰",
};

export const CitiesPage: React.FC = () => {
  useSeo({
    title: "Të gjitha vendbanimet — Moti për qytetet e Shqipërisë, Kosovës & Maqedonisë | Moti.com.al",
    description:
      "Lista e plotë e qyteteve dhe fshatrave me parashikim moti: Shqipëri, Kosovë dhe Maqedoni e Veriut. Zgjidh vendbanimin për motin live, orar dhe 10-ditor.",
    canonical: "/vendbanimet",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kryefaqja", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Vendbanimet", item: `${SITE_URL}/vendbanimet` },
      ],
    },
  });

  const byCountry = ALBANIAN_CITIES.reduce<Record<string, typeof ALBANIAN_CITIES>>((acc, c) => {
    if (!acc[c.country]) acc[c.country] = [];
    acc[c.country].push(c);
    return acc;
  }, {});

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-6 pb-28 md:pb-12 pt-6">
      {/* Breadcrumb */}
      <nav aria-label="Shtegun navigimi" className="flex items-center gap-1 text-xs text-white/50 mb-6">
        <Link to="/" className="hover:text-moti-sky transition-colors font-medium">Kryefaqja</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/80 font-semibold">Vendbanimet</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Të gjitha vendbanimet</h1>
      <p className="text-white/50 text-sm mb-8">Parashikimi i motit për çdo qytet dhe vendbanim shqiptar</p>

      {Object.entries(byCountry).map(([country, cities]) => (
        <section key={country} className="mb-8">
          <h2 className="text-lg font-bold text-white/80 mb-3 flex items-center gap-2">
            <span>{COUNTRY_FLAGS[country] ?? "🌍"}</span>
            {country === "Albania" ? "Shqipëri" : country === "Kosovo" ? "Kosovë" : country}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {cities.map((city) => (
              <Link
                key={city.id}
                to={`/vendbanim/${city.id}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-moti-navy-mid border border-white/[0.07] hover:border-moti-sky/30 hover:bg-moti-navy-light transition-all group shadow-card"
              >
                <MapPin className="w-4 h-4 text-moti-sky/70 group-hover:text-moti-sky flex-shrink-0 transition-colors" />
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm truncate">{city.nameAl}</div>
                  <div className="text-white/40 text-xs truncate">{city.region}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-moti-sky ml-auto flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};
