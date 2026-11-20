import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { pool } from "../db.js";

export const authRouter = Router();

// Kufizim i tentativave të login-it: max 10 në 15 minuta për IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Shumë tentativa. Provoni sërish më vonë." },
});

/**
 * Zgjidh hash-in e fjalëkalimit admin:
 *  1) ADMIN_PASSWORD_HASH nga env (preferohet në prod)
 *  2) hash i gjeneruar në kohë ekzekutimi nga ADMIN_PASSWORD (vetëm si lehtësi)
 */
// Fjalëkalime që kanë qenë publike në repo/dokumentim — nuk pranohen kurrë.
const KNOWN_DEFAULT_PASSWORDS = new Set(["moti2024admin"]);
const PLACEHOLDER_SECRETS = new Set(["", "ndrysho_me_openssl_rand_hex_32"]);

function resolveAdminHash() {
  if (process.env.ADMIN_PASSWORD_HASH) return process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) {
    if (KNOWN_DEFAULT_PASSWORDS.has(plain)) {
      console.error(
        "[auth] ADMIN_PASSWORD është fjalëkalimi i paracaktuar publik — u refuzua. " +
          "Vendos ADMIN_PASSWORD_HASH (bcrypt) në .env."
      );
      return null;
    }
    return bcrypt.hashSync(plain, 10);
  }
  return null;
}
const ENV_ADMIN_HASH = resolveAdminHash();

// JWT_SECRET duhet të jetë i vendosur dhe jo vlera shembull; përndryshe login-i çaktivizohet
// (pjesa publike e API-t vazhdon të punojë normalisht).
const JWT_SECRET_OK =
  !PLACEHOLDER_SECRETS.has(process.env.JWT_SECRET || "") && (process.env.JWT_SECRET || "").length >= 32;
if (!JWT_SECRET_OK) {
  console.error(
    "[auth] JWT_SECRET mungon, është vlera shembull ose është më i shkurtër se 32 karaktere — " +
      "login-i i admin-it është ÇAKTIVIZUAR. Gjenero: openssl rand -hex 32"
  );
}

authRouter.post("/login", loginLimiter, async (req, res) => {
  if (!JWT_SECRET_OK) {
    return res.status(503).json({ error: "Autentikimi nuk është konfiguruar në server" });
  }
  const { username = "admin", password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: "Fjalëkalimi është i detyrueshëm" });
  }

  try {
    // 1) Provo përdoruesit në DB (nëse ka)
    const [rows] = await pool.query(
      "SELECT * FROM `admin_users` WHERE `username` = ? LIMIT 1",
      [username]
    );
    let ok = false;
    if (rows.length > 0) {
      ok = await bcrypt.compare(password, rows[0].passwordHash);
    } else if (ENV_ADMIN_HASH) {
      // 2) Fallback te admini i vetëm nga env
      ok = await bcrypt.compare(password, ENV_ADMIN_HASH);
    }

    if (!ok) {
      return res.status(401).json({ error: "Fjalëkalimi i gabuar" });
    }

    const token = jwt.sign({ sub: username, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "12h",
    });
    return res.json({ token, username });
  } catch (err) {
    console.error("[auth] login error:", err);
    return res.status(500).json({ error: "Gabim i brendshëm" });
  }
});
