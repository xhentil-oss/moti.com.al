import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { POPULAR_CITIES } from "../lib/albanianCities";

interface PopularCitiesProps {
  currentCityId?: string;
}

// Çdo rresht është një lidhje e vetme te faqja e qytetit (si kërkimi).
export const PopularCities: React.FC<PopularCitiesProps> = ({ currentCityId }) => {
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
            <Link
              key={city.id}
              to={`/vendbanim/${city.id}`}
              title={`Moti në ${city.nameAl}`}
              aria-current={isActive ? "true" : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all group border ${
                isActive
                  ? "bg-moti-sky/15 border-moti-sky/25 text-white"
                  : "border-transparent text-white/65 hover:text-white hover:bg-white/[0.07]"
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-moti-sky" : "text-white/65 group-hover:text-moti-sky/60"}`} />
              <span className="font-medium truncate min-w-0">{city.nameAl}</span>
              {city.region && city.region !== city.nameAl && (
                <span className="ml-auto text-[11px] text-white/65 flex-shrink-0">{city.region}</span>
              )}
              <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 text-white/60 group-hover:text-moti-sky ${city.region && city.region !== city.nameAl ? "" : "ml-auto"}`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
