import type { WeatherSymbol } from "../types/weather";

// Yr symbol code → emoji + Albanian label mapping
// Production: use actual Yr SVG icons at /assets/weathericons/
const SYMBOL_MAP: Record<string, { emoji: string; label: string }> = {
  clearsky_day: { emoji: "☀️", label: "Diell" },
  clearsky_night: { emoji: "🌙", label: "Natë e qartë" },
  clearsky_polartwilight: { emoji: "🌅", label: "Diell polar" },
  fair_day: { emoji: "🌤️", label: "Kryesisht me diell" },
  fair_night: { emoji: "🌙", label: "Kryesisht qartë" },
  partlycloudy_day: { emoji: "⛅", label: "Pjesërisht me re" },
  partlycloudy_night: { emoji: "☁️", label: "Pjesërisht me re" },
  cloudy: { emoji: "☁️", label: "Me re" },
  lightrainshowers_day: { emoji: "🌦️", label: "Shi i lehtë" },
  lightrainshowers_night: { emoji: "🌧️", label: "Shi i lehtë" },
  rainshowers_day: { emoji: "🌧️", label: "Shi" },
  rainshowers_night: { emoji: "🌧️", label: "Shi" },
  heavyrainshowers_day: { emoji: "🌧️", label: "Shi i rëndë" },
  heavyrainshowers_night: { emoji: "🌧️", label: "Shi i rëndë" },
  lightrainshowersandthunder_day: { emoji: "⛈️", label: "Shi me bubullimë" },
  rainshowersandthunder_day: { emoji: "⛈️", label: "Shi me bubullimë" },
  heavyrainshowersandthunder_day: { emoji: "⛈️", label: "Stuhi" },
  lightrain: { emoji: "🌦️", label: "Shi i lehtë" },
  rain: { emoji: "🌧️", label: "Shi" },
  heavyrain: { emoji: "🌧️", label: "Shi i rëndë" },
  lightrainandthunder: { emoji: "⛈️", label: "Shi me bubullimë" },
  rainandthunder: { emoji: "⛈️", label: "Shi me bubullimë" },
  heavyrainandthunder: { emoji: "⛈️", label: "Stuhi e fortë" },
  lightsleet: { emoji: "🌨️", label: "Bore e lehtë" },
  sleet: { emoji: "🌨️", label: "Borë" },
  lightsnow: { emoji: "❄️", label: "Borë e lehtë" },
  snow: { emoji: "❄️", label: "Borë" },
  heavysnow: { emoji: "❄️", label: "Borë e rëndë" },
  snowshowers_day: { emoji: "🌨️", label: "Reshje bore" },
  fog: { emoji: "🌫️", label: "Mjegull" },
};

export function getWeatherSymbol(code: string): WeatherSymbol {
  const stripped = code.replace(/_polartwilight$/, "_day");
  const entry = SYMBOL_MAP[code] || SYMBOL_MAP[stripped];
  if (entry) {
    return { code, label: entry.label, emoji: entry.emoji };
  }
  // Fallback: partial match
  const partial = Object.keys(SYMBOL_MAP).find((k) => code.startsWith(k.split("_")[0]));
  if (partial) {
    return { code, label: SYMBOL_MAP[partial].label, emoji: SYMBOL_MAP[partial].emoji };
  }
  return { code, label: "E panjohur", emoji: "🌡️" };
}

export function getWindDirection(degrees: number): string {
  const dirs = ["V", "VL", "L", "JL", "J", "JP", "P", "VP"];
  return dirs[Math.round(degrees / 45) % 8];
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "I ulët", color: "text-emerald-400" };
  if (uv <= 5) return { label: "Mesatar", color: "text-yellow-400" };
  if (uv <= 7) return { label: "I lartë", color: "text-orange-400" };
  if (uv <= 10) return { label: "Shumë i lartë", color: "text-red-400" };
  return { label: "Ekstrem", color: "text-purple-400" };
}

export function tempFtoC(f: number): number {
  return Math.round((f - 32) * (5 / 9));
}

export function tempCtoF(c: number): number {
  return Math.round(c * (9 / 5) + 32);
}

export function formatTemp(temp: number, unit: "C" | "F"): string {
  return `${unit === "F" ? tempCtoF(temp) : temp}°`;
}
