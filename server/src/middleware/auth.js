import jwt from "jsonwebtoken";

/**
 * Verifikon token-in JWT nga header-i Authorization: Bearer <token>.
 * Përdoret për të mbrojtur endpoint-et që shkruajnë (create/update/delete).
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Mungon token-i i autentikimit" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token i pavlefshëm ose i skaduar" });
  }
}
