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

🔒 = kërkon header `Authorization: Bearer <token>`.

Prodhimi: shih [../deploy/DEPLOY.md](../deploy/DEPLOY.md).
