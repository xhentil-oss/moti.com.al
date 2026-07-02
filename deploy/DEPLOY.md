# Deploy moti.com.al në VPS Ubuntu + MariaDB

Udhëzues hap-pas-hapi për të vënë në prodhim: **Nginx** (shërben frontend-in + reverse-proxy `/api`), **Node/Express** (API, si shërbim systemd), **MariaDB** (baza e të dhënave), **TLS falas** me Let's Encrypt.

Arkitektura:

```
Internet → Nginx :443/:80
             ├─ /            → /var/www/moti.com.al/dist   (build React)
             └─ /api/...     → 127.0.0.1:8080 (Node)  → MariaDB (locations)
                                        └─ proxy te api.met.no (moti + alerts)
```

Supozohet Ubuntu 22.04 ose 24.04 me akses `sudo`. Zëvendëso `moti.com.al` nëse përdor domain tjetër.

---

## 0) DNS

Në panelin e domain-it, drejto rekordet **A** te IP-ja e VPS-it:

| Tipi | Emri | Vlera |
|------|------|-------|
| A | `@`   | IP_E_VPS |
| A | `www` | IP_E_VPS |

Prit derisa `ping moti.com.al` të kthejë IP-në e VPS-it para se të kërkosh certifikatën TLS.

---

## 1) Paketat bazë

```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx, MariaDB, git, certbot
sudo apt install -y nginx mariadb-server git
sudo snap install --classic certbot && sudo ln -sf /snap/bin/certbot /usr/bin/certbot

node -v && nginx -v && mariadb --version
```

### Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 2) MariaDB: siguro + krijo bazën

```bash
sudo mysql_secure_installation      # vendos root password, hiq test db, etj.

sudo mysql
```

Brenda `mysql` (ndrysho fjalëkalimin!):

```sql
CREATE DATABASE moti CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moti'@'localhost' IDENTIFIED BY 'FJALEKALIM_I_FORTE_KETU';
GRANT ALL PRIVILEGES ON moti.* TO 'moti'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 3) Merr kodin

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <URL_I_REPOS> moti.com.al
cd moti.com.al
```

---

## 4) Backend: konfiguro, migro, mbill

```bash
cd /var/www/moti.com.al/server
npm install --omit=dev        # instalon vetëm dependencies e prodhimit
cp .env.example .env
```

Gjenero sekretet:

```bash
# JWT secret
openssl rand -hex 32
# Hash i fjalëkalimit admin (zëvendëso 'FJALEKALIMI_YT')
node -e "console.log(require('bcryptjs').hashSync('FJALEKALIMI_YT', 10))"
```

Redakto `.env`:

```ini
PORT=8080
NODE_ENV=production
CORS_ORIGIN=            # lëre bosh — Nginx është same-origin
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=moti
DB_PASSWORD=FJALEKALIM_I_FORTE_KETU     # njësoj si te MariaDB
DB_NAME=moti
JWT_SECRET=<vlera nga openssl rand -hex 32>
ADMIN_PASSWORD_HASH=<hash-i nga bcrypt>
ADMIN_PASSWORD=                          # lëre bosh në prod
JWT_EXPIRES_IN=12h
MET_USER_AGENT=Moti.com.al kontakt@moti.com.al
```

Krijo tabelat dhe mbill vendbanimet (437 nga lista statike):

```bash
npm run migrate     # krijon tabelat locations + admin_users
npm run seed        # gjeneron seed nga src/lib/albanianCities.ts dhe e fut në DB
```

Verifiko:

```bash
mysql -u moti -p moti -e "SELECT COUNT(*) FROM locations;"   # duhet ~437
```

---

## 5) Frontend: build

```bash
cd /var/www/moti.com.al
npm install                 # përfshin devDependencies (vite, etj.)
npm run build               # krijon dist/
```

> `VITE_API_BASE` nuk nevojitet — frontend-i thërret `/api` në të njëjtën origjinë me Nginx.

---

## 6) Shërbimi systemd (backend)

```bash
sudo cp /var/www/moti.com.al/deploy/moti-server.service /etc/systemd/system/
sudo chown -R www-data:www-data /var/www/moti.com.al
sudo systemctl daemon-reload
sudo systemctl enable --now moti-server
sudo systemctl status moti-server            # duhet "active (running)"
curl -s http://127.0.0.1:8080/api/health     # {"ok":true,"db":"up"}
```

---

## 7) Nginx

```bash
sudo cp /var/www/moti.com.al/deploy/nginx.conf /etc/nginx/sites-available/moti.com.al
sudo ln -s /etc/nginx/sites-available/moti.com.al /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Testo mbi HTTP: hap `http://moti.com.al` — faqja duhet të ngarkohet.

---

## 8) TLS (HTTPS falas)

```bash
sudo certbot --nginx -d moti.com.al -d www.moti.com.al
```

Certbot përditëson automatikisht `nginx.conf` me blloqet `443` dhe ridrejtimin `80→443`, dhe konfiguron rinovimin automatik. Testo: `sudo certbot renew --dry-run`.

---

## 9) Verifikimi final

- `https://moti.com.al` — kryefaqja, kërkimi, faqet e qyteteve punojnë.
- Moti live vjen përmes `/api/weather` (shih Network tab — header `X-Moti-Cache`).
- `https://moti.com.al/admin` — hyr me fjalëkalimin admin → CRUD i vendbanimeve punon (krijim, fshirje, import).
- `curl https://moti.com.al/api/health` → `{"ok":true,"db":"up"}`.

---

## Përditësime të mëvonshme

```bash
cd /var/www/moti.com.al
git pull

# nëse ndryshoi backend-i:
cd server && npm install --omit=dev && npm run migrate
sudo systemctl restart moti-server

# nëse ndryshoi frontend-i:
cd /var/www/moti.com.al && npm install && npm run build
# (Nginx shërben dist/ të re menjëherë — pa restart)
```

---

## Zgjidhje problemesh

| Simptomë | Kontrollo |
|----------|-----------|
| `502 Bad Gateway` te `/api` | `sudo systemctl status moti-server`; `journalctl -u moti-server -f` |
| `db:"down"` te `/api/health` | Kredencialet në `.env`; `sudo systemctl status mariadb` |
| Admin s'hyn dot | `JWT_SECRET` i vendosur? Hash-i i saktë? Shih logjet e serverit |
| Moti s'ngarkohet | `MET_USER_AGENT` me email real; testo `curl "http://127.0.0.1:8080/api/weather?lat=41.33&lon=19.82"` |
| Faqet e brendshme japin 404 pas refresh | Blloku `try_files ... /index.html` te nginx.conf |
| Ndryshimet e frontend-it s'duken | Rifresko build-in: `npm run build`; pastro cache-in e browser-it |

### Komanda të dobishme

```bash
sudo systemctl restart moti-server        # rinis API-n
sudo journalctl -u moti-server -f         # logjet live të API-t
sudo tail -f /var/log/nginx/error.log     # gabimet e Nginx
mysql -u moti -p moti                      # hyr në DB
```
