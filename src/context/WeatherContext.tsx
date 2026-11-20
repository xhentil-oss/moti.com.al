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
  /** ID e qytetit të ngarkuar (null për vendndodhjen GPS ose kur s'ka). */
  currentCityId: string | null;
}

// localStorage mund të mungojë (private mode, SSR) — çdo qasje në try/catch.
function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* injoro */
  }
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<LocationWeather | null>(null);
  const [loadingState, setLoadingState] = useState<AppState["loadingState"]>("idle");
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnitState] = useState<"C" | "F">(() => (readStore("moti.unit", "C") === "F" ? "F" : "C"));
  // Dark-only: dizajni (kartat navy) është dark; light-mode nuk mbështetet ende.
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const [currentCityId, setCurrentCityId] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    const v = readStore<SearchResult[]>("moti.recent", []);
    return Array.isArray(v) ? v.filter((r) => r && r.id && typeof r.lat === "number").slice(0, 8) : [];
  });
  const [showLocationPrompt, setShowLocationPrompt] = useState(() => !readStore("moti.locPromptDismissed", false));
  const cacheRef = useRef<Map<string, LocationWeather>>(new Map());

  const loadWeather = useCallback(async (location: SearchResult) => {
    const cacheKey = `${location.lat.toFixed(3)},${location.lon.toFixed(3)}`;
    setLoadingState("loading");
    setError(null);
    setCurrentCityId(location.id && location.id !== "current" ? location.id : null);
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
    writeStore("moti.locPromptDismissed", true);
  }, [loadWeather]);

  // Dark-only: sigurohu që klasa .dark është gjithmonë e pranishme.
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, [theme]);

  const setUnit = useCallback((u: "C" | "F") => {
    setUnitState(u);
    writeStore("moti.unit", u);
  }, []);
  const setTheme = useCallback((t: "dark" | "light") => setThemeState(t), []);

  const addRecentSearch = useCallback((location: SearchResult) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.id !== location.id);
      const next = [location, ...filtered].slice(0, 8);
      writeStore("moti.recent", next);
      return next;
    });
  }, []);

  const dismissLocationPrompt = useCallback(() => {
    setShowLocationPrompt(false);
    writeStore("moti.locPromptDismissed", true);
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather, loadingState, error, unit, theme, currentLocation,
      recentSearches, showLocationPrompt, currentCityId,
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
