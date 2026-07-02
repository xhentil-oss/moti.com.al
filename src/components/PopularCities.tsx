import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { POPULAR_CITIES } from "../lib/albanianCities";
import type { SearchResult } from "../types/weather";

interface PopularCitiesProps {
  onSelectCity: (city: SearchResult) => void;
  currentCityId?: string;
}

export const PopularCities: React.FC<PopularCitiesProps> = ({ onSelectCity, currentCityId }) => {
  return (
    <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-4 shadow-card animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Qytetet kryesore</h2>
        <Link to="/vendbanimet" className="text-xs text-moti-sky hover:text-moti-sky-light transition-colors font-medium">
          Shiko të gjitha →
        </Link>
      </div>
      <div className="space-y-1">
        {POPULAR_CITIES.map((city) => {
          const isActive = city.id === currentCityId;
          return (
            <div key={city.id} className="flex items-center gap-1">
              <button
                onClick={() => onSelectCity(city)}
                className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left group ${
                  isActive
                    ? "bg-moti-sky/15 border border-moti-sky/25 text-white"
                    : "text-white/65 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-moti-sky" : "text-white/65 group-hover:text-moti-sky/60"}`} />
                <span className="font-medium truncate">{city.nameAl}</span>
                <span className="ml-auto text-[11px] text-white/65 flex-shrink-0">{city.region}</span>
              </button>
              <Link
                to={`/vendbanim/${city.id}`}
                className="p-2 rounded-xl text-white/60 hover:text-moti-sky hover:bg-white/[0.05] transition-all flex-shrink-0"
                title={`Shiko faqen e ${city.nameAl}`}
                aria-label={`Detaje për ${city.nameAl}`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
