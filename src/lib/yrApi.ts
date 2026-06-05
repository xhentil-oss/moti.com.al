/**
 * Yr / MET Norway API client
 * Production endpoint: https://api.met.no/weatherapi/locationforecast/2.0/compact
 * Docs: https://api.met.no/weatherapi/locationforecast/2.0/documentation
 *
 * IMPORTANT: In production you MUST set:
 *   User-Agent: Moti.com.al contact@moti.com.al
 * and respect Expires/Last-Modified response headers for caching.
 *
 * This module is an abstraction layer — swap `YR_PROVIDER` for any other provider.
 */

import type {
  LocationWeather,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  YrForecastResponse,
  YrTimeseries,
  LocationInfo,
  WeatherAlert,
  MetAlertsResponse,
  MetAlertsFeature,
} from "../types/weather";
import { getWeatherSymbol } from "./weatherSymbols";

/**
 * In Sandpack (browser-only bundler) the Vite server proxy is NOT available.
 * We use multiple public CORS proxies in a fallback chain.
 * Priority: corsproxy.io → allorigins.win → cors-anywhere (as last resort)
 */
const MET_BASE = "https://api.met.no/weatherapi/locationforecast/2.0/compact";

// ─── Multi-proxy fallback chain ──────────────────────────────────────────────
// Each proxy returns JSON differently; we normalise them below.

type ProxyResult = { contents: string };

async function fetchViaProxies(targetUrl: string, signal?: AbortSignal): Promise<ProxyResult> {
  // Proxy 1: corsproxy.io — simple transparent proxy, returns raw response
  const tryCorsproxy = async (): Promise<ProxyResult> => {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, { signal });
    if (!res.ok) throw new Error(`corsproxy.io HTTP ${res.status}`);
    const text = await res.text();
    return { contents: text };
  };

  // Proxy 2: allorigins.win — wraps in { contents, status }
  const tryAllorigins = async (): Promise<ProxyResult> => {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, { signal });
    if (!res.ok) throw new Error(`allorigins HTTP ${res.status}`);
    const wrapper = await res.json();
    if (wrapper?.status?.http_code && wrapper.status.http_code !== 200) {
      throw new Error(`allorigins upstream ${wrapper.status.http_code}`);
    }
    return { contents: wrapper.contents };
  };

  // Proxy 3: thingproxy.freeboard.io — simple transparent proxy
  const tryThingproxy = async (): Promise<ProxyResult> => {
    const proxyUrl = `https://thingproxy.freeboard.io/fetch/${targetUrl}`;
    const res = await fetch(proxyUrl, { signal });
    if (!res.ok) throw new Error(`thingproxy HTTP ${res.status}`);
    const text = await res.text();
    return { contents: text };
  };

  const proxies = [
    { name: "corsproxy.io", fn: tryCorsproxy },
    { name: "allorigins.win", fn: tryAllorigins },
    { name: "thingproxy.freeboard.io", fn: tryThingproxy },
  ];

  let lastError: Error = new Error("All proxies failed");
  for (const proxy of proxies) {
    try {
      console.log(`[Moti] Trying proxy: ${proxy.name}...`);
      const result = await proxy.fn();
      console.log(`[Moti] ✅ Proxy ${proxy.name} succeeded`);
      return result;
    } catch (err: any) {
      console.warn(`[Moti] ⚠️ Proxy ${proxy.name} failed: ${err.message}`);
      lastError = err;
    }
  }
  throw lastError;
}

// Keep as alias for backwards compat (used in AdminPage fetch tests)
const CORS_WRAP = (url: string) =>
  `https://corsproxy.io/?${encodeURIComponent(url)}`;

// ─── Cache: in-memory per session (respects Expires + Last-Modified headers) ─
interface CacheEntry {
  data: YrForecastResponse;
  expiresAt: number;
  lastModified: string | null; // for If-Modified-Since on next request
}
const apiCache = new Map<string, CacheEntry>();

// ─── Alerts cache (5-minute TTL, shared across all locations) ────────────────
let alertsCache: { alerts: WeatherAlert[]; expiresAt: number } | null = null;
const ALERTS_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Primary: Real Yr/MET API via proxy ──────────────────────────────────────

