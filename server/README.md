# moti-server

Backend API për moti.com.al — Node/Express + MariaDB. Zëvendëson `@animaapp/playground-react-sdk`.

## Zhvillim lokal

```bash
cp .env.example .env      # vendos DB_* + JWT_SECRET
npm install
npm run migrate           # krijon tabelat
npm run seed              # mbjell ~437 vendbanime nga lista statike
npm run dev               # http://127.0.0.1:8080  (--watch)
```

Frontend-i në dev (`npm run dev` në rrënjë) i drejton `/api` te ky server përmes proxy-t të Vite-s.

## Endpoints

| Metoda | Rruga | Auth | Përshkrim |
|--------|-------|------|-----------|
| GET  | `/api/health` | — | Statusi + lidhja me DB |
| POST | `/api/auth/login` | — | `{username?, password}` → `{token}` |
| POST | `/api/locations/query` | — | Filtra në stilin SDK → varg `Location` |
| GET  | `/api/locations/:id` | — | Një lokacion |
| POST | `/api/locations` | 🔒 | Krijo |
| PATCH | `/api/locations/:id` | 🔒 | Përditëso |
| DELETE | `/api/locations/:id` | 🔒 | Fshi |
| GET  | `/api/weather?lat=&lon=` | — | Proxy te MET Norway (locationforecast) |
| GET  | `/api/metalerts?lat=&lon=` | — | Proxy te MET Norway (alerts) |
| GET  | `/api/sitemap.xml` | — | Sitemap dinamik nga DB |
| POST | `/api/overpass` | 🔒 | Proxy te Overpass (import vendbanimesh nga OSM) |
| GET  | `/api/geocode?q=&countrycodes=&limit=` | 🔒 | Proxy te Nominatim (`limit` ≤ 50, max 50 kërkesa/min) |

🔒 = kërkon header `Authorization: Bearer <token>`.

Koordinatat e `/weather` dhe `/metalerts` rrumbullakohen në 2 shifra dhjetore (~1 km) dhe
përgjigjet ruhen në cache në memorie (max 5000 hyrje, TTL sipas header-it `Expires` të MET).

**Siguria:** `JWT_SECRET` (≥ 32 karaktere) është i detyrueshëm — pa të login-i çaktivizohet.
Në prod përdor `ADMIN_PASSWORD_HASH`; fjalëkalimi i vjetër i paracaktuar refuzohet.

Prodhimi: shih [../deploy/DEPLOY.md](../deploy/DEPLOY.md).
