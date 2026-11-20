import React from "react";
import { Link } from "react-router-dom";
import type { DailyForecast as DailyForecastType } from "../../types/weather";
import { formatTemp } from "../../lib/weatherSymbols";
import { formatMm, formatDateSq } from "../../lib/timeTirane";
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

/** <a href> i vërtetë kur ka qytet (Google i ndjek faqet e ditëve), përndryshe <div>. */
function RowWrap({ to, children, ...rest }: { to?: string; title?: string; className?: string; children: React.ReactNode }) {
  return to ? <Link to={to} {...rest}>{children}</Link> : <div className={rest.className}>{children}</div>;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit, cityId }) => {
  const absMin = Math.min(...daily.map((d) => d.tempMin));
  const absMax = Math.max(...daily.map((d) => d.tempMax));

  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">10 Ditë</h2>

      <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
        {daily.map((day, i) => (
          <RowWrap
            key={day.date}
            to={cityId ? `/vendbanim/${cityId}/dita/${day.date}` : undefined}
            title={`Moti më ${formatDateSq(day.date)}`}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left group ${cityId ? "hover:bg-white/[0.05]" : ""}`}
          >
            <span className={`text-sm font-semibold w-20 flex-shrink-0 ${i === 0 ? "text-moti-sky" : "text-white/80"}`}>
              {day.dayLabel}
            </span>

            <div className="w-8 flex-shrink-0">
              <WeatherIcon emoji={day.symbol.emoji} size="sm" />
            </div>

            {/* Kolona mbetet gjithmonë, që rreshtat të jenë të rreshtuar */}
            <div className="flex items-center gap-1 w-16 flex-shrink-0">
              {day.precipitation >= 0.1 && (
                <>
                  <Droplets className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  <span className="text-xs text-sky-400 whitespace-nowrap">{formatMm(day.precipitation)}</span>
                </>
              )}
            </div>

            <TempBar min={day.tempMin} max={day.tempMax} absMin={absMin} absMax={absMax} />

            <span className="text-sm text-white/65 w-9 text-right flex-shrink-0">{formatTemp(day.tempMin, unit)}</span>
            <span className="text-sm font-bold text-white w-9 text-right flex-shrink-0">{formatTemp(day.tempMax, unit)}</span>
            {cityId && (
              <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:text-moti-sky/60 flex-shrink-0 transition-colors" />
            )}
          </RowWrap>
        ))}
      </div>
    </div>
  );
};
