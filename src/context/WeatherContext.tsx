import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { LocationWeather, SearchResult, LocationInfo, AppState } from "../types/weather";
import { fetchYrForecast, adaptYrResponse, generateMockWeather } from "../lib/yrApi";

interface WeatherContextValue extends AppState {
  loadWeather: (location: SearchResult) => Promise<void>;
  loadByCoords: (lat: number, lon: number) => Promise<void>;
  setUnit: (unit: "C" | "F") => void;
  setTheme: (theme: "dark" | "light") => void;
  addRecentSearch: (location: SearchResult) => void;
  dismissLocationPrompt: () => void;
  showLocationPrompt: boolean;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<LocationWeather | null>(null);
  const [loadingState, setLoadingState] = useState<AppState["loadingState"]>("idle");
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnitState] = useState<"C" | "F">("C");
  const prefersDark =
    typeof window !== "undefined"
      ? (localStorage.getItem("moti-theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"))
      : "dark";
  const [theme, setThemeState] = useState<"dark" | "light">(prefersDark as "dark" | "light");
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const cacheRef = useRef<Map<string, LocationWeather>>(new Map());

  const loadWeather = useCallback(async (location: SearchResult) => {
    const cacheKey = `${location.lat.toFixed(3)},${location.lon.toFixed(3)}`;
    setLoadingState("loading");
    setError(null);
    try {
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        setWeather(cached);
        setCurrentLocation(cached.location);
        setLoadingState("success");
        return;
      }
      const locInfo: LocationInfo = {
        name: location.name,
        nameAl: location.nameAl,
        region: location.region,
        country: location.country,
        countryCode: location.country === "Albania" ? "AL" : location.country === "Kosovo" ? "XK" : "MK",
        lat: location.lat,
        lon: location.lon,
        timezone: "Europe/Tirane",
      };
      let result: LocationWeather;
      try {
        const yrData = await fetchYrForecast(location.lat, location.lon);
        result = adaptYrResponse(yrData, locInfo);
        console.log(`[Moti] Real weather loaded: ${locInfo.nameAl} ${result.current.temperature}°C`);
      } catch (apiErr) {
        console.warn("[Moti] Yr API unavailable, using mock data:", apiErr);
        result = generateMockWeather(locInfo);
      }
      // Always update cache with fresh result
      cacheRef.current.set(cacheKey, result);
      setWeather(result);
      setCurrentLocation(locInfo);
      setLoadingState("success");
    } catch (e) {
      setError("Nuk mund të ngarkojmë parashikimin. Provoni përsëri.");
      setLoadingState("error");
    }
  }, []);

  const loadByCoords = useCallback(async (lat: number, lon: number) => {
    const closest: SearchResult = {
      id: "current",
      name: "Vendndodhja juaj",
      nameAl: "Vendndodhja juaj",
      region: "",
      country: "Albania",
      lat,
      lon,
    };
    await loadWeather(closest);
    setShowLocationPrompt(false);
  }, [loadWeather]);

  // Sync .dark class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("moti-theme", theme);
  }, [theme]);

  const setUnit = useCallback((u: "C" | "F") => setUnitState(u), []);
  const setTheme = useCallback((t: "dark" | "light") => setThemeState(t), []);

  const addRecentSearch = useCallback((location: SearchResult) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.id !== location.id);
      return [location, ...filtered].slice(0, 8);
    });
  }, []);

  const dismissLocationPrompt = useCallback(() => setShowLocationPrompt(false), []);

  return (
    <WeatherContext.Provider value={{
      weather, loadingState, error, unit, theme, currentLocation,
      recentSearches, showLocationPrompt,
      loadWeather, loadByCoords, setUnit, setTheme, addRecentSearch,
      dismissLocationPrompt,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within WeatherProvider");
  return ctx;
}
