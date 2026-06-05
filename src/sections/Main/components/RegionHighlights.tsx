import React from "react";
import { ChevronRight } from "lucide-react";
import type { SearchResult } from "../../../types/weather";

const REGIONS = [
  { name: "Shqipëria Qendrore", cities: ["Tiranë", "Elbasan", "Kavajë"], emoji: "🏙️", lat: 41.3275, lon: 19.8187, id: "tirana" },
  { name: "Shqipëria Jugore", cities: ["Vlorë", "Sarandë", "Gjirokastër"], emoji: "🏖️", lat: 40.4667, lon: 19.4833, id: "vlore" },
  { name: "Shqipëria Veriore", cities: ["Shkodër", "Lezhë", "Kukës"], emoji: "⛰️", lat: 42.0683, lon: 19.5126, id: "shkoder" },
  { name: "Kosova", cities: ["Prishtinë", "Prizren", "Pejë"], emoji: "🌟", lat: 42.6629, lon: 21.1655, id: "pristina" },
];

interface RegionHighlightsProps {
  onSelectCity: (city: SearchResult) => void;
}

export const RegionHighlights: React.FC<RegionHighlightsProps> = ({ onSelectCity }) => {
  return (
    <section aria-label="Rajonet" className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Sipas rajonit</h2>
      <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
        {REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectCity({
              id: region.id,
              name: region.name,
              nameAl: region.name,
              region: region.name,
              country: region.id === "pristina" ? "Kosovo" : "Albania",
              lat: region.lat,
              lon: region.lon,
            })}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.05] transition-colors group"
          >
            <span className="text-xl">{region.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/85">{region.name}</div>
              <div className="text-xs text-white/35 truncate">{region.cities.join(" · ")}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors" />
          </button>
        ))}
      </div>
    </section>
  );
};
