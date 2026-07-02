import React from "react";
import { MapPin, RefreshCw } from "lucide-react";
import type { LocationWeather } from "../../types/weather";
import { formatTemp, getWindDirection } from "../../lib/weatherSymbols";
import { WeatherIcon } from "../WeatherIcon";
import { StatTile } from "./StatTile";
import { Badge } from "../ui/Badge";

interface CurrentWeatherCardProps {
  weather: LocationWeather;
  unit: "C" | "F";
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const { current, location } = weather;

  const updatedTime = new Date(current.updatedAt).toLocaleTimeString("sq-AL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-moti-navy-mid via-moti-navy to-moti-navy-dark border border-white/[0.08] shadow-premium animate-fade-up">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-moti-sky/10 blur-3xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-moti-amber/8 blur-2xl" />
      </div>

      <div className="relative p-5 md:p-7">
        {/* Location header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-moti-sky" />
              <span className="text-xs text-white/70 font-medium uppercase tracking-wider">{location.region}, {location.country}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">{location.nameAl}</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/65">
            <RefreshCw className="w-3 h-3" />
            <span>{updatedTime}</span>
          </div>
        </div>

        {/* Main temp + icon */}
        <div className="flex items-center gap-5 mb-5">
          <div>
            <div className="text-[72px] md:text-[88px] font-display font-bold text-white leading-none tracking-tight">
              {formatTemp(current.temperature, unit)}
            </div>
            <div className="text-white/60 text-base mt-1 font-medium">{current.symbol.label}</div>
            <div className="text-white/65 text-sm mt-0.5">
              Ndjehet si {formatTemp(current.feelsLike, unit)}
            </div>
          </div>
          <div className="ml-auto">
            <WeatherIcon emoji={current.symbol.emoji} size="2xl" animated />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <StatTile
            icon="💧"
            label="Lagështia"
            value={`${current.humidity}%`}
            sub={`Pikë vese ${current.dewPoint}°`}
          />
          <StatTile
            icon="💨"
            label="Era"
            value={`${current.windSpeed} km/h`}
            sub={getWindDirection(current.windDirection)}
          />
          <StatTile
            icon="🌡️"
            label="Presioni"
            value={`${current.pressure} hPa`}
          />
          <StatTile
            icon="☀️"
            label="Indeksi UV"
            value={`${current.uvIndex}`}
            sub={current.uvIndex <= 2 ? "I ulët" : current.uvIndex <= 5 ? "Mesatar" : "I lartë"}
            color={current.uvIndex <= 2 ? "text-emerald-400" : current.uvIndex <= 5 ? "text-yellow-400" : "text-orange-400"}
          />
        </div>
      </div>
    </div>
  );
};
