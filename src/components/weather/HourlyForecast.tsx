import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { HourlyForecast as HourlyForecastType } from "../../types/weather";
import { formatTemp } from "../../lib/weatherSymbols";
import { WeatherIcon } from "../WeatherIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
  unit: "C" | "F";
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  const now = new Date();

  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Orë për orë</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="p-1.5 rounded-lg bg-white/6 hover:bg-white/12 text-white/60 hover:text-white transition-all" aria-label="Lëviz majtas">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-lg bg-white/6 hover:bg-white/12 text-white/60 hover:text-white transition-all" aria-label="Lëviz djathtas">
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
          const date = new Date(h.time);
          const isNow = i === 0;
          const hour = date.getHours();
          const label = isNow ? "Tani" : `${String(hour).padStart(2, "0")}:00`;

          return (
            <div
              key={h.time}
              onClick={() => {
                if (id) {
                  const dateStr = h.time.split("T")[0];
                  navigate(`/vendbanim/${id}/dita/${dateStr}`);
                }
              }}
              className={`min-w-[64px] flex-shrink-0 snap-start flex flex-col items-center gap-2 px-2.5 py-3.5 rounded-2xl border transition-all
                ${id ? "cursor-pointer" : ""}
                ${isNow
                  ? "bg-moti-sky/20 border-moti-sky/40 shadow-glow-sky"
                  : "bg-white/[0.05] border-white/[0.07] hover:bg-white/[0.09] hover:border-moti-sky/30"
                }`}
            >
              <span className={`text-xs font-semibold ${isNow ? "text-moti-sky" : "text-white/70"}`}>{label}</span>
              <WeatherIcon emoji={h.symbol.emoji} size="sm" />
              <span className="text-sm font-bold text-white">{formatTemp(h.temperature, unit)}</span>
              {h.precipitationProbability > 20 && (
                <span className="text-xs text-sky-400 font-medium">{h.precipitationProbability}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
