import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, ChevronRight, ArrowLeft, Droplets, Wind, Thermometer, Sun, AlertCircle, CalendarDays } from "lucide-react";
import { getCityById } from "../lib/albanianCities";
import { fetchYrForecast, adaptYrResponse, generateMockWeather } from "../lib/yrApi";
import { formatTemp, getWindDirection } from "../lib/weatherSymbols";
import { DailyForecast } from "../components/weather/DailyForecast";
import { WeatherIcon } from "../components/WeatherIcon";
import { useWeather } from "../context/WeatherContext";
import type { LocationWeather, HourlyForecast, LocationInfo } from "../types/weather";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatHour(isoTime: string): string {
  const d = new Date(isoTime);
  return d.toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("sq-AL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getDayLabel(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Sot";
  if (dateStr === tomorrow) return "Nesër";
  const d = new Date(dateStr + "T12:00:00");
  const dayNames = ["E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"];
  return dayNames[d.getDay()];
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd(
  city: NonNullable<ReturnType<typeof getCityById>>,
  dateStr: string,
  hourlyForDay: HourlyForecast[]
) {
  const dateFormatted = formatDate(dateStr);
  const tempMax = hourlyForDay.length ? Math.max(...hourlyForDay.map((h) => h.temperature)) : null;
  const tempMin = hourlyForDay.length ? Math.min(...hourlyForDay.map((h) => h.temperature)) : null;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Moti në ${city.nameAl} — ${dateFormatted}`,
    "description": `Parashikimi i motit orë për orë për ${city.nameAl} më ${dateFormatted}. Temperatura${tempMax !== null ? ` deri ${tempMax}°C` : ""}, reshjet, era dhe lagështia.`,
    "url": `https://moti.com.al/vendbanim/${city.id}/dita/${dateStr}`,
    "inLanguage": "sq",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Kryefaqja", "item": "https://moti.com.al/" },
        { "@type": "ListItem", "position": 2, "name": "Vendbanimet", "item": "https://moti.com.al/vendbanimet" },
        { "@type": "ListItem", "position": 3, "name": city.nameAl, "item": `https://moti.com.al/vendbanim/${city.id}` },
        { "@type": "ListItem", "position": 4, "name": dateFormatted, "item": `https://moti.com.al/vendbanim/${city.id}/dita/${dateStr}` },
      ],
    },
    ...(tempMax !== null && tempMin !== null ? {
      "about": {
        "@type": "Event",
        "name": `Parashikimi i motit — ${city.nameAl} — ${dateFormatted}`,
        "startDate": `${dateStr}T00:00:00`,
        "endDate": `${dateStr}T23:59:59`,
        "location": {
          "@type": "Place",
          "name": city.nameAl,
          "geo": { "@type": "GeoCoordinates", "latitude": city.lat, "longitude": city.lon }
        },
        "description": `Temperatura min ${tempMin}°C, max ${tempMax}°C. Parashikimet orare sipas MET Norway.`
      }
    } : {}),
  });
}

// ─── Temperature bar for the day summary ─────────────────────────────────────

function HourlyRow({ hour, unit }: { hour: HourlyForecast; unit: "C" | "F" }) {
  const h = formatHour(hour.time);
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors rounded-xl">
      <span className="text-sm text-white/50 w-12 flex-shrink-0 font-mono">{h}</span>
      <div className="w-8 flex-shrink-0">
        <WeatherIcon emoji={hour.symbol.emoji} size="sm" />
      </div>
      <span className="text-sm font-bold text-white w-14 flex-shrink-0 text-right">
        {formatTemp(hour.temperature, unit)}
      </span>
      {hour.precipitationProbability > 0 && (
        <div className="flex items-center gap-1 w-14 flex-shrink-0">
          <Droplets className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <span className="text-xs text-sky-400">{hour.precipitationProbability}%</span>
        </div>
      )}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <Wind className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <span className="text-xs text-white/40 truncate">{hour.windSpeed} km/h {getWindDirection(hour.windDirection)}</span>
      </div>
      <span className="text-xs text-white/30 w-10 text-right flex-shrink-0">{hour.humidity}%</span>
    </div>
  );
}

