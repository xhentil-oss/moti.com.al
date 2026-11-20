/**
 * Koha sipas Europe/Tirane (jo sipas UTC, as sipas fusës orare të shfletuesit).
 * MET kthen kohët në UTC; ditët dhe orët duhet të ndahen sipas orës lokale,
 * përndryshe p.sh. ora 00:00 e ditës tjetër futet te dita aktuale.
 *
 * Datat në shqip formatohen me emra të përcaktuar këtu: shumë shfletues
 * (p.sh. Chrome) s'kanë të dhëna për locale "sq" dhe kthejnë anglisht.
 */

const TZ = "Europe/Tirane";

const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" });
const hmFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** "YYYY-MM-DD" sipas orës së Tiranës. */
export function tiraneDate(iso: string | Date): string {
  return dateFmt.format(typeof iso === "string" ? new Date(iso) : iso);
}

/** Ora 0–23 sipas orës së Tiranës. */
export function tiraneHour(iso: string | Date): number {
  return Number(hourFmt.format(typeof iso === "string" ? new Date(iso) : iso)) % 24;
}

/** "HH:MM" sipas orës së Tiranës. */
export function tiraneTime(iso: string | Date): string {
  return hmFmt.format(typeof iso === "string" ? new Date(iso) : iso);
}

/** Data e sotme në Tiranë ("YYYY-MM-DD"). */
export function todayTirane(): string {
  return tiraneDate(new Date());
}

/** Shton n ditë te një datë "YYYY-MM-DD". */
export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const DAY_NAMES = ["E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"];
const MONTHS = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];

/** Emri i ditës ("E Shtunë") për një datë "YYYY-MM-DD". */
export function weekdaySq(dateStr: string): string {
  return DAY_NAMES[new Date(dateStr + "T12:00:00Z").getUTCDay()];
}

/** "E shtunë, 28 nëntor 2026" */
export function formatDateSq(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const wd = weekdaySq(dateStr);
  return `${wd.charAt(0)}${wd.slice(1).toLowerCase()}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "Sot" / "Nesër" / "E Shtunë" */
export function dayLabelSq(dateStr: string): string {
  const today = todayTirane();
  if (dateStr === today) return "Sot";
  if (dateStr === addDays(today, 1)) return "Nesër";
  return weekdaySq(dateStr);
}

/** Reshjet në mm: "0,4 mm", "12 mm". */
export function formatMm(mm: number): string {
  if (!mm) return "0 mm";
  return `${mm < 10 ? mm.toFixed(1).replace(".", ",") : Math.round(mm)} mm`;
}
