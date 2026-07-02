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
function resolveAdminHash() {
  if (process.env.ADMIN_PASSWORD_HASH) return process.env.ADMIN_PASSWORD_HASH;
  if (process.env.ADMIN_PASSWORD) return bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
  return null;
}
const ENV_ADMIN_HASH = resolveAdminHash();

authRouter.post("/login", loginLimiter, async (req, res) => {
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
