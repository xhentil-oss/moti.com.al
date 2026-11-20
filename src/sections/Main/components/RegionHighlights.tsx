import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ALBANIAN_CITIES } from "../../../lib/albanianCities";
import { slugify } from "../../../../shared/cityContent.js";

// Rajonet kryesore → faqet /rajoni/:slug (të njëjtat si në footer).
const REGIONS = [
  { region: "Tiranë", title: "Rajoni i Tiranës", emoji: "🏙️" },
  { region: "Vlorë", title: "Rajoni i Vlorës", emoji: "🏖️" },
  { region: "Shkodër", title: "Rajoni i Shkodrës", emoji: "⛰️" },
  { region: "Prishtinë", title: "Rajoni i Prishtinës", emoji: "🌟" },
];

// Tre vendbanimet më të mëdha të çdo rajoni, nga lista statike.
function topCities(region: string) {
  return ALBANIAN_CITIES.filter((c) => c.region === region)
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, 3)
    .map((c) => c.nameAl);
}

export const RegionHighlights: React.FC = () => {
  return (
    <section aria-label="Rajonet" className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Sipas rajonit</h2>
      <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
        {REGIONS.map(({ region, title, emoji }) => (
          <Link
            key={region}
            to={`/rajoni/${slugify(region)}`}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.05] transition-colors group"
          >
            <span className="text-xl" aria-hidden="true">{emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/85">{title}</div>
              <div className="text-xs text-white/65 truncate">{topCities(region).join(" · ")}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-moti-sky transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
};
