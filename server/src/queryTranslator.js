/**
 * Përkthen filtrat në stilin Anima SDK në SQL të parameterizuar për tabelën `locations`.
 *
 * Gramatika e mbështetur (e njëjta që përdor frontend-i ekzistues):
 *   {
 *     where: {
 *       country: { eq: "Albania" },
 *       name:    { contains: "tir" },
 *       isPopular: true,                 // barazi e drejtpërdrejtë skalare
 *       OR: [ { name: { contains: "x" } }, { nameAl: { contains: "x" } } ]
 *     },
 *     orderBy: { population: "desc" },
 *     limit: 200,
 *     offset: 0
 *   }
 *
 * Çdo fushë kalon nëpër një whitelist — asgjë tjetër nuk lejohet (mbrojtje nga SQL injection
 * dhe nga fusha arbitrare). Vlerat kalojnë gjithmonë si parametra `?`.
 */

const ALLOWED_FIELDS = new Set([
  "id",
  "name",
  "nameAl",
  "region",
  "country",
  "lat",
  "lon",
  "population",
  "isPopular",
  "createdAt",
  "updatedAt",
]);

const MAX_LIMIT = 20000;

function assertField(field) {
  if (!ALLOWED_FIELDS.has(field)) {
    throw new Error(`Fushë e palejuar: ${field}`);
  }
  return `\`${field}\``;
}

/**
 * Ndërton një kusht të vetëm nga një çift { field: condition }.
 * `condition` mund të jetë:
 *   - objekt: { eq }, { contains }, { ne }, { gt }, { gte }, { lt }, { lte }
 *   - skalar (string/number/boolean): trajtohet si barazi
 * Kthen { sql, params }.
 */
function buildLeaf(field, condition) {
  const col = assertField(field);

  if (condition === null) {
    return { sql: `${col} IS NULL`, params: [] };
  }

  if (typeof condition !== "object") {
    // Barazi e drejtpërdrejtë (p.sh. isPopular: true)
    const val = typeof condition === "boolean" ? (condition ? 1 : 0) : condition;
    return { sql: `${col} = ?`, params: [val] };
  }

  const clauses = [];
  const params = [];
  for (const [op, raw] of Object.entries(condition)) {
    const val = typeof raw === "boolean" ? (raw ? 1 : 0) : raw;
    switch (op) {
      case "eq":
        clauses.push(`${col} = ?`);
        params.push(val);
        break;
      case "ne":
        clauses.push(`${col} <> ?`);
        params.push(val);
        break;
      case "contains":
        clauses.push(`${col} LIKE ?`);
        params.push(`%${String(val)}%`);
        break;
      case "startsWith":
        clauses.push(`${col} LIKE ?`);
        params.push(`${String(val)}%`);
        break;
      case "gt":
        clauses.push(`${col} > ?`);
        params.push(val);
        break;
      case "gte":
        clauses.push(`${col} >= ?`);
        params.push(val);
        break;
      case "lt":
        clauses.push(`${col} < ?`);
        params.push(val);
        break;
      case "lte":
        clauses.push(`${col} <= ?`);
        params.push(val);
        break;
      default:
        throw new Error(`Operator i palejuar: ${op}`);
    }
  }
  return { sql: clauses.join(" AND "), params };
}

/**
 * Ndërton rekursivisht klauzolën WHERE nga objekti `where`.
 * Çelësat e nivelit të lartë kombinohen me AND; `OR`/`AND` marrin një varg kushtesh.
 */
function buildWhere(where) {
  if (!where || typeof where !== "object") return { sql: "", params: [] };

  const clauses = [];
  const params = [];

  for (const [key, value] of Object.entries(where)) {
    if (key === "OR" || key === "AND") {
      if (!Array.isArray(value)) throw new Error(`${key} pret një varg`);
      const parts = [];
      for (const sub of value) {
        const built = buildWhere(sub);
        if (built.sql) {
          parts.push(`(${built.sql})`);
          params.push(...built.params);
        }
      }
      if (parts.length) {
        clauses.push(`(${parts.join(key === "OR" ? " OR " : " AND ")})`);
      }
    } else {
      const leaf = buildLeaf(key, value);
      if (leaf.sql) {
        clauses.push(`(${leaf.sql})`);
        params.push(...leaf.params);
      }
    }
  }

  return { sql: clauses.join(" AND "), params };
}

function buildOrderBy(orderBy) {
  if (!orderBy || typeof orderBy !== "object") return "";
  const parts = [];
  for (const [field, dir] of Object.entries(orderBy)) {
    const col = assertField(field);
    const direction = String(dir).toLowerCase() === "asc" ? "ASC" : "DESC";
    parts.push(`${col} ${direction}`);
  }
  return parts.length ? `ORDER BY ${parts.join(", ")}` : "";
}

/**
 * Kthen { sql, params } gati për pool.query(sql, params).
 */
export function translateQuery(filters = {}) {
  const where = buildWhere(filters.where);
  const orderBy = buildOrderBy(filters.orderBy);

  let limit = Number.isFinite(filters.limit) ? Math.floor(filters.limit) : 200;
  limit = Math.max(1, Math.min(limit, MAX_LIMIT));
  const offset = Number.isFinite(filters.offset) ? Math.max(0, Math.floor(filters.offset)) : 0;

  let sql = "SELECT * FROM `locations`";
  const params = [];

  if (where.sql) {
    sql += ` WHERE ${where.sql}`;
    params.push(...where.params);
  }
  if (orderBy) sql += ` ${orderBy}`;

  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return { sql, params };
}

/**
 * Normalizon një rresht DB në formën që pret frontend-i (isPopular si boolean).
 */
export function rowToLocation(row) {
  return {
    id: row.id,
    name: row.name,
    nameAl: row.nameAl,
    region: row.region,
    country: row.country,
    lat: Number(row.lat),
    lon: Number(row.lon),
    population: Number(row.population),
    isPopular: !!row.isPopular,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
