import React, { useState, useEffect } from "react";
import { HeaderLogo } from "./components/HeaderLogo";
import { DesktopNav } from "./components/DesktopNav";
import { SearchBar } from "../../components/search/SearchBar";
import { useLocation } from "react-router-dom";
import { useWeather } from "../../context/WeatherContext";
import { Search, X, Thermometer } from "lucide-react";

const UnitToggle: React.FC<{ unit: "C" | "F"; setUnit: (u: "C" | "F") => void; className?: string }> = ({ unit, setUnit, className = "" }) => (
  <button
    onClick={() => setUnit(unit === "C" ? "F" : "C")}
    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] transition-all ${className}`}
    aria-label={`Njësia e temperaturës: °${unit}. Ndrysho në ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
    title={`Ndrysho në ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
  >
    <Thermometer className="w-3.5 h-3.5" />
    °{unit}
  </button>
);

export const Header: React.FC = () => {
  const { recentSearches, addRecentSearch, unit, setUnit } = useWeather();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Mbyll panelin mobile sapo ndryshon faqja.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Te kryefaqja hero ka kërkimin e vet; ai i header-it shfaqet vetëm pasi hero del nga ekrani.
  const showHeaderSearch = pathname !== "/" || pastHero;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      setPastHero(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSelect = (location: any) => {
    // SearchBar navigon vetë te faqja e qytetit, e cila e ngarkon motin.
    addRecentSearch(location);
    setMobileMenuOpen(false);
  };

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-moti-navy-dark/90 backdrop-blur-xl border-b border-white/[0.07] shadow-header"
          : "bg-moti-navy"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 h-16 md:h-[68px]">
          {/* Logo */}
          <HeaderLogo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            <DesktopNav />
          </div>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-xs ml-auto">
            {showHeaderSearch && (
              <div className="w-full animate-fade-in">
                <SearchBar
                  onSelect={handleSelect}
                  recentSearches={recentSearches}
                  placeholder="Kërko qytetin..."
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-1.5 ml-3">
            <UnitToggle unit={unit} setUnit={setUnit} />
          </div>

          {/* Mobile: °C/°F + kërkimi (navigimi është te shiriti i poshtëm) */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <UnitToggle unit={unit} setUnit={setUnit} />
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-xl text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-all"
              aria-label={mobileMenuOpen ? "Mbyll kërkimin" : "Kërko qytetin"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.07] py-3 space-y-3 animate-slide-down">
            <SearchBar
              onSelect={handleSelect}
              recentSearches={recentSearches}
              placeholder="Kërko qytetin..."
              autoFocus
            />
          </div>
        )}
      </div>
    </header>
  );
};
