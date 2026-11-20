# moti.com.al

Parashikimi i motit për vendbanimet e Shqipërisë, me të dhëna nga [MET Norway](https://api.met.no/) (yr.no).

## Struktura

| Dosja | Çfarë përmban |
|-------|---------------|
| `src/` | Frontend React 18 + Vite + Tailwind (faqet, komponentët, `lib/anima` = klienti i API-t) |
| `server/` | Backend Node/Express + MariaDB (vendbanimet, login admin, proxy te MET/Overpass/Nominatim) — shih [server/README.md](server/README.md) |
| `shared/` | Kod i përbashkët frontend/prerender (përmbajtja unike e faqeve të qyteteve) |
| `static/` | Skedarë që kopjohen te `dist/` (`.htaccess`, `robots.txt`, `llms.txt`) |
| `prerender.mjs` | Gjeneron HTML statik (SSG) për faqet e qyteteve pas `vite build` |
| `dist/` | Build-i i prodhimit — **commitohet** sepse cPanel e kopjon direkt te `public_html` |
| `deploy/` | Udhëzues dhe konfigurime deploy-i |

## Zhvillim lokal

```bash
# Backend (terminali 1)
cd server && cp .env.example .env   # plotëso DB_* dhe JWT_SECRET
npm install && npm run migrate && npm run seed && npm run dev

# Frontend (terminali 2) — Vite e drejton /api te http://127.0.0.1:8080
npm install && npm run dev
```

## Build dhe deploy

```bash
npm run build        # vite build + prerender (lexon vendbanimet nga API-ja live; fallback te seed-i)
git add dist && git commit && git push
```

Prodhimi aktual punon në **cPanel**: Git → "Deploy HEAD Commit" ekzekuton [.cpanel.yml](.cpanel.yml), që kopjon `dist/` te `public_html` dhe rinis app-in Node (Passenger). Rrugët e SPA-së dhe faqet SSG i menaxhon [static/.htaccess](static/.htaccess).

Udhëzuesi për një VPS me Nginx + systemd (alternativë) është te [deploy/DEPLOY.md](deploy/DEPLOY.md).
