/**
 * Përmbajtje UNIKE për çdo vendbanim, e derivuar nga gjeografia.
 * Përdoret nga React (CityPage) DHE nga prerender.mjs — një burim i vetëm,
 * që faqet të mos jenë "thin/duplicate" (rrezik dënimi nga Google).
 *
 * ESM i thjeshtë (pa tipe) që ta importojnë të dyja rrugët.
 */

export function countryLabel(c) {
  return c === "Albania"
    ? "Shqipëri"
    : c === "Kosovo"
    ? "Kosovë"
    : c === "Maqedonia e Veriut"
    ? "Maqedoni e Veriut"
    : c;
}

// Rajone/zona bregdetare (Shqipëri) — sipas rajonit dhe gjatësisë gjeografike.
const COASTAL_REGIONS = new Set(["Durrës", "Vlorë", "Lezhë", "Fier"]);
const COASTAL_IDS = new Set([
  "durres", "vlore", "sarande", "himare", "ksamil", "shengjin", "velipoje",
  "golem", "kavaje", "divjake", "orikum", "radhime", "dhermi", "borsh",
]);
const MOUNTAIN_REGIONS = new Set(["Korçë", "Dibër", "Kukës", "Gjirokastër"]);

/**
 * Klasifikon vendbanimin në një arketip klimatik për tekst unik.
 * → "bregdetare" | "malore" | "kontinentale" | "fushore"
 */
export function classify(city) {
  const region = city.region || "";
  if (city.country === "Albania") {
    if (COASTAL_IDS.has(city.id) || (COASTAL_REGIONS.has(region) && city.lon < 19.65)) return "bregdetare";
    if (MOUNTAIN_REGIONS.has(region)) return "malore";
    return "fushore";
  }
  // Kosovë & Maqedoni: kryesisht klimë kontinentale/malore
  return "kontinentale";
}

export function climateType(city) {
  switch (classify(city)) {
    case "bregdetare": return "Mesdhetare bregdetare";
    case "malore": return "Malore kontinentale";
    case "kontinentale": return "Kontinentale";
    default: return "Mesdhetare fushore";
  }
}

/** Përshkrim i gjatë, unik për qytetin (arketip + emër + rajon + koordinata). */
export function longDescription(city) {
  const cl = countryLabel(city.country);
  const arch = classify(city);
  const coord = `${city.lat.toFixed(2)}°V, ${city.lon.toFixed(2)}°L`;

  const intros = {
    bregdetare: `${city.nameAl} është një zonë bregdetare në rajonin e ${city.region} (${cl}), me klimë mesdhetare: verë të nxehtë e të thatë dhe dimër të butë e me shi. Afërsia me detin zbut temperaturat dhe rrit lagështinë, ndaj brizat detare janë tipike gjatë pasditeve verore.`,
    malore: `${city.nameAl} shtrihet në zonën malore të ${city.region} (${cl}), me klimë kontinentale: dimër i ftohtë me borë të shpeshtë dhe verë e freskët. Lartësia mbi det sjell luhatje të mëdha ditë-natë dhe reshje më të bollshme se në ultësirë.`,
    kontinentale: `${city.nameAl} ndodhet në ${city.region} (${cl}), me klimë kontinentale: dimër i ftohtë e me borë dhe verë e nxehtë. Largësia nga deti bën që amplituda vjetore e temperaturave të jetë e theksuar.`,
    fushore: `${city.nameAl} ndodhet në ultësirën e ${city.region} (${cl}), me klimë mesdhetare fushore: verë të nxehtë e të thatë dhe dimër të butë. Reshjet përqendrohen kryesisht në gjysmën e ftohtë të vitit.`,
  };
  return `${intros[arch]} Koordinatat gjeografike: ${coord}. Në këtë faqe gjeni parashikimin live orë-pas-ore dhe 10-ditor: temperaturën, ndjesinë termike, reshjet, erën, lagështinë dhe indeksin UV.`;
}

/** Kur është koha më e mirë për të vizituar — varion sipas arketipit. */
export function bestTime(city) {
  switch (classify(city)) {
    case "bregdetare":
      return `Për plazh dhe det, periudha ideale në ${city.nameAl} është qershor–shtator, kur uji është i ngrohtë dhe dielli i bollshëm. Maji dhe tetori ofrojnë mot të këndshëm me më pak turistë.`;
    case "malore":
      return `${city.nameAl} është më e bukur në fund të pranverës (maj–qershor) dhe në vjeshtë (shtator–tetor) për ecje e natyrë; dimri tërheq vizitorë për borë e sporte dimërore.`;
    case "kontinentale":
      return `Periudha më e këndshme për të vizituar ${city.nameAl} është pranvera (prill–qershor) dhe vjeshta (shtator–tetor), me temperatura të buta dhe ditë të kthjellëta.`;
    default:
      return `Koha më e mirë për ${city.nameAl} është nga maji deri në tetor, me mot të qëndrueshëm, diell dhe temperatura të këndshme.`;
  }
}

/** FAQ me përgjigje që ndryshojnë sipas arketipit klimatik. */
export function faqs(city) {
  const arch = classify(city);
  const summerHi = arch === "malore" ? "22°C–30°C" : arch === "bregdetare" ? "28°C–34°C" : "26°C–36°C";
  const winterLo = arch === "malore" ? "-5°C deri 5°C" : arch === "bregdetare" ? "5°C deri 12°C" : "0°C deri 10°C";
  const rain =
    arch === "malore"
      ? "1000–1600 mm në vit, me borë të konsiderueshme në dimër"
      : arch === "bregdetare"
      ? "900–1100 mm në vit, kryesisht nga tetori në mars"
      : "700–1100 mm në vit, të përqendruara në dimër";

  return [
    {
      q: `Sa është temperatura verore në ${city.nameAl}?`,
      a: `Gjatë verës (qershor–gusht) temperaturat maksimale në ${city.nameAl} luhaten zakonisht ${summerHi}, sipas ditës dhe kushteve atmosferike.`,
    },
    {
      q: `Sa i ftohtë është dimri në ${city.nameAl}?`,
      a: `Në dimër (dhjetor–shkurt) temperaturat minimale në ${city.nameAl} shkojnë ${winterLo}. Shiko parashikimin 10-ditor më lart për vlerat aktuale.`,
    },
    {
      q: `Sa reshje bien në ${city.nameAl} gjatë vitit?`,
      a: `${city.nameAl} merr mesatarisht ${rain}.`,
    },
    {
      q: `Kur është koha më e mirë për të vizituar ${city.nameAl}?`,
      a: bestTime(city),
    },
  ];
}
