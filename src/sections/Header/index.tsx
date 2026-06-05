import React, { useState, useEffect } from "react";
import { HeaderLogo } from "./components/HeaderLogo";
import { DesktopNav } from "./components/DesktopNav";
import { SearchBar } from "../../components/search/SearchBar";
import { useWeather } from "../../context/WeatherContext";
import { Menu, X, Sun, Moon, Thermometer } from "lucide-react";

export const Header: React.FC = () => {
  const { recentSearches, loadWeather, addRecentSearch, unit, setUnit, theme, setTheme } = useWeather();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSelect = (location: any) => {
    addRecentSearch(location);
    loadWeather(location);
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
            <SearchBar
              onSelect={handleSelect}
              recentSearches={recentSearches}
              placeholder="Kërko qytetin..."
            />
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-1.5 ml-3">
            <button
              onClick={() => setUnit(unit === "C" ? "F" : "C")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 border border-white/8 transition-all"
              aria-label="Ndrysho njësinë e temperaturës"
              title={`Ndrysho në ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              °{unit}
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-white/60 hover:text-white bg-white/6 hover:bg-white/12 border border-white/8 transition-all"
              aria-label="Ndrysho temën"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden ml-auto p-2 rounded-xl text-white/70 hover:text-white bg-white/6 hover:bg-white/12 transition-all"
            aria-label={mobileMenuOpen ? "Mbyll menunë" : "Hap menunë"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
            <DesktopNav mobile />
          </div>
        )}
      </div>
    </header>
  );
};