function HourPeriodSection({ label, hours, unit }: { label: string; hours: HourlyForecast[]; unit: "C" | "F" }) {
  if (!hours.length) return null;
  return (
    <div className="mb-2">
      <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/30">{label}</div>
      {hours.map((h) => <HourlyRow key={h.time} hour={h} unit={unit} />)}
    </div>
  );
}

// ─── Main DayPage ─────────────────────────────────────────────────────────────

export const DayPage: React.FC = () => {
  const { id, date } = useParams<{ id: string; date: string }>();
  const navigate = useNavigate();
  const { unit } = useWeather();
  const [weather, setWeather] = useState<LocationWeather | null>(null);
  const [loading, setLoading] = useState(true);

  const city = id ? getCityById(id) : undefined;

  // Filter real hourly data for the requested date
  const realHourlyForDay: HourlyForecast[] = (weather?.hourly ?? []).filter(
    (h) => h.time.split("T")[0] === date
  );

  // Daily summary entry for this date (always present for 10-day range)
  const dailyEntry = weather?.daily.find((d) => d.date === date);

  // Build pseudo-hourly data from daily min/max when real hourly unavailable
  const pseudoHourlyForDay: HourlyForecast[] = useMemo(() => {
    if (!dailyEntry || !date) return [];
    const { tempMin, tempMax, windSpeed, precipitationProbability, precipitation, symbol } = dailyEntry;
    // Sinusoidal temperature curve: min at ~05:00, max at ~14:00
    return Array.from({ length: 24 }, (_, hr) => {
      const phase = ((hr - 5) / 24) * Math.PI * 2;
      const frac = (Math.sin(phase - Math.PI / 2) + 1) / 2; // 0..1
      const temp = Math.round(tempMin + frac * (tempMax - tempMin));
      const isDaytime = hr >= 6 && hr < 20;
      const timeStr = `${date}T${String(hr).padStart(2, "0")}:00:00Z`;
      const hrPrecipProb = isDaytime ? precipitationProbability : Math.round(precipitationProbability * 0.6);
      return {
        time: timeStr,
        temperature: temp,
        feelsLike: temp - 2,
        precipitation: hrPrecipProb > 30 ? +(precipitation / 8).toFixed(1) : 0,
        precipitationProbability: hrPrecipProb,
        windSpeed,
        windDirection: 180,
        humidity: 60 + Math.round(Math.sin(hr / 4) * 15),
        uvIndex: isDaytime ? Math.round(frac * 6) : 0,
        symbol: isDaytime ? symbol : { code: "clearsky_night", label: "Qiell i kthjellët", emoji: "🌙" },
      } as HourlyForecast;
    });
  }, [dailyEntry, date]);

  // Use real hourly if available, else estimated pseudo-hourly
  const hourlyForDay = realHourlyForDay.length > 0 ? realHourlyForDay : pseudoHourlyForDay;
  const isEstimated = realHourlyForDay.length === 0 && pseudoHourlyForDay.length > 0;

  // Split by time of day
  const morning = hourlyForDay.filter((h) => { const hr = new Date(h.time).getHours(); return hr >= 6 && hr < 12; });
  const afternoon = hourlyForDay.filter((h) => { const hr = new Date(h.time).getHours(); return hr >= 12 && hr < 18; });
  const evening = hourlyForDay.filter((h) => { const hr = new Date(h.time).getHours(); return hr >= 18 && hr < 24; });
  const night = hourlyForDay.filter((h) => { const hr = new Date(h.time).getHours(); return hr >= 0 && hr < 6; });

  const tempMax = hourlyForDay.length ? Math.max(...hourlyForDay.map((h) => h.temperature)) : dailyEntry?.tempMax ?? null;
  const tempMin = hourlyForDay.length ? Math.min(...hourlyForDay.map((h) => h.temperature)) : dailyEntry?.tempMin ?? null;

  // Inject JSON-LD + page title
  useEffect(() => {
    if (!city || !date) return;
    const dateLabel = formatDate(date);
    document.title = `Moti në ${city.nameAl} — ${dateLabel} | Moti.com.al`;

    if (weather || !loading) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "day-jsonld";
      script.textContent = buildJsonLd(city, date, hourlyForDay);
      const existing = document.getElementById("day-jsonld");
      if (existing) existing.remove();
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById("day-jsonld");
      if (s) s.remove();
      document.title = "Moti.com.al — Parashikimi i motit në Shqipëri";
    };
  }, [city, date, weather, loading]);

  // Load weather data (shares same API call as CityPage via cache)
  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const locInfo: LocationInfo = {
      name: city.name,
      nameAl: city.nameAl,
      region: city.region,
      country: city.country,
      countryCode: city.country === "Albania" ? "AL" : city.country === "Kosovo" ? "XK" : "MK",
      lat: city.lat,
      lon: city.lon,
      timezone: "Europe/Tirane",
      population: city.population,
    };
    let cancelled = false;
    (async () => {
      try {
        const yrData = await fetchYrForecast(city.lat, city.lon);
        if (!cancelled) setWeather(adaptYrResponse(yrData, locInfo));
      } catch (err) {
        console.warn("[Moti] DayPage: real API failed, using mock:", err);
        if (!cancelled) setWeather(generateMockWeather(locInfo));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h1 className="text-2xl font-display font-bold text-white">Qyteti nuk u gjet</h1>
        <Link to="/" className="mt-2 px-5 py-2.5 rounded-xl bg-moti-sky text-white font-semibold text-sm hover:bg-sky-500 transition-colors">
          Kthehu në kryefaqe
        </Link>
      </div>
    );
  }

  if (!date) {
    navigate(`/vendbanim/${id}`);
    return null;
  }

  const dateLabel = formatDate(date);
  const dayLabel = getDayLabel(date);

  return (
    <main id="main-content" aria-label={`Moti në ${city.nameAl} — ${dateLabel}`} className="max-w-4xl mx-auto px-4 md:px-6 pb-28 md:pb-12 pt-6">

      {/* Breadcrumbs */}
      <nav aria-label="Shtegun navigimi" className="flex items-center gap-1 text-xs text-white/50 mb-5 flex-wrap">
        <Link to="/" className="hover:text-moti-sky transition-colors font-medium">Kryefaqja</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link to="/vendbanimet" className="hover:text-moti-sky transition-colors font-medium">Vendbanimet</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link to={`/vendbanim/${city.id}`} className="hover:text-moti-sky transition-colors font-medium">{city.nameAl}</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-white/80 font-semibold">{dayLabel}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => navigate(`/vendbanim/${city.id}`)}
        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors"
        aria-label="Kthehu te parashikimi"
      >
        <ArrowLeft className="w-4 h-4" />
        Kthehu te {city.nameAl}
      </button>

      {/* Page heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-moti-sky text-sm font-medium mb-1">
          <MapPin className="w-4 h-4" />
          <span>{city.region}, {city.country}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
          Moti në {city.nameAl}
        </h1>
        <p className="text-white/60 text-base mt-0.5 font-medium capitalize">{dateLabel}</p>
        <p className="text-white/40 text-sm mt-0.5">Parashikimi orë për orë • MET Norway</p>
      </div>

      {/* Day summary card */}
      {(tempMax !== null || loading) && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-moti-navy-mid via-moti-navy to-moti-navy-dark border border-white/[0.08] shadow-premium mb-5 animate-fade-up">
          <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-moti-sky/10 blur-3xl pointer-events-none" />
          <div className="relative p-5 md:p-6">
            {loading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-moti-sky border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-2">
                    {tempMax !== null && (
                      <span className="text-5xl font-display font-bold text-white">{formatTemp(tempMax, unit)}</span>
                    )}
                    {tempMin !== null && (
                      <span className="text-2xl font-display text-white/40">{formatTemp(tempMin, unit)}</span>
                    )}
                  </div>
                  {dailyEntry && (
                    <p className="text-white/50 text-sm mt-1">{dailyEntry.symbol.label}</p>
                  )}
                </div>
                {dailyEntry && (
                  <WeatherIcon emoji={dailyEntry.symbol.emoji} size="xl" animated />
                )}
                {dailyEntry && (
                  <div className="grid grid-cols-3 gap-3 w-full mt-2 pt-3 border-t border-white/[0.06]">
                    {[
                      { icon: <Droplets className="w-3.5 h-3.5 text-sky-400" />, label: "Reshjet", value: `${dailyEntry.precipitationProbability}%` },
                      { icon: <Wind className="w-3.5 h-3.5 text-white/40" />, label: "Era", value: `${dailyEntry.windSpeed} km/h` },
                      { icon: <Thermometer className="w-3.5 h-3.5 text-amber-400" />, label: "Temperatura", value: `${formatTemp(tempMin!, unit)} – ${formatTemp(tempMax!, unit)}` },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex flex-col gap-0.5 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                        <div className="flex items-center gap-1">{icon}<span className="text-[10px] text-white/35 uppercase tracking-wide">{label}</span></div>
                        <span className="text-sm font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10-day forecast — navigate to other days */}
      {weather && weather.daily.length > 0 && (
        <div className="animate-fade-up mb-5" style={{ animationDelay: "0.15s" }}>
          <DailyForecast daily={weather.daily} unit={unit} cityId={city.id} />
        </div>
      )}

      {/* Hourly table */}
      <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] overflow-hidden shadow-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Column headers */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-xs text-white/30 uppercase tracking-widest w-12 flex-shrink-0">Ora</span>
          <span className="w-8 flex-shrink-0" />
          <span className="text-xs text-white/30 uppercase tracking-widest w-14 flex-shrink-0 text-right">Temp</span>
          <span className="text-xs text-white/30 uppercase tracking-widest w-14 flex-shrink-0">Reshjet</span>
          <span className="text-xs text-white/30 uppercase tracking-widest flex-1 min-w-0">Era</span>
          <span className="text-xs text-white/30 uppercase tracking-widest w-10 text-right flex-shrink-0">Lag</span>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-white/30">
            <div className="w-6 h-6 rounded-full border-2 border-moti-sky border-t-transparent animate-spin" />
            <span className="text-sm">Duke ngarkuar të dhënat…</span>
          </div>
        ) : hourlyForDay.length > 0 ? (
          <div className="py-1">
            {isEstimated && (
              <div className="mx-4 mt-3 mb-1 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-400/20 px-3 py-2.5">
                <CalendarDays className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  Parashikimi orar i detajuar është i disponueshëm vetëm për 48 orët e ardhshme. Vlerat e mëposhtme janë <strong>estimim bazuar në min/max ditore</strong> nga MET Norway.
                </p>
              </div>
            )}
            <HourPeriodSection label="🌙 Natë (00–06)" hours={night} unit={unit} />
            <HourPeriodSection label="🌅 Mëngjes (06–12)" hours={morning} unit={unit} />
            <HourPeriodSection label="☀️ Pasdite (12–18)" hours={afternoon} unit={unit} />
            <HourPeriodSection label="🌆 Mbrëmje (18–24)" hours={evening} unit={unit} />
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center gap-3 text-white/30">
            <Sun className="w-8 h-8" />
            <p className="text-sm text-center max-w-xs">
              Nuk ka të dhëna të disponueshme për këtë ditë.
            </p>
            <Link
              to={`/vendbanim/${city.id}`}
              className="mt-2 text-sm text-moti-sky hover:text-sky-400 font-semibold transition-colors"
            >
              Shiko parashikimin 10-ditor →
            </Link>
          </div>
        )}
      </div>

      {/* SEO FAQ */}
      <section className="mt-5 rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-base font-display font-bold text-white mb-4">
          Pyetje të shpeshta — Moti në {city.nameAl} më {dateLabel}
        </h2>
        <div className="space-y-2">
          {[
            {
              q: `Sa është temperatura maksimale në ${city.nameAl} më ${dateLabel}?`,
              a: tempMax !== null ? `Temperatura maksimale e parashikuar është ${tempMax}°C.` : "Të dhënat do të jenë të disponueshme së shpejti.",
            },
            {
              q: `A ka reshje në ${city.nameAl} më ${dateLabel}?`,
              a: dailyEntry ? (dailyEntry.precipitationProbability > 30 ? `Po, mundësia e reshjeve është ${dailyEntry.precipitationProbability}%.` : `Mundësia e reshjeve është e ulët (${dailyEntry.precipitationProbability}%).`) : "Shikoni parashikimin për detaje.",
            },
            {
              q: `Sa është era në ${city.nameAl} gjatë ditës?`,
              a: dailyEntry ? `Era parashikohet ${dailyEntry.windSpeed} km/h.` : "Shikoni orarin e plotë për detaje.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-white/[0.06] p-3 cursor-pointer">
              <summary className="text-sm font-medium text-white/70 group-open:text-white list-none flex items-center justify-between">
                {q}
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90 flex-shrink-0 ml-2" />
              </summary>
              <p className="text-sm text-white/55 mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};
