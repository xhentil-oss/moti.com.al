import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { ALBANIAN_CITIES } from "../lib/albanianCities";
import { useSeo, SITE_URL } from "../lib/seo";
import { slugify, countryLabel, regionDescription } from "../../shared/cityContent.js";

export const RegionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const cities = ALBANIAN_CITIES.filter((c) => slugify(c.region) === slug).sort(
    (a, b) => (b.population ?? 0) - (a.population ?? 0)
  );
  const region = cities[0]?.region;
  const country = cities[0]?.country;

  useSeo(
    region
      ? {
          title: `Moti në rajonin e ${region} — parashikimi për qytetet | Moti.com.al`,
          description: regionDescription(region, country!, cities.length),
          canonical: `/rajoni/${slug}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Kryefaqja", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Vendbanimet", item: `${SITE_URL}/vendbanimet` },
              { "@type": "ListItem", position: 3, name: region, item: `${SITE_URL}/rajoni/${slug}` },
            ],
          },
        }
      : { title: "Rajoni nuk u gjet | Moti.com.al", description: "Rajoni nuk ekziston.", noindex: true }
  );

  if (!region) {
    return (
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-display font-bold text-white mb-3">Rajoni nuk u gjet</h1>
        <Link to="/vendbanimet" className="text-moti-sky">Shiko të gjitha vendbanimet</Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-6 pb-28 md:pb-12 pt-6">
      <nav aria-label="Shtegu i navigimit" className="flex items-center gap-1 text-xs text-white/70 mb-5">
        <Link to="/" className="hover:text-moti-sky transition-colors font-medium">Kryefaqja</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/vendbanimet" className="hover:text-moti-sky transition-colors font-medium">Vendbanimet</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/80 font-semibold">{region}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Moti në rajonin e {region}</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl leading-relaxed">
        {regionDescription(region, country!, cities.length)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cities.map((city) => (
          <Link
            key={city.id}
            to={`/vendbanim/${city.id}`}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-moti-navy-mid border border-white/[0.07] hover:border-moti-sky/30 transition-all group shadow-card"
          >
            <MapPin className="w-4 h-4 text-moti-sky/70 group-hover:text-moti-sky flex-shrink-0 transition-colors" />
            <div className="min-w-0">
              <div className="font-semibold text-white text-sm truncate">{city.nameAl}</div>
              <div className="text-white/65 text-xs truncate">{countryLabel(city.country)}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:text-moti-sky ml-auto flex-shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </main>
  );
};