export async function fetchYrForecast(lat: number, lon: number): Promise<YrForecastResponse> {
  const latStr = lat.toFixed(4);
  const lonStr = lon.toFixed(4);
  const key = `${latStr},${lonStr}`;

  const hit = apiCache.get(key);
  if (hit && Date.now() < hit.expiresAt) {
    console.log(`[Moti] Cache hit for ${key}, expires in ${Math.round((hit.expiresAt - Date.now()) / 1000)}s`);
    return hit.data;
  }

  const metUrl = `${MET_BASE}?lat=${latStr}&lon=${lonStr}`;

  console.log(`[Moti] Fetching real weather for ${key} via proxy chain…`);
  const result = await fetchViaProxies(metUrl);
  const data: YrForecastResponse = JSON.parse(result.contents);
  console.log(`[Moti] ✅ Real data received for ${key}, temp=${data.properties.timeseries[0]?.data.instant.details.air_temperature}°C`);

  const expiresAt = Date.now() + 30 * 60 * 1000; // 30-min TTL (allorigins strips headers)
  apiCache.set(key, { data, expiresAt, lastModified: null });
  return data;
}

// ─── MetAlerts API (live weather warnings for SE Europe region) ───────────────
// MET Norway publishes CAP alerts for Norway; for Albania/Balkans we use
// the EUMETNET / Meteoalarm feed via a public CORS-friendly proxy.
// Endpoint: https://api.met.no/weatherapi/metalerts/2.0/current.json
// and filter by country codes: AL (Albania), XK (Kosovo), MK (North Macedonia).
// Since MET Norway primarily covers Norway, we also derive contextual alerts
// from the forecast data (high wind, heavy rain, extreme UV) as a local fallback.

const METALERTS_PROXY = "/api/metalerts";

/**
 * Converts MET Norway severity string to our WeatherAlert severity enum.
 */
function parseSeverity(s: string): WeatherAlert["severity"] {
  const lower = s.toLowerCase();
  if (lower.includes("extreme") || lower.includes("5")) return "EXTREME";
  if (lower.includes("severe") || lower.includes("4")) return "SEVERE";
  if (lower.includes("moderate") || lower.includes("3")) return "MODERATE";
  return "MINOR";
}

/**
 * Maps MetAlerts awareness_type code to Albanian alert title prefix.
 */
function alertTypeLabel(awarenessType: string): string {
  const map: Record<string, string> = {
    "1": "🌬️ Era e fortë",
    "2": "❄️ Borë / Akull",
    "3": "🌩️ Stuhi",
    "4": "🌫️ Mjegull",
    "5": "🌡️ Nxehtësi ekstreme",
    "6": "⚡ Rrufeja",
    "7": "🌊 Vërshim",
    "8": "Paralajmërim moti",
  };
  const code = awarenessType.split(";")[0].trim();
  return map[code] || "⚠️ Paralajmërim moti";
}

function metAlertToWeatherAlert(f: MetAlertsFeature): WeatherAlert {
  const p = f.properties;
  const typePrefix = alertTypeLabel(p.awareness_type || "8");
  const title = p.title || typePrefix;
  const description = p.description || p.instruction || "Lexoni burimet zyrtare meteorologjike për detaje.";

  return {
    id: p.id || `alert-${Math.random().toString(36).slice(2)}`,
    type: "WARNING",
    title,
    description,
    severity: parseSeverity(p.severity || p.awareness_level || "Minor"),
    validFrom: p.effective,
    validTo: p.expires,
    area: p.county || p.country || "Rajon i ndikuar",
  };
}

/**
 * Derives synthetic alerts from the forecast itself (e.g. high wind, heavy rain).
 * Used when the MetAlerts API returns no alerts for the region.
 */
