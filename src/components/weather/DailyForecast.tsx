import React from "react";
import { useNavigate } from "react-router-dom";
import type { DailyForecast as DailyForecastType } from "../../types/weather";
import { formatTemp } from "../../lib/weatherSymbols";
import { WeatherIcon } from "../WeatherIcon";
import { Droplets, ChevronRight } from "lucide-react";

interface DailyForecastProps {
  daily: DailyForecastType[];
  unit: "C" | "F";
  cityId?: string;
}

function TempBar({ min, max, absMin, absMax }: { min: number; max: number; absMin: number; absMax: number }) {
  const range = absMax - absMin || 1;
  const left = ((min - absMin) / range) * 100;
  const width = ((max - min) / range) * 100;
  return (
    <div className="flex-1 mx-2 h-1.5 rounded-full bg-white/10 relative overflow-hidden hidden md:block">
      <div
        className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    </div>
  );
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit, cityId }) => {
  const navigate = useNavigate();

  const absMin = Math.min(...daily.map((d) => d.tempMin));
  const absMax = Math.max(...daily.map((d) => d.tempMax));

  const handleDayClick = (day: DailyForecastType) => {
    if (cityId) {
      navigate(`/vendbanim/${cityId}/dita/${day.date}`);
    }
  };

  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">10 Ditë</h2>

      <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
        {daily.map((day, i) => (
          <button
            key={day.date}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/[0.05] text-left group ${cityId ? "cursor-pointer" : ""}`}
            onClick={() => handleDayClick(day)}
            aria-label={`Shiko parashikimin për ${day.dayLabel}`}
          >
            <span className={`text-sm font-semibold w-20 flex-shrink-0 ${i === 0 ? "text-moti-sky" : "text-white/80"}`}>
              {day.dayLabel}
            </span>

            <div className="w-8 flex-shrink-0">
              <WeatherIcon emoji={day.symbol.emoji} size="sm" />
            </div>

            {day.precipitationProbability > 0 && (
              <div className="flex items-center gap-1 w-12 flex-shrink-0">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span className="text-xs text-sky-400">{day.precipitationProbability}%</span>
              </div>
            )}

            <TempBar min={day.tempMin} max={day.tempMax} absMin={absMin} absMax={absMax} />

            <span className="text-sm text-white/65 w-9 text-right flex-shrink-0">{formatTemp(day.tempMin, unit)}</span>
            <span className="text-sm font-bold text-white w-9 text-right flex-shrink-0">{formatTemp(day.tempMax, unit)}</span>
            {cityId && (
              <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:text-moti-sky/60 flex-shrink-0 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
