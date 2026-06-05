import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, MapPin, Clock, TrendingUp } from "lucide-react";
import type { SearchResult } from "../../types/weather";
import { useSearchLocations, usePopularCities } from "../../lib/albanianCities";

interface SearchBarProps {
  onSelect: (location: SearchResult) => void;
  recentSearches: SearchResult[];
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelect,
  recentSearches,
  placeholder = "Kërko qytetin...",
  autoFocus = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const { search: searchLocations } = useSearchLocations();
  const { cities: popularCities } = usePopularCities();

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    if (val.trim().length > 0) {
      const found = await searchLocations(val);
      setResults(found);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(true); // show recents/popular
    }
  }, [searchLocations]);

  const handleSelect = useCallback((location: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    setResults([]);
    onSelect(location);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = query ? results : recentSearches.length ? recentSearches : POPULAR_CITIES;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(list[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen;
  const displayList = query ? results : recentSearches.length ? recentSearches : popularCities;
  const sectionLabel = query ? "Rezultate" : recentSearches.length ? "Kërkimet e fundit" : "Qytetet e njohura";
  const sectionIcon = query ? null : recentSearches.length ? <Clock className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />;

  return (
    <div className="relative w-full">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-200
        ${isOpen ? "bg-moti-navy border-moti-sky/60 shadow-glow-sky ring-1 ring-moti-sky/20" : "bg-white/[0.08] border-white/[0.12] hover:border-white/20"}
      `}>
        <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Kërko qytetin"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
          className="flex-1 bg-transparent text-white placeholder-white/35 text-sm outline-none font-medium"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Fshi kërkimin"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Rezultatet e kërkimit"
          className="absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl border border-white/[0.10] bg-moti-navy-dark/95 backdrop-blur-xl shadow-premium overflow-hidden animate-slide-down"
        >
          {displayList.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/[0.06]">
                {sectionIcon}
                {sectionLabel}
              </div>
              {displayList.map((city, i) => (
                <button
                  key={city.id}
                  role="option"
                  aria-selected={activeIdx === i}
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    ${activeIdx === i ? "bg-white/[0.09]" : "hover:bg-white/[0.05]"}`}
                >
                  <MapPin className="w-4 h-4 text-moti-sky flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white leading-none">{city.nameAl}</div>
                    <div className="text-xs text-white/40 mt-0.5">{city.region}, {city.country}</div>
                  </div>
                  {city.population && (
                    <span className="text-xs text-white/30 flex-shrink-0">
                      {(city.population / 1000).toFixed(0)}k banorë
                    </span>
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-white/40 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Nuk u gjet asnjë qytet për &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};
