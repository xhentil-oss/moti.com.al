import mysql from "mysql2/promise";

/**
 * Pool i vetëm i lidhjeve MariaDB, i ripërdorur nga i gjithë procesi.
 * Kredencialet vijnë nga variablat e mjedisit (.env).
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "moti",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "moti",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4_unicode_ci",
  // Kthe DECIMAL/BIGINT si numra JS ku është e sigurt
  supportBigNumbers: true,
});

export async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
  } finally {
    conn.release();
  }
}
