import React, { useEffect } from "react";
import { useWeather } from "../../context/WeatherContext";
import { SearchBar } from "../../components/search/SearchBar";
import { CurrentWeatherCard } from "../../components/weather/CurrentWeatherCard";
import { HourlyForecast } from "../../components/weather/HourlyForecast";
import { DailyForecast } from "../../components/weather/DailyForecast";
import { WeatherAlertBanner } from "../../components/weather/WeatherAlertBanner";
import { PopularCities } from "../../components/PopularCities";
import { WeatherCardSkeleton, HourlyCardSkeleton } from "../../components/ui/Skeleton";
import { HeroSearch } from "./components/HeroSearch";
import { RegionHighlights } from "./components/RegionHighlights";
import { SEOContent } from "./components/SEOContent";
import { getCityById } from "../../lib/albanianCities";
import { useSeo, SITE_URL } from "../../lib/seo";
import type { SearchResult } from "../../types/weather";

export const Main: React.FC = () => {
  const { weather, loadingState, error, unit, loadWeather, addRecentSearch, recentSearches, currentLocation } = useWeather();

  useSeo({
    title: "Moti.com.al — Parashikimi i Motit për Shqipëri, Kosovë & Maqedoni",
    description:
      "Parashikimi i motit orë-pas-ore dhe 10-ditor për çdo qytet në Shqipëri, Kosovë dhe Maqedoninë e Veriut. Të dhëna live nga MET/Yr.",
    canonical: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Moti.com.al",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/og-default.png`,
      description: "Platforma e motit për Shqipëri, Kosovë dhe Maqedoninë e Veriut",
    },
  });

  // Load default city (Tirana) on mount
  useEffect(() => {
    const tirana = getCityById("tirana")!;
    loadWeather(tirana);
  }, []);

  const handleSelectCity = (city: SearchResult) => {
    addRecentSearch(city);
    loadWeather(city);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoading = loadingState === "loading";
  const hasWeather = loadingState === "success" && weather;

  return (
    <main id="main-content" aria-label="Parashikimi i motit">
      {/* Hero */}
      <HeroSearch onSelectCity={handleSelectCity} recentSearches={recentSearches} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 mt-6">
          {/* Left: main weather column */}
          <div className="space-y-5 min-w-0">
            {/* Alerts */}
            {hasWeather && weather.alerts.length > 0 && (
              <WeatherAlertBanner alerts={weather.alerts} />
            )}

            {/* Current weather */}
            {isLoading ? (
              <WeatherCardSkeleton />
            ) : hasWeather ? (
              <CurrentWeatherCard weather={weather} unit={unit} />
            ) : error ? (
              <ErrorState message={error} onRetry={() => { const t = getCityById("tirana")!; loadWeather(t); }} />
            ) : null}

            {/* Hourly forecast */}
            {isLoading ? (
              <HourlyCardSkeleton />
            ) : hasWeather ? (
              <HourlyForecast hourly={weather.hourly} unit={unit} />
            ) : null}

            {/* 10-day forecast */}
            {hasWeather && (
              <DailyForecast daily={weather.daily} unit={unit} />
            )}
          </div>

          {/* Right: sidebar */}
          <aside aria-label="Sidebar" className="space-y-5">
            <PopularCities
              onSelectCity={handleSelectCity}
              currentCityId={currentLocation ? ALBANIAN_CITIES_ID_MAP[`${currentLocation.lat.toFixed(3)},${currentLocation.lon.toFixed(3)}`] : undefined}
            />
            <RegionHighlights onSelectCity={handleSelectCity} />
          </aside>
        </div>

        {/* SEO Content */}
        <div className="mt-10">
          <SEOContent />
        </div>
      </div>
    </main>
  );
};

// helper for city id resolution
const ALBANIAN_CITIES_ID_MAP: Record<string, string> = {};
import { ALBANIAN_CITIES } from "../../lib/albanianCities";
ALBANIAN_CITIES.forEach((c) => {
  ALBANIAN_CITIES_ID_MAP[`${c.lat.toFixed(3)},${c.lon.toFixed(3)}`] = c.id;
});

// ─── Error State ──────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center animate-fade-in">
      <div className="text-3xl mb-3">⚠️</div>
      <div className="text-white/80 font-medium mb-4">{message}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-sm font-semibold transition-all"
      >
        Provo përsëri
      </button>
    </div>
  );
}
