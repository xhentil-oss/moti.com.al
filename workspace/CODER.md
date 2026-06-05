<instructions>
This file will be automatically added to your context. 
It serves multiple purposes:
  1. Storing frequently used tools so you can use them without searching each time
  2. Recording the user's code style preferences (naming conventions, preferred libraries, etc.)
  3. Maintaining useful information about the codebase structure and organization
  4. Remembering tricky quirks from this codebase

When you spend time searching for certain configuration files, tricky code coupled dependencies, or other codebase information, add that to this CODER.md file so you can remember it for next time.
Keep entries sorted in DESC order (newest first) so recent knowledge stays in prompt context if the file is truncated.
</instructions>

<coder>
# Moti.com.al — Codebase Notes

## Theme System
- `darkMode: ["class"]` in tailwind.config.js — toggle via `.dark` on `<html>`
- WeatherContext.setTheme() applies `.dark`, saves to `localStorage("moti-theme")`, reads `prefers-color-scheme` on first load
- Light-mode CSS overrides live in `tailwind.css` under `html:not(.dark) { ... }` block
- App.tsx renders AppInner (inner component) to access theme from context for body bg/text class swap

## Architecture
- React + Vite + TypeScript + Tailwind CSS (NOT Next.js — Sandpack limitation)
- React Router DOM v6 installed; BrowserRouter usage if multi-page added
- WeatherProvider context wraps entire app at App.tsx level

## Design System Tokens (tailwind.config.js)
- `moti-navy` → #0B1E3D (main dark bg)
- `moti-navy-dark` → #071529 (darkest)
- `moti-navy-mid` → #132843 (cards)
- `moti-sky` → #1E6FD9 (primary accent)
- `moti-amber` → #F59E0B (CTA / secondary)
- Font: Inter (body), Sora (display headings)
- Shadows: shadow-premium, shadow-glow-sky, shadow-glow-amber, shadow-card

## Routing
- `BrowserRouter` wraps `WeatherProvider` in App.tsx
- Routes: `/` (Main), `/vendbanimet` (CitiesPage), `/vendbanim/:id` (CityPage), `*` → Main fallback
- DesktopNav uses `<Link>` + `useLocation()` for active state — NOT plain `<a>` tags
- CityPage injects JSON-LD `<script type="application/ld+json">` into `<head>` on mount, cleans up on unmount

## Key Files
- `src/context/WeatherContext.tsx` — global state, loadWeather, unit, theme
- `src/lib/yrApi.ts` — Yr/MET API adapter + mock data generator
- `src/lib/albanianCities.ts` — 22 cities DB + searchCities()
- `src/lib/weatherSymbols.ts` — symbol code → emoji/label maps
- `src/components/search/SearchBar.tsx` — debounced search with keyboard nav
- `src/components/weather/CurrentWeatherCard.tsx` — hero weather card
- `src/components/weather/HourlyForecast.tsx` — horizontal scroll hourly
- `src/components/weather/DailyForecast.tsx` — 10-day expandable forecast
- `src/types/weather.ts` — all TypeScript interfaces

## API Notes
- Yr/MET base: https://api.met.no/weatherapi/locationforecast/2.0/compact
- User-Agent REQUIRED: "Moti.com.al contact@moti.com.al" — injected by Vite proxy `proxyReq` hook
- Dev proxy: `/api/yr` in `vite.config.ts` (server.proxy) → rewrites to api.met.no path
- Production: set `VITE_YR_PROXY_URL` env var to your backend proxy URL (e.g. Cloudflare Worker)
- In-memory session cache in `yrApi.ts` keyed by `lat,lon`; respects `Expires` response header, 30-min fallback TTL
- `generateMockWeather()` retained as graceful fallback — triggered if fetch throws
- `WeatherContext.loadWeather`: tries real API first, catches + warns, falls back to mock silently

## Conventions
- All text in Albanian (sq) language
- animate-fade-up / animate-slide-down for entrance animations
- Card pattern: rounded-2xl bg-moti-navy-mid border border-white/[0.07]
- All icons from lucide-react
</coder>
