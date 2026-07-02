import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "src", "schema.sql");

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "moti",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "moti",
  multipleStatements: true,
});

const sql = readFileSync(schemaPath, "utf8");
await conn.query(sql);
console.log("✅ Migrimi u krye — tabelat u krijuan (nëse s'ekzistonin).");
await conn.end();