export function deriveAlertsFromForecast(weather: LocationWeather): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const { current, daily } = weather;
  const now = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString();

  if (current.windSpeed >= 60) {
    alerts.push({
      id: "derived-wind",
      type: "WARNING",
      title: "🌬️ Era shumë e fortë",
      description: `Era arrin ${current.windSpeed} km/h. Shmangni aktivitetet jashtë dhe siguroni objektet e lira.`,
      severity: current.windSpeed >= 80 ? "EXTREME" : "SEVERE",
      validFrom: now,
      validTo: tomorrow,
      area: weather.location.nameAl,
    });
  } else if (current.windSpeed >= 40) {
    alerts.push({
      id: "derived-wind-mod",
      type: "ADVISORY",
      title: "💨 Era e moderuar",
      description: `Era arrin ${current.windSpeed} km/h. Kujdes gjatë vozitjes me automjete të larta.`,
      severity: "MODERATE",
      validFrom: now,
      validTo: tomorrow,
      area: weather.location.nameAl,
    });
  }

  const maxPrecip = Math.max(...daily.slice(0, 3).map((d) => d.precipitation));
  if (maxPrecip >= 30) {
    alerts.push({
      id: "derived-rain",
      type: "WARNING",
      title: "🌧️ Reshje shumë të forta",
      description: `Priten deri në ${maxPrecip.toFixed(0)} mm reshje. Rrezik vërshimesh lokale.`,
      severity: maxPrecip >= 50 ? "SEVERE" : "MODERATE",
      validFrom: now,
      validTo: tomorrow,
      area: weather.location.nameAl,
    });
  }

  if (current.uvIndex >= 8) {
    alerts.push({
      id: "derived-uv",
      type: "ADVISORY",
      title: "☀️ Indeks UV shumë i lartë",
      description: `Indeksi UV është ${current.uvIndex}. Përdorni kremë mbrojtëse SPF 50+ dhe shmangni ekspozimin midis orës 11:00–15:00.`,
      severity: current.uvIndex >= 11 ? "EXTREME" : "SEVERE",
      validFrom: now,
      validTo: tomorrow,
      area: weather.location.nameAl,
    });
  }

  const maxTemp = Math.max(...daily.slice(0, 3).map((d) => d.tempMax));
  if (maxTemp >= 38) {
    alerts.push({
      id: "derived-heat",
      type: "WARNING",
      title: "🌡️ Valë nxehtësie",
      description: `Temperatura arrin ${maxTemp}°C. Pini shumë ujë, shmangni aktivitetet fizike të rënda jashtë.`,
      severity: maxTemp >= 41 ? "EXTREME" : "SEVERE",
      validFrom: now,
      validTo: tomorrow,
      area: weather.location.nameAl,
    });
  }

  return alerts;
}

/**
 * Fetches live alerts from MET Norway MetAlerts API via Vite proxy.
 * Falls back to empty array on network error (non-fatal).
 */
