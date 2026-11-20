import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import type { HourlyForecast as HourlyForecastType } from "../../types/weather";
import { tiraneDate, tiraneHour, formatMm } from "../../lib/timeTirane";
import { formatTemp } from "../../lib/weatherSymbols";
import { WeatherIcon } from "../WeatherIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
  unit: "C" | "F";
  /** Qyteti për lidhjen te faqja e ditës; pa të kartat nuk janë të klikueshme. */
  cityId?: string;
}

function HourWrap({ to, children, ...rest }: { to?: string; className?: string; "aria-label"?: string; children: React.ReactNode }) {
  return to ? <Link to={to} {...rest}>{children}</Link> : <div {...rest}>{children}</div>;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit, cityId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ id?: string }>();
  const id = cityId ?? params.id;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };


  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Orë për orë</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-all" aria-label="Lëviz majtas">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-all" aria-label="Lëviz djathtas">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hourly.slice(0, 24).map((h, i) => {
          const isNow = i === 0;
          const label = isNow ? "Tani" : `${String(tiraneHour(h.time)).padStart(2, "0")}:00`;

          return (
            <HourWrap
              key={h.time}
              to={id ? `/vendbanim/${id}/dita/${tiraneDate(h.time)}` : undefined}
              aria-label={`${label}: ${formatTemp(h.temperature, unit)}, ${h.symbol.label}`}
              className={`min-w-[64px] flex-shrink-0 snap-start flex flex-col items-center gap-2 px-2.5 py-3.5 rounded-2xl border transition-all
                ${isNow
                  ? "bg-moti-sky/20 border-moti-sky/40 shadow-glow-sky"
                  : `bg-white/[0.05] border-white/[0.07] ${id ? "hover:bg-white/[0.09] hover:border-moti-sky/30" : ""}`
                }`}
            >
              <span className={`text-xs font-semibold ${isNow ? "text-moti-sky" : "text-white/70"}`}>{label}</span>
              <WeatherIcon emoji={h.symbol.emoji} size="sm" />
              <span className="text-sm font-bold text-white">{formatTemp(h.temperature, unit)}</span>
              {h.precipitation >= 0.1 ? (
                <span className="text-xs text-sky-400 font-medium whitespace-nowrap">{formatMm(h.precipitation)}</span>
              ) : (h.precipitationProbability ?? 0) > 20 ? (
                <span className="text-xs text-sky-400 font-medium">{h.precipitationProbability}%</span>
              ) : null}
            </HourWrap>
          );
        })}
      </div>
    </div>
  );
};
