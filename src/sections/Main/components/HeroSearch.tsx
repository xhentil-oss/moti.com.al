import React from "react";
import { SearchBar } from "../../../components/search/SearchBar";
import type { SearchResult } from "../../../types/weather";

interface HeroSearchProps {
  onSelectCity: (city: SearchResult) => void;
  recentSearches: SearchResult[];
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSelectCity, recentSearches }) => {
  return (
    <section
      aria-label="Kërko motin"
      className="relative bg-gradient-to-b from-moti-navy-dark to-moti-navy pt-8 pb-10 px-4 md:px-6"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-moti-sky/8 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-moti-amber/6 blur-[60px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-moti-sky bg-moti-sky/10 border border-moti-sky/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-moti-sky animate-pulse" />
              Live • Të dhëna reale
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-1.5 leading-tight">
            Parashikimi i motit<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-moti-sky to-cyan-300">
              për Shqipëri, Kosovë &amp; Maqedoni
            </span>
          </h1>

          <p className="text-white/50 text-sm mb-5 max-w-lg">
            Parashikime të sakta orë-pas-ore dhe 10-ditore të hartuara mbi të dhënat e Yr/MET API.
          </p>

          <div className="max-w-lg">
            <SearchBar
              onSelect={onSelectCity}
              recentSearches={recentSearches}
              placeholder="Kërko qytetin tënd..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};