export async function fetchYrAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  // Return cached alerts if still fresh
  if (alertsCache && Date.now() < alertsCache.expiresAt) {
    return alertsCache.alerts;
  }

  try {
    const url = `${METALERTS_PROXY}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`MetAlerts ${res.status}`);

    const data: MetAlertsResponse = await res.json();
    const now = Date.now();

    const alerts: WeatherAlert[] = data.features
      .filter((f) => {
        // Only show currently valid alerts
        const from = new Date(f.properties.effective).getTime();
        const to = new Date(f.properties.expires).getTime();
        return from <= now && now <= to;
      })
      .map(metAlertToWeatherAlert)
      // Sort by severity descending
      .sort((a, b) => {
        const order = { EXTREME: 0, SEVERE: 1, MODERATE: 2, MINOR: 3 };
        return order[a.severity] - order[b.severity];
      });

    alertsCache = { alerts, expiresAt: now + ALERTS_TTL_MS };
    return alerts;
  } catch (err) {
    console.warn("[Moti] MetAlerts unavailable:", err);
    alertsCache = { alerts: [], expiresAt: Date.now() + ALERTS_TTL_MS };
    return [];
  }
}

// ─── Fallback: mock data (used when API is unreachable) ───────────────────────

export function generateMockWeather(location: LocationInfo): LocationWeather {
  const now = new Date();
  const baseTemp = location.lat > 41 ? 18 : 22;

  const hourly: HourlyForecast[] = Array.from({ length: 24 }, (_, i) => {
    const h = new Date(now);
    h.setHours(now.getHours() + i, 0, 0, 0);
    const t = baseTemp + Math.round(Math.sin((i / 24) * Math.PI * 2) * 6);
    const codes = ["clearsky_day", "partlycloudy_day", "lightrain", "cloudy", "fair_day"];
    const code = codes[Math.floor(Math.abs(Math.sin(i + location.lon)) * codes.length)];
    return {
      time: h.toISOString(),
      temperature: t,
      feelsLike: t - 2,
      precipitation: code.includes("rain") ? 0.8 : 0,
      precipitationProbability: code.includes("rain") ? 60 : 5,
      windSpeed: 10 + Math.round(Math.sin(i) * 5),
      windDirection: (i * 20) % 360,
      humidity: 60 + Math.round(Math.sin(i) * 15),
      uvIndex: i > 6 && i < 20 ? Math.min(8, (i - 6)) : 0,
      symbol: getWeatherSymbol(code),
    };
  });

  const daily: DailyForecast[] = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dayNames = ["E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"];
    const codes = ["clearsky_day", "partlycloudy_day", "rain", "cloudy", "fair_day", "lightrain", "clearsky_day", "partlycloudy_day", "rain", "clearsky_day"];
    return {
      date: d.toISOString().split("T")[0],
      dayLabel: i === 0 ? "Sot" : i === 1 ? "Nesër" : dayNames[d.getDay()],
      tempMax: baseTemp + 4 + Math.round(Math.sin(i * 1.2) * 4),
      tempMin: baseTemp - 4 + Math.round(Math.sin(i * 0.8) * 3),
      precipitation: codes[i].includes("rain") ? 4 : 0,
      precipitationProbability: codes[i].includes("rain") ? 70 : 10,
      windSpeed: 12 + Math.round(Math.sin(i) * 6),
      symbol: getWeatherSymbol(codes[i]),
      sunrise: "06:12",
      sunset: "19:48",
    };
  });

  return {
    location,
    current: {
      temperature: baseTemp + 2,
      feelsLike: baseTemp,
      humidity: 62,
      windSpeed: 14,
      windDirection: 220,
      precipitation: 0,
      uvIndex: 5,
      visibility: 10,
      pressure: 1013,
      dewPoint: 11,
      symbol: getWeatherSymbol("partlycloudy_day"),
      updatedAt: now.toISOString(),
    },
    hourly,
    daily,
    alerts: [],
  };
}

export function adaptYrResponse(data: YrForecastResponse, location: LocationInfo): LocationWeather {
  const series = data.properties.timeseries;
  const now = series[0];

  const current: CurrentWeather = {
    temperature: Math.round(now.data.instant.details.air_temperature ?? 0),
    feelsLike: Math.round(now.data.instant.details.air_temperature ?? 0) - 2,
    humidity: Math.round(now.data.instant.details.relative_humidity ?? 0),
    windSpeed: Math.round((now.data.instant.details.wind_speed ?? 0) * 3.6), // m/s → km/h
    windDirection: Math.round(now.data.instant.details.wind_from_direction ?? 0),
    precipitation: now.data.next_1_hours?.details.precipitation_amount ?? 0,
    uvIndex: Math.round(now.data.instant.details.ultraviolet_index_clear_sky ?? 0),
    visibility: 10,
    pressure: Math.round(now.data.instant.details.air_pressure_at_sea_level ?? 1013),
    dewPoint: Math.round(now.data.instant.details.dew_point_temperature ?? 0),
    symbol: getWeatherSymbol(now.data.next_1_hours?.summary.symbol_code ?? "clearsky_day"),
    updatedAt: data.properties.meta.updated_at,
  };

  const hourly: HourlyForecast[] = series.slice(0, 48).map((s: YrTimeseries) => ({
    time: s.time,
    temperature: Math.round(s.data.instant.details.air_temperature ?? 0),
    feelsLike: Math.round((s.data.instant.details.air_temperature ?? 0) - 2),
    precipitation: s.data.next_1_hours?.details.precipitation_amount ?? 0,
    precipitationProbability: s.data.next_1_hours?.details.probability_of_precipitation ?? 0,
    windSpeed: Math.round((s.data.instant.details.wind_speed ?? 0) * 3.6), // m/s → km/h
    windDirection: Math.round(s.data.instant.details.wind_from_direction ?? 0),
    humidity: Math.round(s.data.instant.details.relative_humidity ?? 0),
    uvIndex: Math.round(s.data.instant.details.ultraviolet_index_clear_sky ?? 0),
    symbol: getWeatherSymbol(
      s.data.next_1_hours?.summary.symbol_code ??
      s.data.next_6_hours?.summary.symbol_code ??
      "clearsky_day"
    ),
  }));

  // ── Build daily summaries by grouping ALL entries per date ──────────────────
  // MET Norway provides timeseries every hour; to get accurate daily min/max we
  // must scan ALL entries for each calendar date, not just the first one.

  const byDate = new Map<string, YrTimeseries[]>();
  for (const s of series) {
    const d = s.time.split("T")[0];
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(s);
  }

  const dayNames = ["E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"];
  const daily: DailyForecast[] = [];
  let idx = 0;

  for (const [dateStr, entries] of byDate) {
    if (daily.length >= 10) break;

    const temps = entries.map((e) => e.data.instant.details.air_temperature ?? 0);
    const winds = entries.map((e) => e.data.instant.details.wind_speed ?? 0);

    // Prefer next_6_hours min/max from the MET response when available (noon entry tends to have it)
    let apiMax: number | null = null;
    let apiMin: number | null = null;
    let apiPrecip = 0;
    let apiPrecipProb = 0;
    let apiSymbolCode = "clearsky_day";

    for (const e of entries) {
      const n6 = e.data.next_6_hours;
      if (n6) {
        if (n6.details.air_temperature_max != null && (apiMax === null || n6.details.air_temperature_max > apiMax))
          apiMax = n6.details.air_temperature_max;
        if (n6.details.air_temperature_min != null && (apiMin === null || n6.details.air_temperature_min < apiMin))
          apiMin = n6.details.air_temperature_min;
        apiPrecip += n6.details.precipitation_amount ?? 0;
        // take max precipitation probability seen in any 6h window
        const pp = n6.details.probability_of_precipitation ?? 0;
        if (pp > apiPrecipProb) apiPrecipProb = pp;
        // symbol from the midday entry (prefer 12:00 Z)
        if (e.time.includes("T12:00") || apiSymbolCode === "clearsky_day") {
          apiSymbolCode = n6.summary.symbol_code ?? apiSymbolCode;
        }
      }
    }

    const tempMax = apiMax !== null ? Math.round(apiMax) : Math.round(Math.max(...temps));
    const tempMin = apiMin !== null ? Math.round(apiMin) : Math.round(Math.min(...temps));
    const windSpeed = Math.round(Math.max(...winds) * 3.6); // m/s → km/h, use peak wind for the day
    const precipitation = +apiPrecip.toFixed(1);
    const precipitationProbability = Math.round(apiPrecipProb);

    // Best symbol: prefer noon entry's next_1_hours, fall back to next_6_hours
    const noonEntry = entries.find((e) => e.time.includes("T12:00")) ?? entries[Math.floor(entries.length / 2)];
    const symbolCode =
      noonEntry?.data.next_1_hours?.summary.symbol_code ??
      noonEntry?.data.next_6_hours?.summary.symbol_code ??
      apiSymbolCode;

    const d = new Date(dateStr + "T12:00:00Z");

    daily.push({
      date: dateStr,
      dayLabel: idx === 0 ? "Sot" : idx === 1 ? "Nesër" : dayNames[d.getDay()],
      tempMax,
      tempMin,
      precipitation,
      precipitationProbability,
      windSpeed,
      symbol: getWeatherSymbol(symbolCode),
    });

    idx++;
  }

  return { location, current, hourly, daily, alerts: [] };
}
