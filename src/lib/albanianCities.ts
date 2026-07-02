import type { SearchResult } from "../types/weather";

export const ALBANIAN_CITIES: SearchResult[] = [
  // ═══════════════════════════════════════════════
  // SHQIPËRI — QYTETET KRYESORE
  // ═══════════════════════════════════════════════
  { id: "tirana", name: "Tiranë", nameAl: "Tiranë", region: "Tiranë", country: "Albania", lat: 41.3275, lon: 19.8187, population: 800000 },
  { id: "durres", name: "Durrës", nameAl: "Durrës", region: "Durrës", country: "Albania", lat: 41.3246, lon: 19.4565, population: 200000 },
  { id: "vlore", name: "Vlorë", nameAl: "Vlorë", region: "Vlorë", country: "Albania", lat: 40.4667, lon: 19.4833, population: 120000 },
  { id: "shkoder", name: "Shkodër", nameAl: "Shkodër", region: "Shkodër", country: "Albania", lat: 42.0683, lon: 19.5126, population: 115000 },
  { id: "elbasan", name: "Elbasan", nameAl: "Elbasan", region: "Elbasan", country: "Albania", lat: 41.1125, lon: 20.0822, population: 100000 },
  { id: "korca", name: "Korçë", nameAl: "Korçë", region: "Korçë", country: "Albania", lat: 40.6186, lon: 20.7808, population: 80000 },
  { id: "fier", name: "Fier", nameAl: "Fier", region: "Fier", country: "Albania", lat: 40.7239, lon: 19.5567, population: 60000 },
  { id: "berat", name: "Berat", nameAl: "Berat", region: "Berat", country: "Albania", lat: 40.7058, lon: 19.9522, population: 60000 },
  { id: "lushnje", name: "Lushnjë", nameAl: "Lushnjë", region: "Fier", country: "Albania", lat: 40.9417, lon: 19.7056, population: 50000 },
  { id: "kavaje", name: "Kavajë", nameAl: "Kavajë", region: "Tiranë", country: "Albania", lat: 41.1853, lon: 19.5569, population: 45000 },
  { id: "gjirokaster", name: "Gjirokastër", nameAl: "Gjirokastër", region: "Gjirokastër", country: "Albania", lat: 40.0758, lon: 20.1389, population: 35000 },
  { id: "sarande", name: "Sarandë", nameAl: "Sarandë", region: "Vlorë", country: "Albania", lat: 39.8756, lon: 20.0056, population: 35000 },
  { id: "lezhe", name: "Lezhë", nameAl: "Lezhë", region: "Lezhë", country: "Albania", lat: 41.7861, lon: 19.6431, population: 30000 },
  { id: "pogradec", name: "Pogradec", nameAl: "Pogradec", region: "Korçë", country: "Albania", lat: 40.9025, lon: 20.6558, population: 30000 },
  { id: "kukes", name: "Kukës", nameAl: "Kukës", region: "Kukës", country: "Albania", lat: 42.0750, lon: 20.4219, population: 20000 },
  { id: "peshkopi", name: "Peshkopi", nameAl: "Peshkopi", region: "Dibër", country: "Albania", lat: 41.6847, lon: 20.4297, population: 18000 },
  { id: "permet", name: "Përmet", nameAl: "Përmet", region: "Gjirokastër", country: "Albania", lat: 40.2353, lon: 20.3519, population: 12000 },
  { id: "himare", name: "Himarë", nameAl: "Himarë", region: "Vlorë", country: "Albania", lat: 40.1003, lon: 19.7431, population: 8000 },
  { id: "tepelene", name: "Tepelenë", nameAl: "Tepelenë", region: "Gjirokastër", country: "Albania", lat: 40.2969, lon: 20.0175, population: 7000 },
  { id: "gramsh", name: "Gramsh", nameAl: "Gramsh", region: "Elbasan", country: "Albania", lat: 40.8672, lon: 20.1819, population: 10000 },
  { id: "librazhd", name: "Librazhd", nameAl: "Librazhd", region: "Elbasan", country: "Albania", lat: 41.1836, lon: 20.3175, population: 9000 },
  { id: "erseke", name: "Ersekë", nameAl: "Ersekë", region: "Korçë", country: "Albania", lat: 40.3381, lon: 20.6822, population: 6000 },
  { id: "bulqize", name: "Bulqizë", nameAl: "Bulqizë", region: "Dibër", country: "Albania", lat: 41.4942, lon: 20.2236, population: 12000 },
  { id: "bajram-curri", name: "Bajram Curri", nameAl: "Bajram Curri", region: "Kukës", country: "Albania", lat: 42.3553, lon: 20.0733, population: 13000 },
  { id: "tropoje", name: "Tropojë", nameAl: "Tropojë", region: "Kukës", country: "Albania", lat: 42.3989, lon: 20.1619, population: 5000 },
  { id: "kruje", name: "Krujë", nameAl: "Krujë", region: "Durrës", country: "Albania", lat: 41.5097, lon: 19.7953, population: 20000 },
  { id: "fushe-kruje", name: "Fushë Krujë", nameAl: "Fushë Krujë", region: "Durrës", country: "Albania", lat: 41.4783, lon: 19.7156, population: 15000 },
  { id: "lac", name: "Laç", nameAl: "Laç", region: "Lezhë", country: "Albania", lat: 41.6358, lon: 19.7172, population: 18000 },
  { id: "kurbin", name: "Kurbin", nameAl: "Kurbin", region: "Lezhë", country: "Albania", lat: 41.6417, lon: 19.7125, population: 5000 },
  { id: "mamurras", name: "Mamurras", nameAl: "Mamurras", region: "Lezhë", country: "Albania", lat: 41.5842, lon: 19.6931, population: 8000 },
  { id: "rreshen", name: "Rrëshën", nameAl: "Rrëshën", region: "Lezhë", country: "Albania", lat: 41.7697, lon: 19.8919, population: 8000 },
  { id: "burrel", name: "Burrel", nameAl: "Burrel", region: "Dibër", country: "Albania", lat: 41.6094, lon: 20.0083, population: 12000 },
  { id: "klos", name: "Klos", nameAl: "Klos", region: "Dibër", country: "Albania", lat: 41.5144, lon: 20.0761, population: 3000 },
  { id: "corovode", name: "Çorovodë", nameAl: "Çorovodë", region: "Berat", country: "Albania", lat: 40.5036, lon: 20.2281, population: 5000 },
  { id: "polican", name: "Poliçan", nameAl: "Poliçan", region: "Berat", country: "Albania", lat: 40.6069, lon: 20.0750, population: 10000 },
  { id: "ura-vajgurore", name: "Ura Vajgurore", nameAl: "Ura Vajgurore", region: "Berat", country: "Albania", lat: 40.7661, lon: 19.9194, population: 10000 },
  { id: "kucove", name: "Kuçovë", nameAl: "Kuçovë", region: "Berat", country: "Albania", lat: 40.8019, lon: 19.9153, population: 25000 },
  { id: "roskovec", name: "Roskovec", nameAl: "Roskovec", region: "Fier", country: "Albania", lat: 40.7356, lon: 19.7000, population: 7000 },
  { id: "patos", name: "Patos", nameAl: "Patos", region: "Fier", country: "Albania", lat: 40.6881, lon: 19.6175, population: 15000 },
  { id: "ballsh", name: "Ballsh", nameAl: "Ballsh", region: "Fier", country: "Albania", lat: 40.5983, lon: 19.7300, population: 5000 },
  { id: "divjake", name: "Divjakë", nameAl: "Divjakë", region: "Fier", country: "Albania", lat: 40.9997, lon: 19.5281, population: 5000 },
  { id: "selenice", name: "Selenicë", nameAl: "Selenicë", region: "Vlorë", country: "Albania", lat: 40.5408, lon: 19.6397, population: 4000 },
  { id: "libohove", name: "Libohovë", nameAl: "Libohovë", region: "Gjirokastër", country: "Albania", lat: 40.0319, lon: 20.2653, population: 3000 },
  { id: "kelcyre", name: "Këlcyrë", nameAl: "Këlcyrë", region: "Gjirokastër", country: "Albania", lat: 40.3133, lon: 20.1894, population: 2500 },
  { id: "memaliaj", name: "Memaliaj", nameAl: "Memaliaj", region: "Gjirokastër", country: "Albania", lat: 40.3500, lon: 19.9833, population: 5000 },
  { id: "delvine", name: "Delvinë", nameAl: "Delvinë", region: "Vlorë", country: "Albania", lat: 39.9483, lon: 20.0958, population: 3000 },
  { id: "konispol", name: "Konispol", nameAl: "Konispol", region: "Vlorë", country: "Albania", lat: 39.6631, lon: 20.1547, population: 2500 },
  { id: "shijak", name: "Shijak", nameAl: "Shijak", region: "Durrës", country: "Albania", lat: 41.3456, lon: 19.5683, population: 12000 },
  { id: "sukth", name: "Sukth", nameAl: "Sukth", region: "Durrës", country: "Albania", lat: 41.3781, lon: 19.5428, population: 8000 },
  { id: "manez", name: "Manëz", nameAl: "Manëz", region: "Durrës", country: "Albania", lat: 41.3753, lon: 19.6233, population: 5000 },
  { id: "vore", name: "Vorë", nameAl: "Vorë", region: "Tiranë", country: "Albania", lat: 41.3931, lon: 19.6567, population: 15000 },
  { id: "kamez", name: "Kamëz", nameAl: "Kamëz", region: "Tiranë", country: "Albania", lat: 41.3811, lon: 19.7683, population: 85000 },
  { id: "paskuqan", name: "Paskuqan", nameAl: "Paskuqan", region: "Tiranë", country: "Albania", lat: 41.3658, lon: 19.7922, population: 30000 },
  { id: "farka", name: "Farkë", nameAl: "Farkë", region: "Tiranë", country: "Albania", lat: 41.2972, lon: 19.8878, population: 18000 },
  { id: "petrele", name: "Petrelë", nameAl: "Petrelë", region: "Tiranë", country: "Albania", lat: 41.2403, lon: 19.9267, population: 3000 },
  { id: "baldushk", name: "Baldushk", nameAl: "Baldushk", region: "Tiranë", country: "Albania", lat: 41.2317, lon: 19.7539, population: 4000 },
  { id: "ndroq", name: "Ndroq", nameAl: "Ndroq", region: "Tiranë", country: "Albania", lat: 41.3003, lon: 19.6917, population: 5000 },
  { id: "peqin", name: "Peqin", nameAl: "Peqin", region: "Elbasan", country: "Albania", lat: 41.0442, lon: 19.7506, population: 10000 },
  { id: "cerrik", name: "Cërrik", nameAl: "Cërrik", region: "Elbasan", country: "Albania", lat: 40.9789, lon: 19.9872, population: 10000 },
  { id: "prrenjas", name: "Prrenjas", nameAl: "Prrenjas", region: "Elbasan", country: "Albania", lat: 41.0633, lon: 20.5428, population: 6000 },
  { id: "bilisht", name: "Bilisht", nameAl: "Bilisht", region: "Korçë", country: "Albania", lat: 40.6261, lon: 21.0033, population: 8000 },
  { id: "maliq", name: "Maliq", nameAl: "Maliq", region: "Korçë", country: "Albania", lat: 40.7094, lon: 20.6958, population: 12000 },
  { id: "voskopoje", name: "Voskopojë", nameAl: "Voskopojë", region: "Korçë", country: "Albania", lat: 40.6500, lon: 20.5922, population: 1500 },
  { id: "dardhe", name: "Dardhë", nameAl: "Dardhë", region: "Korçë", country: "Albania", lat: 40.5433, lon: 20.6822, population: 500 },
  { id: "borsh", name: "Borsh", nameAl: "Borsh", region: "Vlorë", country: "Albania", lat: 40.0522, lon: 19.8611, population: 1200 },
  { id: "dhermi", name: "Dhërmi", nameAl: "Dhërmi", region: "Vlorë", country: "Albania", lat: 40.1572, lon: 19.7044, population: 1000 },
  { id: "palasa", name: "Palasë", nameAl: "Palasë", region: "Vlorë", country: "Albania", lat: 40.1906, lon: 19.6831, population: 800 },
  { id: "lukove", name: "Lukovë", nameAl: "Lukovë", region: "Vlorë", country: "Albania", lat: 39.9881, lon: 19.9267, population: 1500 },
  { id: "ksamil", name: "Ksamil", nameAl: "Ksamil", region: "Vlorë", country: "Albania", lat: 39.7656, lon: 20.0097, population: 3000 },
  { id: "butrint", name: "Butrint", nameAl: "Butrint", region: "Vlorë", country: "Albania", lat: 39.7458, lon: 20.0186, population: 500 },
  { id: "orikum", name: "Orikum", nameAl: "Orikum", region: "Vlorë", country: "Albania", lat: 40.3250, lon: 19.4708, population: 3500 },
  { id: "radhime", name: "Radhimë", nameAl: "Radhimë", region: "Vlorë", country: "Albania", lat: 40.3897, lon: 19.5003, population: 2000 },
  { id: "drashovice", name: "Drashovicë", nameAl: "Drashovicë", region: "Vlorë", country: "Albania", lat: 40.5678, lon: 19.5583, population: 2000 },
  { id: "leskovik", name: "Leskovik", nameAl: "Leskovik", region: "Korçë", country: "Albania", lat: 40.1503, lon: 20.5958, population: 3500 },
  { id: "vithkuq", name: "Vithkuq", nameAl: "Vithkuq", region: "Korçë", country: "Albania", lat: 40.5592, lon: 20.5261, population: 1200 },
  { id: "kolonje", name: "Kolonjë", nameAl: "Kolonjë", region: "Korçë", country: "Albania", lat: 40.3156, lon: 20.6761, population: 1500 },
  { id: "golem", name: "Golem", nameAl: "Golem", region: "Tiranë", country: "Albania", lat: 41.1689, lon: 19.4586, population: 8000 },
  { id: "kashar", name: "Kashar", nameAl: "Kashar", region: "Tiranë", country: "Albania", lat: 41.3608, lon: 19.7347, population: 15000 },
  { id: "bathore", name: "Bathore", nameAl: "Bathore", region: "Tiranë", country: "Albania", lat: 41.4028, lon: 19.7839, population: 25000 },
  { id: "sharre", name: "Sharrë", nameAl: "Sharrë", region: "Tiranë", country: "Albania", lat: 41.2944, lon: 19.7681, population: 5000 },
  { id: "don-bosko", name: "Don Bosko", nameAl: "Don Bosko", region: "Tiranë", country: "Albania", lat: 41.3308, lon: 19.8678, population: 10000 },
  { id: "koplik", name: "Koplik", nameAl: "Koplik", region: "Shkodër", country: "Albania", lat: 42.2150, lon: 19.4378, population: 6000 },
  { id: "puke", name: "Pukë", nameAl: "Pukë", region: "Shkodër", country: "Albania", lat: 42.0453, lon: 19.8972, population: 5000 },
  { id: "fushe-arrez", name: "Fushë Arrëz", nameAl: "Fushë Arrëz", region: "Shkodër", country: "Albania", lat: 42.0797, lon: 19.9856, population: 4000 },
  { id: "vau-dejes", name: "Vau i Dejës", nameAl: "Vau i Dejës", region: "Shkodër", country: "Albania", lat: 41.9608, lon: 19.6722, population: 5000 },
  { id: "bushat", name: "Bushat", nameAl: "Bushat", region: "Shkodër", country: "Albania", lat: 42.0028, lon: 19.5461, population: 4000 },
  { id: "velipoje", name: "Velipojë", nameAl: "Velipojë", region: "Shkodër", country: "Albania", lat: 41.8711, lon: 19.4431, population: 2500 },
  { id: "shiroke", name: "Shiroka", nameAl: "Shiroka", region: "Shkodër", country: "Albania", lat: 42.0944, lon: 19.4592, population: 2000 },
  { id: "kelmend", name: "Kelmend", nameAl: "Kelmend", region: "Shkodër", country: "Albania", lat: 42.4217, lon: 19.6781, population: 4000 },
  { id: "theth", name: "Theth", nameAl: "Theth", region: "Shkodër", country: "Albania", lat: 42.3797, lon: 19.7956, population: 600 },
  { id: "valbona", name: "Valbonë", nameAl: "Valbonë", region: "Shkodër", country: "Albania", lat: 42.4261, lon: 19.8817, population: 400 },
  { id: "rubik", name: "Rubik", nameAl: "Rubik", region: "Lezhë", country: "Albania", lat: 41.7753, lon: 19.9408, population: 5000 },
  { id: "milot", name: "Milot", nameAl: "Milot", region: "Lezhë", country: "Albania", lat: 41.6889, lon: 19.7183, population: 4000 },
  { id: "shengjin", name: "Shëngjin", nameAl: "Shëngjin", region: "Lezhë", country: "Albania", lat: 41.8139, lon: 19.5936, population: 8000 },
  { id: "mirdite", name: "Mirditë", nameAl: "Mirditë", region: "Lezhë", country: "Albania", lat: 41.7714, lon: 19.9825, population: 4000 },
  { id: "krume", name: "Krumë", nameAl: "Krumë", region: "Kukës", country: "Albania", lat: 42.1953, lon: 20.4167, population: 5000 },
  { id: "fierze", name: "Fierzë", nameAl: "Fierzë", region: "Shkodër", country: "Albania", lat: 42.2028, lon: 20.0450, population: 3000 },
  { id: "bradashesh", name: "Bradashesh", nameAl: "Bradashesh", region: "Elbasan", country: "Albania", lat: 41.1328, lon: 20.0736, population: 6000 },
  { id: "seman", name: "Seman", nameAl: "Seman", region: "Fier", country: "Albania", lat: 40.7656, lon: 19.4961, population: 5000 },
  { id: "ishull-lezhe", name: "Ishull-Lezhë", nameAl: "Ishull-Lezhë", region: "Lezhë", country: "Albania", lat: 41.7681, lon: 19.5628, population: 2000 },
  { id: "spille", name: "Spille", nameAl: "Spille", region: "Durrës", country: "Albania", lat: 41.2297, lon: 19.4019, population: 3000 },
  { id: "ishëm", name: "Ishëm", nameAl: "Ishëm", region: "Durrës", country: "Albania", lat: 41.5342, lon: 19.5347, population: 5000 },
  { id: "dropull", name: "Dropull", nameAl: "Dropull", region: "Gjirokastër", country: "Albania", lat: 39.9381, lon: 20.2461, population: 3000 },
  { id: "pogon", name: "Pogon", nameAl: "Pogon", region: "Gjirokastër", country: "Albania", lat: 39.9861, lon: 20.2769, population: 2000 },
  { id: "otllak", name: "Otllak", nameAl: "Otllak", region: "Berat", country: "Albania", lat: 40.6822, lon: 19.9742, population: 2000 },
  { id: "cukalat", name: "Çukalat", nameAl: "Çukalat", region: "Berat", country: "Albania", lat: 40.6153, lon: 19.9758, population: 1000 },
  { id: "roshnik", name: "Roshnik", nameAl: "Roshnik", region: "Berat", country: "Albania", lat: 40.6736, lon: 20.0789, population: 1000 },
  { id: "banjes", name: "Banjës", nameAl: "Banjës", region: "Berat", country: "Albania", lat: 40.7092, lon: 20.1272, population: 1800 },
  { id: "qesarat", name: "Qesarat", nameAl: "Qesarat", region: "Berat", country: "Albania", lat: 40.6703, lon: 20.0358, population: 1500 },
  { id: "kutalli", name: "Kutalli", nameAl: "Kutalli", region: "Berat", country: "Albania", lat: 40.6956, lon: 20.0556, population: 2000 },
  { id: "antigone", name: "Antigonë", nameAl: "Antigonë", region: "Gjirokastër", country: "Albania", lat: 40.0983, lon: 20.1819, population: 1000 },
  { id: "frasheri", name: "Frashëri", nameAl: "Frashëri", region: "Berat", country: "Albania", lat: 40.3856, lon: 20.4183, population: 1500 },
  { id: "labinot-fushe", name: "Labinot-Fushë", nameAl: "Labinot-Fushë", region: "Elbasan", country: "Albania", lat: 41.1261, lon: 20.1883, population: 4000 },
  { id: "kastriot", name: "Kastriot", nameAl: "Kastriot", region: "Elbasan", country: "Albania", lat: 41.2972, lon: 20.0481, population: 4000 },
  { id: "gjinar", name: "Gjinar", nameAl: "Gjinar", region: "Elbasan", country: "Albania", lat: 41.0739, lon: 20.2481, population: 2500 },
  { id: "zall-herr", name: "Zall-Herr", nameAl: "Zall-Herr", region: "Tiranë", country: "Albania", lat: 41.3936, lon: 19.9178, population: 4000 },
  { id: "mullet", name: "Mullët", nameAl: "Mullët", region: "Tiranë", country: "Albania", lat: 41.3711, lon: 19.9736, population: 3000 },
  { id: "tufine", name: "Tufinë", nameAl: "Tufinë", region: "Tiranë", country: "Albania", lat: 41.3678, lon: 19.8508, population: 5000 },
  { id: "vore", name: "Vorë", nameAl: "Vorë", region: "Tiranë", country: "Albania", lat: 41.3931, lon: 19.6567, population: 15000 },

  // ═══════════════════════════════════════════════
  // TIRANË — LAGJE & FSHATRA
  // ═══════════════════════════════════════════════
  { id: "kombinat", name: "Kombinat", nameAl: "Kombinat", region: "Tiranë", country: "Albania", lat: 41.3081, lon: 19.7997, population: 20000 },
  { id: "selite", name: "Selitë", nameAl: "Selitë", region: "Tiranë", country: "Albania", lat: 41.3197, lon: 19.8397, population: 15000 },
  { id: "kinostudio", name: "Kinostudio", nameAl: "Kinostudio", region: "Tiranë", country: "Albania", lat: 41.3436, lon: 19.8322, population: 12000 },
  { id: "brryli", name: "Brryli", nameAl: "Brryli", region: "Tiranë", country: "Albania", lat: 41.3375, lon: 19.8594, population: 8000 },
  { id: "liqeni-i-thate", name: "Liqeni i Thatë", nameAl: "Liqeni i Thatë", region: "Tiranë", country: "Albania", lat: 41.3483, lon: 19.7939, population: 6000 },
  { id: "astiri", name: "Astir", nameAl: "Astir", region: "Tiranë", country: "Albania", lat: 41.3242, lon: 19.8892, population: 10000 },
  { id: "zall-bastar", name: "Zall-Bastar", nameAl: "Zall-Bastar", region: "Tiranë", country: "Albania", lat: 41.4389, lon: 19.9267, population: 3000 },
  { id: "ibe", name: "Ibë", nameAl: "Ibë", region: "Tiranë", country: "Albania", lat: 41.4086, lon: 19.9228, population: 2000 },
  { id: "berxull", name: "Berxull", nameAl: "Berxull", region: "Tiranë", country: "Albania", lat: 41.4228, lon: 19.8503, population: 3000 },
  { id: "mjull-bathore", name: "Mjull-Bathore", nameAl: "Mjull-Bathore", region: "Tiranë", country: "Albania", lat: 41.4178, lon: 19.7956, population: 8000 },
  { id: "shkalle", name: "Shkallë", nameAl: "Shkallë", region: "Tiranë", country: "Albania", lat: 41.2036, lon: 19.8183, population: 2500 },
  { id: "linze", name: "Linzë", nameAl: "Linzë", region: "Tiranë", country: "Albania", lat: 41.2936, lon: 19.9197, population: 3000 },
  { id: "synej", name: "Synej", nameAl: "Synej", region: "Tiranë", country: "Albania", lat: 41.1811, lon: 19.6328, population: 1800 },
  { id: "luz-i-vogel", name: "Luz i Vogël", nameAl: "Luz i Vogël", region: "Tiranë", country: "Albania", lat: 41.1592, lon: 19.6219, population: 2000 },
  { id: "ndroq-fshat", name: "Ndroq Fshat", nameAl: "Ndroq Fshat", region: "Tiranë", country: "Albania", lat: 41.2944, lon: 19.6761, population: 2000 },
  { id: "preze", name: "Prezë", nameAl: "Prezë", region: "Tiranë", country: "Albania", lat: 41.4658, lon: 19.7533, population: 3000 },
  { id: "krrabe", name: "Krrabë", nameAl: "Krrabë", region: "Tiranë", country: "Albania", lat: 41.2622, lon: 19.9917, population: 2000 },
  { id: "stebleve", name: "Steblevë", nameAl: "Steblevë", region: "Elbasan", country: "Albania", lat: 41.1761, lon: 20.2567, population: 1500 },
  { id: "buqet", name: "Buqet", nameAl: "Buqet", region: "Elbasan", country: "Albania", lat: 41.1058, lon: 20.1533, population: 1200 },

  // ═══════════════════════════════════════════════
  // SHKODËR — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "shale-shkoder", name: "Shalë", nameAl: "Shalë", region: "Shkodër", country: "Albania", lat: 42.1853, lon: 19.7556, population: 3000 },
  { id: "rec", name: "Reç", nameAl: "Reç", region: "Shkodër", country: "Albania", lat: 42.0639, lon: 19.5272, population: 2000 },
  { id: "hajmel", name: "Hajmel", nameAl: "Hajmel", region: "Shkodër", country: "Albania", lat: 42.0397, lon: 19.5533, population: 2000 },
  { id: "barbullush", name: "Barbullush", nameAl: "Barbullush", region: "Shkodër", country: "Albania", lat: 42.0258, lon: 19.5222, population: 1800 },
  { id: "gruemire", name: "Gruemirë", nameAl: "Gruemirë", region: "Shkodër", country: "Albania", lat: 42.0778, lon: 19.6022, population: 1500 },
  { id: "darragjat", name: "Darragjat", nameAl: "Darragjat", region: "Shkodër", country: "Albania", lat: 42.0061, lon: 19.8206, population: 3000 },
  { id: "postribe", name: "Postribë", nameAl: "Postribë", region: "Shkodër", country: "Albania", lat: 42.1114, lon: 19.7106, population: 3000 },
  { id: "shosh", name: "Shosh", nameAl: "Shosh", region: "Shkodër", country: "Albania", lat: 42.1575, lon: 19.6439, population: 2000 },
  { id: "rrjoll", name: "Rrjoll", nameAl: "Rrjoll", region: "Shkodër", country: "Albania", lat: 42.0256, lon: 19.6122, population: 1500 },
  { id: "dajc", name: "Dajç", nameAl: "Dajç", region: "Shkodër", country: "Albania", lat: 41.9453, lon: 19.5733, population: 2000 },
  { id: "ana-malit", name: "Ana e Malit", nameAl: "Ana e Malit", region: "Shkodër", country: "Albania", lat: 42.2167, lon: 19.5767, population: 2500 },
  { id: "nenshat", name: "Nënshtat", nameAl: "Nënshtat", region: "Shkodër", country: "Albania", lat: 42.0722, lon: 19.7303, population: 1500 },
  { id: "cur", name: "Çur", nameAl: "Çur", region: "Shkodër", country: "Albania", lat: 42.3122, lon: 19.8606, population: 1000 },
  { id: "dragobi", name: "Dragobí", nameAl: "Dragobí", region: "Shkodër", country: "Albania", lat: 42.4014, lon: 19.9361, population: 500 },
  { id: "lekbibaj", name: "Lekbibaj", nameAl: "Lekbibaj", region: "Shkodër", country: "Albania", lat: 42.3867, lon: 19.8033, population: 800 },
  { id: "vermosh", name: "Vermosh", nameAl: "Vermosh", region: "Shkodër", country: "Albania", lat: 42.5383, lon: 19.7711, population: 400 },
  { id: "tamara", name: "Tamarë", nameAl: "Tamarë", region: "Shkodër", country: "Albania", lat: 42.2458, lon: 19.6933, population: 1200 },
  { id: "qafe-mali", name: "Qafë Mali", nameAl: "Qafë Mali", region: "Shkodër", country: "Albania", lat: 41.9994, lon: 19.7706, population: 1000 },
  { id: "zhur", name: "Zhur", nameAl: "Zhur", region: "Shkodër", country: "Albania", lat: 42.1283, lon: 19.5078, population: 1500 },
  { id: "temal", name: "Temal", nameAl: "Temal", region: "Shkodër", country: "Albania", lat: 42.0033, lon: 19.6450, population: 1200 },
  { id: "suka", name: "Suka", nameAl: "Suka", region: "Shkodër", country: "Albania", lat: 41.9872, lon: 19.6967, population: 1000 },
  { id: "shelqet", name: "Shelqet", nameAl: "Shelqet", region: "Shkodër", country: "Albania", lat: 41.9283, lon: 19.5522, population: 1500 },
  { id: "mjede", name: "Mjedë", nameAl: "Mjedë", region: "Shkodër", country: "Albania", lat: 41.9644, lon: 19.5894, population: 1200 },
  { id: "drisht", name: "Drisht", nameAl: "Drisht", region: "Shkodër", country: "Albania", lat: 42.0906, lon: 19.5728, population: 900 },
  { id: "shllak", name: "Shllak", nameAl: "Shllak", region: "Shkodër", country: "Albania", lat: 42.2625, lon: 19.7033, population: 600 },
  { id: "oboti", name: "Oboti", nameAl: "Oboti", region: "Shkodër", country: "Albania", lat: 42.4283, lon: 19.5839, population: 500 },
  { id: "boge", name: "Bogë", nameAl: "Bogë", region: "Shkodër", country: "Albania", lat: 42.2944, lon: 19.8283, population: 300 },

  // ═══════════════════════════════════════════════
  // LEZHË — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "zadrime", name: "Zadrimë", nameAl: "Zadrimë", region: "Lezhë", country: "Albania", lat: 41.9136, lon: 19.6281, population: 5000 },
  { id: "surroj", name: "Surroj", nameAl: "Surroj", region: "Lezhë", country: "Albania", lat: 41.8211, lon: 19.7389, population: 1500 },
  { id: "blinisht", name: "Blinisht", nameAl: "Blinisht", region: "Lezhë", country: "Albania", lat: 41.8639, lon: 19.6394, population: 3000 },
  { id: "kallmet", name: "Kallmet", nameAl: "Kallmet", region: "Lezhë", country: "Albania", lat: 41.7881, lon: 19.7472, population: 2500 },
  { id: "shehun", name: "Shehun", nameAl: "Shehun", region: "Lezhë", country: "Albania", lat: 41.6483, lon: 19.6997, population: 2000 },
  { id: "buzane", name: "Buzanë", nameAl: "Buzanë", region: "Lezhë", country: "Albania", lat: 41.7239, lon: 19.6553, population: 2500 },
  { id: "leke-rrethina", name: "Lekë Rrethina", nameAl: "Lekë Rrethina", region: "Lezhë", country: "Albania", lat: 41.7897, lon: 19.7817, population: 1800 },
  { id: "orosh", name: "Orosh", nameAl: "Orosh", region: "Lezhë", country: "Albania", lat: 41.7356, lon: 19.9667, population: 2000 },
  { id: "gjegjan-lezhe", name: "Gjegjan", nameAl: "Gjegjan", region: "Lezhë", country: "Albania", lat: 41.6294, lon: 20.2131, population: 1500 },
  { id: "fushë-vela", name: "Fushë Vela", nameAl: "Fushë Vela", region: "Lezhë", country: "Albania", lat: 41.7058, lon: 19.6483, population: 1200 },
  { id: "ungrej", name: "Ungrej", nameAl: "Ungrej", region: "Lezhë", country: "Albania", lat: 41.7569, lon: 19.7033, population: 1500 },
  { id: "zejmen", name: "Zejmen", nameAl: "Zejmen", region: "Lezhë", country: "Albania", lat: 41.6908, lon: 19.6706, population: 2000 },
  { id: "lac-fshat", name: "Laç Fshat", nameAl: "Laç Fshat", region: "Lezhë", country: "Albania", lat: 41.6317, lon: 19.7033, population: 3000 },
  { id: "kolç", name: "Kolç", nameAl: "Kolç", region: "Lezhë", country: "Albania", lat: 41.6833, lon: 19.7567, population: 1200 },
  { id: "troshan", name: "Troshan", nameAl: "Troshan", region: "Lezhë", country: "Albania", lat: 41.6544, lon: 19.7794, population: 2000 },
  { id: "balldren", name: "Balldren", nameAl: "Balldren", region: "Lezhë", country: "Albania", lat: 41.6789, lon: 19.8133, population: 1800 },
  { id: "spac", name: "Spaç", nameAl: "Spaç", region: "Lezhë", country: "Albania", lat: 41.8022, lon: 19.9711, population: 500 },

  // ═══════════════════════════════════════════════
  // DURRËS — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "hamallaj", name: "Hamallaj", nameAl: "Hamallaj", region: "Durrës", country: "Albania", lat: 41.2658, lon: 19.4706, population: 3000 },
  { id: "currila", name: "Currilat", nameAl: "Currilat", region: "Durrës", country: "Albania", lat: 41.3417, lon: 19.4425, population: 3000 },
  { id: "rashbull", name: "Rashbull", nameAl: "Rashbull", region: "Durrës", country: "Albania", lat: 41.4717, lon: 19.4706, population: 2500 },
  { id: "xhafzotaj", name: "Xhafzotaj", nameAl: "Xhafzotaj", region: "Durrës", country: "Albania", lat: 41.3467, lon: 19.6508, population: 4000 },
  { id: "rreth-greth", name: "Rreth-Greth", nameAl: "Rreth-Greth", region: "Durrës", country: "Albania", lat: 41.2911, lon: 19.5508, population: 2500 },
  { id: "plepa", name: "Plepa", nameAl: "Plepa", region: "Durrës", country: "Albania", lat: 41.2869, lon: 19.5047, population: 2500 },
  { id: "gjole", name: "Gjolë", nameAl: "Gjolë", region: "Durrës", country: "Albania", lat: 41.5978, lon: 19.5519, population: 2000 },
  { id: "katund-i-ri", name: "Katund i Ri", nameAl: "Katund i Ri", region: "Durrës", country: "Albania", lat: 41.3978, lon: 19.5808, population: 3500 },
  { id: "qerret", name: "Qerret", nameAl: "Qerret", region: "Durrës", country: "Albania", lat: 41.2042, lon: 19.4575, population: 2000 },
  { id: "cape-rodoni", name: "Kepi i Rodonit", nameAl: "Kepi i Rodonit", region: "Durrës", country: "Albania", lat: 41.5831, lon: 19.4408, population: 500 },
  { id: "mpat-kavaje", name: "Mpat", nameAl: "Mpat", region: "Tiranë", country: "Albania", lat: 41.1433, lon: 19.5597, population: 2000 },
  { id: "zguragore", name: "Zguragore", nameAl: "Zguragore", region: "Durrës", country: "Albania", lat: 41.4153, lon: 19.4850, population: 2000 },
  { id: "pezë", name: "Pezë", nameAl: "Pezë", region: "Tiranë", country: "Albania", lat: 41.2928, lon: 19.7036, population: 3000 },
  { id: "bubq", name: "Bubq", nameAl: "Bubq", region: "Durrës", country: "Albania", lat: 41.4572, lon: 19.7444, population: 2000 },
  { id: "kodër-thumanë", name: "Kodër Thumanë", nameAl: "Kodër Thumanë", region: "Durrës", country: "Albania", lat: 41.4469, lon: 19.7006, population: 2500 },
  { id: "thumanë", name: "Thumanë", nameAl: "Thumanë", region: "Durrës", country: "Albania", lat: 41.4722, lon: 19.7033, population: 3000 },
  { id: "nikel", name: "Nikël", nameAl: "Nikël", region: "Durrës", country: "Albania", lat: 41.4933, lon: 19.6650, population: 1500 },
  { id: "gajtan", name: "Gajtanë", nameAl: "Gajtanë", region: "Shkodër", country: "Albania", lat: 42.0458, lon: 19.5794, population: 2000 },

  // ═══════════════════════════════════════════════
  // FIER — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "ardenice", name: "Ardenicë", nameAl: "Ardenicë", region: "Fier", country: "Albania", lat: 40.7953, lon: 19.6439, population: 2000 },
  { id: "grebesh", name: "Grebesh", nameAl: "Grebesh", region: "Fier", country: "Albania", lat: 40.6519, lon: 19.5831, population: 1500 },
  { id: "karbunarë", name: "Karbunarë", nameAl: "Karbunarë", region: "Fier", country: "Albania", lat: 40.7733, lon: 19.6717, population: 3000 },
  { id: "qender-fier", name: "Qendër Fier", nameAl: "Qendër Fier", region: "Fier", country: "Albania", lat: 40.6961, lon: 19.5247, population: 2500 },
  { id: "portez", name: "Portëz", nameAl: "Portëz", region: "Fier", country: "Albania", lat: 40.6303, lon: 19.6047, population: 2000 },
  { id: "remas", name: "Remash", nameAl: "Remash", region: "Fier", country: "Albania", lat: 40.8197, lon: 19.7028, population: 1500 },
  { id: "topojë-fier", name: "Topojë", nameAl: "Topojë", region: "Fier", country: "Albania", lat: 40.6817, lon: 19.6733, population: 1200 },
  { id: "ferxhe", name: "Ferxhe", nameAl: "Ferxhe", region: "Fier", country: "Albania", lat: 40.7439, lon: 19.6061, population: 1500 },
  { id: "frakull", name: "Frakull", nameAl: "Frakull", region: "Fier", country: "Albania", lat: 40.7092, lon: 19.5800, population: 2000 },
  { id: "gjorm", name: "Gjorm", nameAl: "Gjorm", region: "Fier", country: "Albania", lat: 40.6728, lon: 19.5383, population: 1500 },
  { id: "mbrostar", name: "Mbrostar", nameAl: "Mbrostar", region: "Fier", country: "Albania", lat: 40.8481, lon: 19.6756, population: 2500 },
  { id: "libofsha", name: "Libofshë", nameAl: "Libofshë", region: "Fier", country: "Albania", lat: 40.6278, lon: 19.6572, population: 1200 },
  { id: "tërvoli", name: "Tërvol", nameAl: "Tërvol", region: "Fier", country: "Albania", lat: 40.6628, lon: 19.7011, population: 1000 },
  { id: "shtyllas", name: "Shtyllas", nameAl: "Shtyllas", region: "Fier", country: "Albania", lat: 40.8733, lon: 19.6533, population: 1500 },
  { id: "lumas-fier", name: "Lumàs", nameAl: "Lumàs", region: "Fier", country: "Albania", lat: 40.8483, lon: 19.6308, population: 1200 },
  { id: "cakran", name: "Çakran", nameAl: "Çakran", region: "Fier", country: "Albania", lat: 40.5947, lon: 19.6883, population: 2000 },
  { id: "akerni", name: "Akerni", nameAl: "Akerni", region: "Fier", country: "Albania", lat: 40.6072, lon: 19.7167, population: 1000 },
  { id: "pishë-poro", name: "Pishë Poro", nameAl: "Pishë Poro", region: "Fier", country: "Albania", lat: 40.5622, lon: 19.6533, population: 1200 },
  { id: "tragjas-fier", name: "Tragjas Fier", nameAl: "Tragjas", region: "Fier", country: "Albania", lat: 40.6394, lon: 19.7522, population: 800 },
  { id: "novoselë-fier", name: "Novosele Fier", nameAl: "Novosele", region: "Fier", country: "Albania", lat: 40.9153, lon: 19.5706, population: 1500 },
  { id: "kolonjë-fier", name: "Kolonjë Fier", nameAl: "Kolonjë", region: "Fier", country: "Albania", lat: 40.9486, lon: 19.6183, population: 2000 },

  // ═══════════════════════════════════════════════
  // BERAT — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "mbrakull", name: "Mbrakull", nameAl: "Mbrakull", region: "Berat", country: "Albania", lat: 40.6892, lon: 19.9006, population: 2000 },
  { id: "velabisht", name: "Velabisht", nameAl: "Velabisht", region: "Berat", country: "Albania", lat: 40.7183, lon: 19.9344, population: 2000 },
  { id: "sinje-berat", name: "Sinjë", nameAl: "Sinjë", region: "Berat", country: "Albania", lat: 40.7336, lon: 20.0014, population: 1500 },
  { id: "qarishte", name: "Qarishte", nameAl: "Qarishte", region: "Berat", country: "Albania", lat: 40.6608, lon: 20.1172, population: 1200 },
  { id: "vertop", name: "Vertop", nameAl: "Vertop", region: "Berat", country: "Albania", lat: 40.6506, lon: 20.0881, population: 1200 },
  { id: "qender-skrapar", name: "Qendër Skrapar", nameAl: "Qendër Skrapar", region: "Berat", country: "Albania", lat: 40.5372, lon: 20.2969, population: 1500 },
  { id: "skrapar", name: "Skrapar", nameAl: "Skrapar", region: "Berat", country: "Albania", lat: 40.4953, lon: 20.2803, population: 3000 },
  { id: "çepan", name: "Çepan", nameAl: "Çepan", region: "Berat", country: "Albania", lat: 40.6483, lon: 19.9617, population: 1000 },
  { id: "lumas-berat", name: "Lumaj", nameAl: "Lumaj", region: "Berat", country: "Albania", lat: 40.7528, lon: 20.0572, population: 1200 },
  { id: "poshnje", name: "Poshnjë", nameAl: "Poshnjë", region: "Berat", country: "Albania", lat: 40.7817, lon: 20.0100, population: 2000 },
  { id: "karkanjoz", name: "Karkanjoz", nameAl: "Karkanjoz", region: "Berat", country: "Albania", lat: 40.6972, lon: 19.8944, population: 1000 },
  { id: "suli", name: "Suli", nameAl: "Suli", region: "Berat", country: "Albania", lat: 40.6672, lon: 19.9244, population: 1500 },
  { id: "gjerbës", name: "Gjerbës", nameAl: "Gjerbës", region: "Berat", country: "Albania", lat: 40.7608, lon: 19.9458, population: 1800 },
  { id: "tërpan", name: "Tërpan", nameAl: "Tërpan", region: "Berat", country: "Albania", lat: 40.7239, lon: 19.9753, population: 1200 },

  // ═══════════════════════════════════════════════
  // VLORË — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "novosele-vlore", name: "Novosele", nameAl: "Novosele", region: "Vlorë", country: "Albania", lat: 40.4631, lon: 19.6258, population: 3000 },
  { id: "tragjas", name: "Tragjas", nameAl: "Tragjas", region: "Vlorë", country: "Albania", lat: 40.3683, lon: 19.5867, population: 1500 },
  { id: "kanine", name: "Kaninë", nameAl: "Kaninë", region: "Vlorë", country: "Albania", lat: 40.4272, lon: 19.5567, population: 2000 },
  { id: "mavrove", name: "Mavrovë", nameAl: "Mavrovë", region: "Vlorë", country: "Albania", lat: 40.4789, lon: 19.5133, population: 2500 },
  { id: "llogara", name: "Llogaraja", nameAl: "Llogaraja", region: "Vlorë", country: "Albania", lat: 40.2372, lon: 19.6111, population: 500 },
  { id: "piqeras", name: "Piqeras", nameAl: "Piqeras", region: "Vlorë", country: "Albania", lat: 40.0306, lon: 19.8644, population: 800 },
  { id: "fterre", name: "Fterre", nameAl: "Fterre", region: "Vlorë", country: "Albania", lat: 40.0656, lon: 19.8233, population: 600 },
  { id: "ilias", name: "Ilias", nameAl: "Ilias", region: "Vlorë", country: "Albania", lat: 40.4067, lon: 19.5772, population: 1800 },
  { id: "akarnania", name: "Zvërnec", nameAl: "Zvërnec", region: "Vlorë", country: "Albania", lat: 40.4342, lon: 19.4850, population: 1500 },
  { id: "shushicë", name: "Shushicë", nameAl: "Shushicë", region: "Vlorë", country: "Albania", lat: 40.3733, lon: 19.6503, population: 1200 },
  { id: "kuç", name: "Kuç", nameAl: "Kuç", region: "Vlorë", country: "Albania", lat: 40.3061, lon: 19.6983, population: 1000 },
  { id: "qendër-vlorë", name: "Qendër Vlorë", nameAl: "Qendër Vlorë", region: "Vlorë", country: "Albania", lat: 40.5044, lon: 19.5467, population: 3000 },
  { id: "buz-himare", name: "Buzë Himarë", nameAl: "Buzë Himarë", region: "Vlorë", country: "Albania", lat: 40.1228, lon: 19.7344, population: 600 },
  { id: "pilur", name: "Pilur", nameAl: "Pilur", region: "Vlorë", country: "Albania", lat: 40.1606, lon: 19.7439, population: 500 },
  { id: "volë", name: "Volë", nameAl: "Volë", region: "Vlorë", country: "Albania", lat: 40.5028, lon: 19.6456, population: 1500 },
  { id: "aliko", name: "Aliko", nameAl: "Aliko", region: "Vlorë", country: "Albania", lat: 39.8017, lon: 20.0553, population: 600 },
  { id: "mursi", name: "Mursi", nameAl: "Mursi", region: "Vlorë", country: "Albania", lat: 39.8472, lon: 20.0192, population: 800 },
  { id: "xarrë", name: "Xarrë", nameAl: "Xarrë", region: "Vlorë", country: "Albania", lat: 39.8078, lon: 20.0317, population: 700 },

  // ═══════════════════════════════════════════════
  // GJIROKASTËR — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "sinie", name: "Sinijë", nameAl: "Sinijë", region: "Gjirokastër", country: "Albania", lat: 40.0072, lon: 20.3708, population: 1000 },
  { id: "lunxheri", name: "Lunxhëri", nameAl: "Lunxhëri", region: "Gjirokastër", country: "Albania", lat: 40.1619, lon: 20.2183, population: 2000 },
  { id: "cepo", name: "Cepo", nameAl: "Cepo", region: "Gjirokastër", country: "Albania", lat: 39.9756, lon: 20.2083, population: 1500 },
  { id: "jorgucat", name: "Jorgucat", nameAl: "Jorgucat", region: "Gjirokastër", country: "Albania", lat: 40.1083, lon: 20.1344, population: 1200 },
  { id: "lazarat", name: "Lazarat", nameAl: "Lazarat", region: "Gjirokastër", country: "Albania", lat: 40.0528, lon: 20.1194, population: 2000 },
  { id: "hamil", name: "Hamil", nameAl: "Hamil", region: "Gjirokastër", country: "Albania", lat: 40.1317, lon: 20.1594, population: 800 },
  { id: "suhë", name: "Suhë", nameAl: "Suhë", region: "Gjirokastër", country: "Albania", lat: 40.2172, lon: 20.1639, population: 1000 },
  { id: "zagorie", name: "Zagorie", nameAl: "Zagorie", region: "Gjirokastër", country: "Albania", lat: 40.2458, lon: 20.0750, population: 1500 },
  { id: "petran", name: "Petran", nameAl: "Petran", region: "Gjirokastër", country: "Albania", lat: 40.2817, lon: 20.1267, population: 1200 },
  { id: "frashtan", name: "Frashtan", nameAl: "Frashtan", region: "Gjirokastër", country: "Albania", lat: 40.3072, lon: 20.2850, population: 800 },
  { id: "kapllangë", name: "Kapllangë", nameAl: "Kapllangë", region: "Gjirokastër", country: "Albania", lat: 40.1644, lon: 20.2961, population: 500 },
  { id: "kardhiq", name: "Kardhiq", nameAl: "Kardhiq", region: "Gjirokastër", country: "Albania", lat: 40.2067, lon: 20.0944, population: 800 },
  { id: "buz-permet", name: "Buzë Përmet", nameAl: "Buzë Përmet", region: "Gjirokastër", country: "Albania", lat: 40.2633, lon: 20.2483, population: 600 },

  // ═══════════════════════════════════════════════
  // KORÇË — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "korce-fshat", name: "Korçë Fshat", nameAl: "Korçë Fshat", region: "Korçë", country: "Albania", lat: 40.5961, lon: 20.7450, population: 3000 },
  { id: "miras", name: "Miras", nameAl: "Miras", region: "Korçë", country: "Albania", lat: 40.6492, lon: 20.7183, population: 2000 },
  { id: "mollas", name: "Mollaj", nameAl: "Mollaj", region: "Korçë", country: "Albania", lat: 40.6183, lon: 20.5878, population: 1000 },
  { id: "moglice", name: "Moglicë", nameAl: "Moglicë", region: "Korçë", country: "Albania", lat: 40.3636, lon: 20.6028, population: 800 },
  { id: "linotopi", name: "Linotopë", nameAl: "Linotopë", region: "Korçë", country: "Albania", lat: 40.3431, lon: 20.6811, population: 800 },
  { id: "lajthizë", name: "Lajthizë", nameAl: "Lajthizë", region: "Korçë", country: "Albania", lat: 40.7486, lon: 20.7733, population: 1200 },
  { id: "vreshtaset", name: "Vreshtasit", nameAl: "Vreshtasit", region: "Korçë", country: "Albania", lat: 40.6867, lon: 20.7983, population: 800 },
  { id: "boboshticë", name: "Boboshticë", nameAl: "Boboshticë", region: "Korçë", country: "Albania", lat: 40.5519, lon: 20.7317, population: 1000 },
  { id: "drenove", name: "Drenovë", nameAl: "Drenovë", region: "Korçë", country: "Albania", lat: 40.5617, lon: 20.7758, population: 1500 },
  { id: "buzagjoi", name: "Buzagjoi", nameAl: "Buzagjoi", region: "Korçë", country: "Albania", lat: 40.7639, lon: 20.7406, population: 1200 },
  { id: "pirgonjot", name: "Pirgonjot", nameAl: "Pirgonjot", region: "Korçë", country: "Albania", lat: 40.5872, lon: 20.8694, population: 800 },
  { id: "progeri", name: "Proger", nameAl: "Proger", region: "Korçë", country: "Albania", lat: 40.6639, lon: 20.9361, population: 600 },
  { id: "pojan-korce", name: "Pojani Korçë", nameAl: "Pojani", region: "Korçë", country: "Albania", lat: 40.6122, lon: 20.6539, population: 1500 },
  { id: "shën-gjini-korce", name: "Shën Gjini", nameAl: "Shën Gjini", region: "Korçë", country: "Albania", lat: 40.6489, lon: 20.8217, population: 900 },

  // ═══════════════════════════════════════════════
  // DIBËR — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "mac-diber", name: "Mac", nameAl: "Mac", region: "Dibër", country: "Albania", lat: 41.5547, lon: 20.1689, population: 2000 },
  { id: "lurje", name: "Lurje", nameAl: "Lurje", region: "Dibër", country: "Albania", lat: 41.7989, lon: 20.2256, population: 2500 },
  { id: "maqellare", name: "Maqellarë", nameAl: "Maqellarë", region: "Dibër", country: "Albania", lat: 41.6031, lon: 20.2806, population: 3000 },
  { id: "bushtrice", name: "Bushtricë", nameAl: "Bushtricë", region: "Dibër", country: "Albania", lat: 41.5889, lon: 20.2478, population: 1800 },
  { id: "qafe-balle", name: "Qafë Ballë", nameAl: "Qafë Ballë", region: "Dibër", country: "Albania", lat: 41.5569, lon: 20.2994, population: 1500 },
  { id: "arras-diber", name: "Arras", nameAl: "Arras", region: "Dibër", country: "Albania", lat: 41.6444, lon: 20.2050, population: 1200 },
  { id: "kastriot-diber", name: "Kastriot Dibër", nameAl: "Kastriot", region: "Dibër", country: "Albania", lat: 41.5972, lon: 20.1533, population: 2000 },
  { id: "tomin", name: "Tomin", nameAl: "Tomin", region: "Dibër", country: "Albania", lat: 41.6633, lon: 20.3244, population: 1000 },
  { id: "sebisht", name: "Sebisht", nameAl: "Sebisht", region: "Dibër", country: "Albania", lat: 41.6094, lon: 20.3717, population: 1200 },
  { id: "muhurr", name: "Muhurr", nameAl: "Muhurr", region: "Dibër", country: "Albania", lat: 41.5783, lon: 20.3594, population: 1000 },
  { id: "ostren", name: "Ostrën", nameAl: "Ostrën", region: "Dibër", country: "Albania", lat: 41.5017, lon: 20.5022, population: 1500 },

  // ═══════════════════════════════════════════════
  // KUKËS — FSHATRA & RRETHINAT
  // ═══════════════════════════════════════════════
  { id: "bicaj", name: "Bicaj", nameAl: "Bicaj", region: "Kukës", country: "Albania", lat: 42.0253, lon: 20.3147, population: 1500 },
  { id: "shishtavec", name: "Shishtavec", nameAl: "Shishtavec", region: "Kukës", country: "Albania", lat: 42.0386, lon: 20.5256, population: 2000 },
  { id: "pacram", name: "Paçram", nameAl: "Paçram", region: "Kukës", country: "Albania", lat: 42.2597, lon: 20.2689, population: 2000 },
  { id: "arras-kukes", name: "Arras Kukës", nameAl: "Arras", region: "Kukës", country: "Albania", lat: 42.0872, lon: 20.1628, population: 2000 },
  { id: "kolsh", name: "Kolsh", nameAl: "Kolsh", region: "Kukës", country: "Albania", lat: 42.1261, lon: 20.3889, population: 1000 },
  { id: "komjan", name: "Komjan", nameAl: "Komjan", region: "Kukës", country: "Albania", lat: 42.1789, lon: 20.3006, population: 1200 },
  { id: "shen-gjin-kukes", name: "Shën Gjin Kukës", nameAl: "Shën Gjin", region: "Kukës", country: "Albania", lat: 42.2847, lon: 20.1961, population: 1000 },
  { id: "bujan", name: "Bujan", nameAl: "Bujan", region: "Kukës", country: "Albania", lat: 42.3428, lon: 20.1342, population: 1500 },
  { id: "palcë", name: "Palcë", nameAl: "Palcë", region: "Kukës", country: "Albania", lat: 42.2183, lon: 20.1953, population: 800 },
  { id: "kalis", name: "Kalis", nameAl: "Kalis", region: "Kukës", country: "Albania", lat: 42.1528, lon: 20.2433, population: 600 },
  { id: "surroj-kukes", name: "Surroj Kukës", nameAl: "Surroj", region: "Kukës", country: "Albania", lat: 42.3742, lon: 20.0667, population: 700 },
  { id: "topojan", name: "Topojan", nameAl: "Topojan", region: "Kukës", country: "Albania", lat: 42.3383, lon: 20.0039, population: 600 },

  // ═══════════════════════════════════════════════
  // KOSOVË
  // ═══════════════════════════════════════════════
  { id: "pristina", name: "Prishtinë", nameAl: "Prishtinë", region: "Prishtinë", country: "Kosovo", lat: 42.6629, lon: 21.1655, population: 200000 },
  { id: "prizren", name: "Prizren", nameAl: "Prizren", region: "Prizren", country: "Kosovo", lat: 42.2139, lon: 20.7400, population: 85000 },
  { id: "peje", name: "Pejë", nameAl: "Pejë", region: "Pejë", country: "Kosovo", lat: 42.6598, lon: 20.2886, population: 75000 },
  { id: "ferizaj", name: "Ferizaj", nameAl: "Ferizaj", region: "Ferizaj", country: "Kosovo", lat: 42.3706, lon: 21.1556, population: 60000 },
  { id: "gjakove", name: "Gjakovë", nameAl: "Gjakovë", region: "Gjakovë", country: "Kosovo", lat: 42.3883, lon: 20.4289, population: 55000 },
  { id: "mitrovice", name: "Mitrovicë", nameAl: "Mitrovicë", region: "Mitrovicë", country: "Kosovo", lat: 42.8908, lon: 20.8658, population: 50000 },
  { id: "gjilan", name: "Gjilan", nameAl: "Gjilan", region: "Gjilan", country: "Kosovo", lat: 42.4628, lon: 21.4694, population: 45000 },
  { id: "podujeve", name: "Podujevo", nameAl: "Podujevo", region: "Prishtinë", country: "Kosovo", lat: 42.9097, lon: 21.1906, population: 30000 },
  { id: "suhareke", name: "Suharekë", nameAl: "Suharekë", region: "Prizren", country: "Kosovo", lat: 42.3597, lon: 20.8286, population: 25000 },
  { id: "vushtrri", name: "Vushtrri", nameAl: "Vushtrri", region: "Mitrovicë", country: "Kosovo", lat: 42.8258, lon: 20.9703, population: 22000 },
  { id: "lipjan", name: "Lipjan", nameAl: "Lipjan", region: "Prishtinë", country: "Kosovo", lat: 42.5219, lon: 21.1208, population: 20000 },
  { id: "kacanik", name: "Kaçanik", nameAl: "Kaçanik", region: "Ferizaj", country: "Kosovo", lat: 42.2319, lon: 21.2581, population: 18000 },
  { id: "rahovec", name: "Rahovec", nameAl: "Rahovec", region: "Gjakovë", country: "Kosovo", lat: 42.3978, lon: 20.6558, population: 15000 },
  { id: "malisheve", name: "Malishevë", nameAl: "Malishevë", region: "Gjakovë", country: "Kosovo", lat: 42.4831, lon: 20.7428, population: 18000 },
  { id: "drenas", name: "Drenas", nameAl: "Drenas", region: "Prishtinë", country: "Kosovo", lat: 42.6275, lon: 20.8933, population: 15000 },
  { id: "istog", name: "Istog", nameAl: "Istog", region: "Pejë", country: "Kosovo", lat: 42.7811, lon: 20.4833, population: 12000 },
  { id: "kline", name: "Klinë", nameAl: "Klinë", region: "Pejë", country: "Kosovo", lat: 42.6225, lon: 20.5769, population: 14000 },
  { id: "decan", name: "Deçan", nameAl: "Deçan", region: "Gjakovë", country: "Kosovo", lat: 42.5386, lon: 20.2892, population: 16000 },
  { id: "skenderaj", name: "Skenderaj", nameAl: "Skenderaj", region: "Mitrovicë", country: "Kosovo", lat: 42.7475, lon: 20.7889, population: 14000 },
  { id: "shtime", name: "Shtime", nameAl: "Shtime", region: "Ferizaj", country: "Kosovo", lat: 42.4328, lon: 21.0383, population: 10000 },
  { id: "shterpce", name: "Shtërpcë", nameAl: "Shtërpcë", region: "Ferizaj", country: "Kosovo", lat: 42.2397, lon: 21.0183, population: 8000 },
  { id: "vitia", name: "Vitia", nameAl: "Vitia", region: "Gjilan", country: "Kosovo", lat: 42.3219, lon: 21.3597, population: 12000 },
  { id: "kamenice", name: "Kamenicë", nameAl: "Kamenicë", region: "Gjilan", country: "Kosovo", lat: 42.5808, lon: 21.5808, population: 10000 },
  { id: "novo-brdo", name: "Novobërdë", nameAl: "Novobërdë", region: "Gjilan", country: "Kosovo", lat: 42.6028, lon: 21.4653, population: 8000 },
  { id: "leposaviq", name: "Leposaviq", nameAl: "Leposaviq", region: "Mitrovicë", country: "Kosovo", lat: 43.1008, lon: 20.8028, population: 7000 },
  { id: "zvecan", name: "Zveçan", nameAl: "Zveçan", region: "Mitrovicë", country: "Kosovo", lat: 42.9092, lon: 20.8378, population: 6000 },
  { id: "junik", name: "Junik", nameAl: "Junik", region: "Gjakovë", country: "Kosovo", lat: 42.4681, lon: 20.2817, population: 5000 },
  { id: "hani-i-elezit", name: "Hani i Elezit", nameAl: "Hani i Elezit", region: "Ferizaj", country: "Kosovo", lat: 42.1533, lon: 21.3006, population: 5000 },
  { id: "fushe-kosove", name: "Fushë Kosovë", nameAl: "Fushë Kosovë", region: "Prishtinë", country: "Kosovo", lat: 42.6328, lon: 21.0886, population: 25000 },
  { id: "obilic", name: "Obiliq", nameAl: "Obiliq", region: "Prishtinë", country: "Kosovo", lat: 42.6886, lon: 21.0697, population: 22000 },
  { id: "gracanice", name: "Graçanicë", nameAl: "Graçanicë", region: "Prishtinë", country: "Kosovo", lat: 42.5986, lon: 21.1928, population: 10000 },
  { id: "dragash", name: "Dragash", nameAl: "Dragash", region: "Prizren", country: "Kosovo", lat: 42.0628, lon: 20.6528, population: 8000 },
  { id: "mamusha", name: "Mamushë", nameAl: "Mamushë", region: "Prizren", country: "Kosovo", lat: 42.3228, lon: 20.7233, population: 5000 },
  { id: "ranillug", name: "Ranillug", nameAl: "Ranillug", region: "Gjilan", country: "Kosovo", lat: 42.5478, lon: 21.6078, population: 4000 },
  { id: "kllokot", name: "Kllokot", nameAl: "Kllokot", region: "Gjilan", country: "Kosovo", lat: 42.3728, lon: 21.3828, population: 3000 },
  { id: "partesh", name: "Partesh", nameAl: "Partesh", region: "Gjilan", country: "Kosovo", lat: 42.4228, lon: 21.4878, population: 3500 },
  { id: "zubin-potok", name: "Zubin Potok", nameAl: "Zubin Potok", region: "Mitrovicë", country: "Kosovo", lat: 42.9128, lon: 20.6878, population: 5000 },
  { id: "peja-fshat", name: "Pejë Fshat", nameAl: "Pejë Fshat", region: "Pejë", country: "Kosovo", lat: 42.6328, lon: 20.3228, population: 3000 },
  { id: "dobroshevci", name: "Dobroshevci", nameAl: "Dobroshevci", region: "Pejë", country: "Kosovo", lat: 42.6678, lon: 20.4528, population: 2000 },
  { id: "zallq", name: "Zallq", nameAl: "Zallq", region: "Mitrovicë", country: "Kosovo", lat: 42.7928, lon: 20.9033, population: 2500 },
  { id: "sllatinë", name: "Sllatinë", nameAl: "Sllatinë", region: "Prishtinë", country: "Kosovo", lat: 42.7628, lon: 21.1228, population: 3000 },
  { id: "hajvali", name: "Hajvali", nameAl: "Hajvali", region: "Prishtinë", country: "Kosovo", lat: 42.6128, lon: 21.2328, population: 6000 },
  { id: "matiqan", name: "Matiqan", nameAl: "Matiqan", region: "Prishtinë", country: "Kosovo", lat: 42.6978, lon: 21.1828, population: 8000 },
  { id: "koliq", name: "Koliq", nameAl: "Koliq", region: "Prishtinë", country: "Kosovo", lat: 42.6878, lon: 21.0428, population: 4000 },
  { id: "bardhosh", name: "Bardhosh", nameAl: "Bardhosh", region: "Prishtinë", country: "Kosovo", lat: 42.7028, lon: 21.0728, population: 3500 },
  { id: "pristina-qyteti", name: "Prishtinë Qytet", nameAl: "Prishtinë Qytet", region: "Prishtinë", country: "Kosovo", lat: 42.6629, lon: 21.1655, population: 200000 },
  { id: "besi-rahovec", name: "Besi", nameAl: "Besi", region: "Gjakovë", country: "Kosovo", lat: 42.4178, lon: 20.6078, population: 2000 },
  { id: "zhur-prizren", name: "Zhur", nameAl: "Zhur", region: "Prizren", country: "Kosovo", lat: 42.2278, lon: 20.7778, population: 3000 },
  { id: "landovice", name: "Landovicë", nameAl: "Landovicë", region: "Prizren", country: "Kosovo", lat: 42.2428, lon: 20.7278, population: 4000 },
  { id: "rahoveci-fshat", name: "Rahovec Fshat", nameAl: "Rahovec Fshat", region: "Gjakovë", country: "Kosovo", lat: 42.3828, lon: 20.6728, population: 2500 },

  // ═══════════════════════════════════════════════
  // MAQEDONIA E VERIUT
  // ═══════════════════════════════════════════════
  { id: "tetove", name: "Tetovë", nameAl: "Tetovë", region: "Tetovë", country: "Maqedonia e Veriut", lat: 42.0092, lon: 20.9716, population: 90000 },
  { id: "gostivar", name: "Gostivar", nameAl: "Gostivar", region: "Gostivar", country: "Maqedonia e Veriut", lat: 41.7958, lon: 20.9083, population: 70000 },
  { id: "struge", name: "Strugë", nameAl: "Strugë", region: "Strugë", country: "Maqedonia e Veriut", lat: 41.1783, lon: 20.6778, population: 35000 },
  { id: "ohrid", name: "Ohrid", nameAl: "Ohrid", region: "Ohrid", country: "Maqedonia e Veriut", lat: 41.1231, lon: 20.8019, population: 42000 },
  { id: "kercove", name: "Kërçovë", nameAl: "Kërçovë", region: "Kërçovë", country: "Maqedonia e Veriut", lat: 41.8656, lon: 20.9572, population: 28000 },
  { id: "debar-mk", name: "Dibër", nameAl: "Dibër", region: "Dibër", country: "Maqedonia e Veriut", lat: 41.5244, lon: 20.5272, population: 20000 },
  { id: "bogovinje", name: "Bogovinje", nameAl: "Bogovinje", region: "Tetovë", country: "Maqedonia e Veriut", lat: 41.9228, lon: 20.9172, population: 12000 },
  { id: "zelino", name: "Zhelinë", nameAl: "Zhelinë", region: "Tetovë", country: "Maqedonia e Veriut", lat: 41.9761, lon: 21.0525, population: 15000 },
  { id: "vrapciste", name: "Vrapcishte", nameAl: "Vrapcishte", region: "Gostivar", country: "Maqedonia e Veriut", lat: 41.8206, lon: 20.8456, population: 10000 },
  { id: "cair", name: "Çair", nameAl: "Çair", region: "Shkup", country: "Maqedonia e Veriut", lat: 41.9986, lon: 21.4381, population: 65000 },
  { id: "plasnice", name: "Plasnicë", nameAl: "Plasnicë", region: "Kërçovë", country: "Maqedonia e Veriut", lat: 41.7533, lon: 20.8733, population: 6000 },
  { id: "zajas", name: "Zajas", nameAl: "Zajas", region: "Kërçovë", country: "Maqedonia e Veriut", lat: 41.8128, lon: 20.8378, population: 5000 },
  { id: "tearce", name: "Tearce", nameAl: "Tearce", region: "Tetovë", country: "Maqedonia e Veriut", lat: 42.0778, lon: 20.9778, population: 8000 },
  { id: "zhelino-tetove", name: "Zhelino Tetovë", nameAl: "Zhelino", region: "Tetovë", country: "Maqedonia e Veriut", lat: 41.9433, lon: 21.0278, population: 4000 },
  { id: "jegunovce", name: "Jegunovcë", nameAl: "Jegunovcë", region: "Tetovë", country: "Maqedonia e Veriut", lat: 42.0578, lon: 20.8378, population: 5000 },
  { id: "mavrovo", name: "Mavrovo", nameAl: "Mavrovo", region: "Gostivar", country: "Maqedonia e Veriut", lat: 41.6647, lon: 20.7211, population: 3000 },
  { id: "rostushe", name: "Rostushë", nameAl: "Rostushë", region: "Gostivar", country: "Maqedonia e Veriut", lat: 41.6594, lon: 20.6972, population: 2000 },
  { id: "centar-zupa", name: "Qendër Zhupë", nameAl: "Qendër Zhupë", region: "Gostivar", country: "Maqedonia e Veriut", lat: 41.6028, lon: 20.7928, population: 4000 },

  // ═══════════════════════════════════════════════
  // BREGDETI SHQIPTAR — DESTINACIONE TURISTIKE (SEO i lartë)
  // ═══════════════════════════════════════════════
  { id: "riviera-shqiptare", name: "Riviera Shqiptare", nameAl: "Riviera Shqiptare", region: "Vlorë", country: "Albania", lat: 40.1800, lon: 19.7200, population: 5000 },
  { id: "gjipe", name: "Gjipë", nameAl: "Gjipë", region: "Vlorë", country: "Albania", lat: 40.1950, lon: 19.6650, population: 200 },
  { id: "lukova-fshat", name: "Lukovë Fshat", nameAl: "Lukovë Fshat", region: "Vlorë", country: "Albania", lat: 39.9800, lon: 19.9300, population: 800 },
  { id: "qeparo", name: "Qeparo", nameAl: "Qeparo", region: "Vlorë", country: "Albania", lat: 40.0600, lon: 19.8350, population: 600 },
  { id: "himara-fshat", name: "Himarë Fshat", nameAl: "Himarë Fshat", region: "Vlorë", country: "Albania", lat: 40.1003, lon: 19.7431, population: 4000 },
  { id: "palokaster", name: "Palokastër", nameAl: "Palokastër", region: "Vlorë", country: "Albania", lat: 40.0750, lon: 19.8050, population: 400 },
  { id: "nivice-bubar", name: "Nivicë-Bubar", nameAl: "Nivicë-Bubar", region: "Vlorë", country: "Albania", lat: 40.0400, lon: 19.8700, population: 350 },
  { id: "spile-vlore", name: "Spile Vlorë", nameAl: "Spile", region: "Vlorë", country: "Albania", lat: 40.3600, lon: 19.5300, population: 1000 },
  { id: "dukat", name: "Dukat", nameAl: "Dukat", region: "Vlorë", country: "Albania", lat: 40.2800, lon: 19.5600, population: 800 },
  { id: "porto-palermo", name: "Porto Palermo", nameAl: "Porto Palermo", region: "Vlorë", country: "Albania", lat: 40.0489, lon: 19.8178, population: 300 },

  // ═══════════════════════════════════════════════
  // ZONAT MALORE & NATYRORE — SEO turistik i lartë
  // ═══════════════════════════════════════════════
  { id: "dajti", name: "Dajti", nameAl: "Dajti", region: "Tiranë", country: "Albania", lat: 41.3806, lon: 19.9703, population: 500 },
  { id: "mali-dajtit", name: "Mali i Dajtit", nameAl: "Mali i Dajtit", region: "Tiranë", country: "Albania", lat: 41.3800, lon: 19.9700, population: 200 },
  { id: "lura", name: "Lurë", nameAl: "Lurë", region: "Dibër", country: "Albania", lat: 41.7800, lon: 20.2300, population: 1000 },
  { id: "lura-liqeni", name: "Liqenet e Lurës", nameAl: "Liqenet e Lurës", region: "Dibër", country: "Albania", lat: 41.7900, lon: 20.2150, population: 200 },
  { id: "valbona-lumi", name: "Lugina e Valbonës", nameAl: "Lugina e Valbonës", region: "Shkodër", country: "Albania", lat: 42.4100, lon: 19.8900, population: 300 },
  { id: "theth-burim", name: "Theth Burim", nameAl: "Theth Burim", region: "Shkodër", country: "Albania", lat: 42.3900, lon: 19.7900, population: 250 },
  { id: "qafe-thore", name: "Qafa e Thorës", nameAl: "Qafa e Thorës", region: "Kukës", country: "Albania", lat: 42.1500, lon: 20.5800, population: 200 },
  { id: "perroi-ftohte", name: "Përroit të Ftohtë", nameAl: "Përroit të Ftohtë", region: "Vlorë", country: "Albania", lat: 40.4900, lon: 19.4950, population: 1200 },
  { id: "syri-kalter", name: "Syri i Kaltër", nameAl: "Syri i Kaltër", region: "Vlorë", country: "Albania", lat: 39.8858, lon: 20.1600, population: 100 },
  { id: "bogove", name: "Bogovë", nameAl: "Bogovë", region: "Berat", country: "Albania", lat: 40.5500, lon: 20.2200, population: 600 },
  { id: "guri-bardhe", name: "Guri i Bardhë", nameAl: "Guri i Bardhë", region: "Lezhë", country: "Albania", lat: 41.9500, lon: 19.8800, population: 400 },

  // ═══════════════════════════════════════════════
  // QYTETE & FSHATRA TË RËNDËSISHME — SHQIPËRI (mungonin)
  // ═══════════════════════════════════════════════
  { id: "rrogozhine", name: "Rrogozhinë", nameAl: "Rrogozhinë", region: "Tiranë", country: "Albania", lat: 41.0758, lon: 19.6656, population: 15000 },
  { id: "lungocek", name: "Lungocek", nameAl: "Lungocek", region: "Elbasan", country: "Albania", lat: 41.1472, lon: 20.0633, population: 3000 },
  { id: "papër", name: "Papër", nameAl: "Papër", region: "Elbasan", country: "Albania", lat: 41.0583, lon: 19.8783, population: 4000 },
  { id: "godolesh", name: "Godolesh", nameAl: "Godolesh", region: "Elbasan", country: "Albania", lat: 41.0042, lon: 19.9267, population: 2500 },
  { id: "mollas-elbasan", name: "Mollas Elbasan", nameAl: "Mollas", region: "Elbasan", country: "Albania", lat: 41.0122, lon: 20.2822, population: 2000 },
  { id: "sheqeras", name: "Sheqeras", nameAl: "Sheqeras", region: "Berat", country: "Albania", lat: 40.8358, lon: 19.9494, population: 2500 },
  { id: "sinjë-lushnje", name: "Sinjë Lushnjë", nameAl: "Sinjë", region: "Fier", country: "Albania", lat: 40.9683, lon: 19.7583, population: 2000 },
  { id: "dushk", name: "Dushk", nameAl: "Dushk", region: "Fier", country: "Albania", lat: 40.8842, lon: 19.7256, population: 3000 },
  { id: "strumë", name: "Strumë", nameAl: "Strumë", region: "Fier", country: "Albania", lat: 40.7400, lon: 19.7900, population: 1800 },
  { id: "zharrez", name: "Zharrez", nameAl: "Zharrez", region: "Fier", country: "Albania", lat: 40.6550, lon: 19.8100, population: 1200 },
  { id: "mesaplik", name: "Mesaplik", nameAl: "Mesaplik", region: "Vlorë", country: "Albania", lat: 40.5250, lon: 19.6400, population: 2500 },
  { id: "brataj", name: "Brataj", nameAl: "Brataj", region: "Vlorë", country: "Albania", lat: 40.3900, lon: 19.6200, population: 1500 },
  { id: "narte", name: "Nartë", nameAl: "Nartë", region: "Vlorë", country: "Albania", lat: 40.5500, lon: 19.4700, population: 1200 },
  { id: "seman-fier2", name: "Seman Plazh", nameAl: "Seman Plazh", region: "Fier", country: "Albania", lat: 40.7600, lon: 19.4300, population: 1000 },
  { id: "potom", name: "Potom", nameAl: "Potom", region: "Berat", country: "Albania", lat: 40.4700, lon: 20.2600, population: 1200 },
  { id: "qeshibesh", name: "Qeshibesh", nameAl: "Qeshibesh", region: "Berat", country: "Albania", lat: 40.8000, lon: 19.9900, population: 1500 },
  { id: "ura-vajgurore2", name: "Ura Vajgurore Fshat", nameAl: "Ura Vajgurore Fshat", region: "Berat", country: "Albania", lat: 40.7700, lon: 19.9000, population: 2500 },
  { id: "mbreshtan", name: "Mbreshtan", nameAl: "Mbreshtan", region: "Berat", country: "Albania", lat: 40.6800, lon: 19.9500, population: 1200 },
  { id: "gjepalë", name: "Gjepale", nameAl: "Gjepale", region: "Fier", country: "Albania", lat: 40.8800, lon: 19.5900, population: 1500 },

  // ═══════════════════════════════════════════════
  // KOSOVË — LOKACIONE SHTESË (SEO)
  // ═══════════════════════════════════════════════
  { id: "rugove", name: "Rugova", nameAl: "Lugina e Rugovës", region: "Pejë", country: "Kosovo", lat: 42.7200, lon: 20.1800, population: 5000 },
  { id: "brezovice", name: "Brezovicë", nameAl: "Brezovicë", region: "Ferizaj", country: "Kosovo", lat: 42.1600, lon: 21.0300, population: 3000 },
  { id: "malet-sharrit", name: "Malet e Sharrit", nameAl: "Malet e Sharrit", region: "Prizren", country: "Kosovo", lat: 42.1000, lon: 20.8200, population: 2000 },
  { id: "mirusha", name: "Mirusha", nameAl: "Ujëvaret e Mirushës", region: "Gjakovë", country: "Kosovo", lat: 42.5800, lon: 20.6300, population: 1500 },
  { id: "gadime", name: "Gadime", nameAl: "Gadime", region: "Ferizaj", country: "Kosovo", lat: 42.4600, lon: 21.1400, population: 4000 },
  { id: "llojan", name: "Llojan", nameAl: "Llojan", region: "Mitrovicë", country: "Kosovo", lat: 42.8600, lon: 20.9100, population: 2500 },
  { id: "brestovik", name: "Brestovik", nameAl: "Brestovik", region: "Gjilan", country: "Kosovo", lat: 42.5000, lon: 21.4600, population: 1800 },
  { id: "sollё", name: "Sollë", nameAl: "Sollë", region: "Prizren", country: "Kosovo", lat: 42.1900, lon: 20.7600, population: 2000 },
  { id: "gllogjan", name: "Gllogjan", nameAl: "Gllogjan", region: "Pejë", country: "Kosovo", lat: 42.5600, lon: 20.3100, population: 2000 },
  { id: "ponoshec", name: "Ponoshec", nameAl: "Ponoshec", region: "Gjakovë", country: "Kosovo", lat: 42.3200, lon: 20.2900, population: 1500 },
  { id: "bellacerke", name: "Bella Cerke", nameAl: "Bella Cerke", region: "Gjilan", country: "Kosovo", lat: 42.4100, lon: 21.5100, population: 1200 },
  { id: "streoce", name: "Streoc", nameAl: "Streoc", region: "Pejë", country: "Kosovo", lat: 42.6200, lon: 20.2400, population: 2500 },
  { id: "qyteza-peje", name: "Qyteza Pejë", nameAl: "Qyteza Pejë", region: "Pejë", country: "Kosovo", lat: 42.6700, lon: 20.2700, population: 8000 },
  { id: "rahovec-novo", name: "Novobërdë Rahovec", nameAl: "Novobërdë", region: "Gjakovë", country: "Kosovo", lat: 42.3700, lon: 20.6200, population: 2000 },

  // ═══════════════════════════════════════════════
  // MAQEDONIA E VERIUT — LOKACIONE SHTESË (SEO)
  // ═══════════════════════════════════════════════
  { id: "shkup", name: "Shkup", nameAl: "Shkup", region: "Shkup", country: "Maqedonia e Veriut", lat: 41.9965, lon: 21.4314, population: 600000 },
  { id: "tetove-fshat", name: "Tetovë Fshat", nameAl: "Tetovë Fshat", region: "Tetovë", country: "Maqedonia e Veriut", lat: 42.0050, lon: 20.9550, population: 5000 },
  { id: "popova-sapka", name: "Popova Shapka", nameAl: "Popova Shapka", region: "Tetovë", country: "Maqedonia e Veriut", lat: 42.0800, lon: 20.9000, population: 500 },
  { id: "recane", name: "Reçanë", nameAl: "Reçanë", region: "Tetovë", country: "Maqedonia e Veriut", lat: 42.0200, lon: 20.9900, population: 3500 },
  { id: "zhelino-mk", name: "Zhelinë", nameAl: "Zhelinë", region: "Tetovë", country: "Maqedonia e Veriut", lat: 41.9800, lon: 21.0700, population: 5000 },
  { id: "brace", name: "Bracë", nameAl: "Bracë", region: "Gostivar", country: "Maqedonia e Veriut", lat: 41.8400, lon: 20.8900, population: 3000 },
  { id: "negotinë", name: "Negotinë A Pollog", nameAl: "Negotinë", region: "Tetovë", country: "Maqedonia e Veriut", lat: 41.8542, lon: 21.0194, population: 4000 },
  { id: "ohrid-lagjja", name: "Lagja Shqiptare Ohrid", nameAl: "Lagja Shqiptare Ohrid", region: "Ohrid", country: "Maqedonia e Veriut", lat: 41.1100, lon: 20.7900, population: 8000 },
  { id: "struga-lagje", name: "Strugë Lagje", nameAl: "Strugë Lagje", region: "Strugë", country: "Maqedonia e Veriut", lat: 41.1750, lon: 20.6900, population: 10000 },
  { id: "lin-mk", name: "Lin", nameAl: "Lin", region: "Strugë", country: "Maqedonia e Veriut", lat: 41.0900, lon: 20.6100, population: 1500 },
  { id: "radolishte", name: "Radolishte", nameAl: "Radolishte", region: "Strugë", country: "Maqedonia e Veriut", lat: 41.1400, lon: 20.6200, population: 2000 },
  { id: "oktis", name: "Oktis", nameAl: "Oktis", region: "Strugë", country: "Maqedonia e Veriut", lat: 41.1300, lon: 20.6500, population: 1200 },
];

export const POPULAR_CITIES = ALBANIAN_CITIES.filter(c => (c.population ?? 0) >= 15000).slice(0, 8);

/**
 * Statike fallback — përdoret kur SDK nuk ka kthyer ende të dhëna.
 * Për 10,000+ lokacione: shto të dhënat direkt në bazën e të dhënave (Location entity)
 * dhe përdor useQuery('Location') / useLazyQuery('Location') nga SDK.
 *
 * Shembull query për kërkim:
 *   const { query } = useLazyQuery('Location');
 *   const results = await query({ where: { name: { contains: searchTerm } }, limit: 10 });
 *
 * Shembull popular cities:
 *   const { data } = useQuery('Location', { where: { isPopular: true }, orderBy: { population: 'desc' }, limit: 8 });
 */
export function searchCities(query: string): SearchResult[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ALBANIAN_CITIES.filter((c) => {
    const n = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nAl = c.nameAl.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const r = c.region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return n.includes(q) || nAl.includes(q) || r.includes(q);
  }).slice(0, 10);
}

export function getCityById(id: string): SearchResult | undefined {
  return ALBANIAN_CITIES.find((c) => c.id === id);
}

// ─── SDK-based hooks ───────────────────────────────────────────────────────────
// Këto hooks i lexojnë lokacionet nga databaza përmes SDK.
// Kur keni 10,000+ lokacione, shtoni ato në Location entity dhe
// këto hooks do punojnë automatikisht pa ndryshuar kodin.

import { useLazyQuery, useQuery } from "./anima";
import type { Location } from "./anima";

/**
 * Kërkon lokacione nga databaza — supports 10,000+ records.
 * Fallback në listën statike nëse databaza është bosh.
 */
export function useSearchLocations() {
  const { query, isPending } = useLazyQuery("Location") as any;

  const search = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm || searchTerm.length < 1) return [];
    try {
      const dbResults: Location[] = await query({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { nameAl: { contains: searchTerm } },
            { region: { contains: searchTerm } },
          ],
        },
        limit: 10,
      });
      if (dbResults && dbResults.length > 0) {
        return dbResults.map((loc: Location) => ({
          id: loc.id,
          name: loc.name,
          nameAl: loc.nameAl,
          region: loc.region,
          country: loc.country,
          lat: loc.lat,
          lon: loc.lon,
          population: loc.population,
        }));
      }
    } catch {
      // silent fallback
    }
    // Fallback: kërkim statik
    return searchCities(searchTerm);
  };

  return { search, isPending };
}

/**
 * Merr qytetet popullarë nga databaza.
 * Fallback në POPULAR_CITIES nëse databaza është bosh.
 */
export function usePopularCities() {
  const { data, isPending, error } = useQuery("Location", {
    where: { isPopular: true },
    orderBy: { population: "desc" },
    limit: 8,
  } as any);

  const cities: SearchResult[] =
    data && (data as Location[]).length > 0
      ? (data as Location[]).map((loc: Location) => ({
          id: loc.id,
          name: loc.name,
          nameAl: loc.nameAl,
          region: loc.region,
          country: loc.country,
          lat: loc.lat,
          lon: loc.lon,
          population: loc.population,
        }))
      : POPULAR_CITIES;

  return { cities, isPending, error };
}

/**
 * Merr të gjitha lokacionet me paginim — i domosdoshëm për 10k+ rekorde.
 * Shembull: useAllLocations({ country: "Albania", page: 0, pageSize: 50 })
 */
export function useAllLocations(opts?: { country?: string; page?: number; pageSize?: number }) {
  const pageSize = opts?.pageSize ?? 50;
  const page = opts?.page ?? 0;

  const filters: any = {
    orderBy: { population: "desc" },
    limit: pageSize,
    offset: page * pageSize,
  };
  if (opts?.country) {
    filters.where = { country: { eq: opts.country } };
  }

  const { data, isPending, error } = useQuery("Location", filters);

  const locations: SearchResult[] =
    data && (data as Location[]).length > 0
      ? (data as Location[]).map((loc: Location) => ({
          id: loc.id,
          name: loc.name,
          nameAl: loc.nameAl,
          region: loc.region,
          country: loc.country,
          lat: loc.lat,
          lon: loc.lon,
          population: loc.population,
        }))
      : (opts?.country
          ? ALBANIAN_CITIES.filter(c => c.country === opts.country)
          : ALBANIAN_CITIES
        ).slice(page * pageSize, (page + 1) * pageSize);

  return { locations, isPending, error };
}

/**
 * Merr numrin total të lokacioneve — i dobishëm për paginim.
 */
export function useLocationCount(country?: string) {
  const filters: any = country ? { where: { country: { eq: country } } } : {};
  const { data } = useQuery("Location", filters);
  const dbCount = (data as Location[] | undefined)?.length ?? 0;
  // Fallback me numrin statik nëse databaza bosh
  const staticCount = country
    ? ALBANIAN_CITIES.filter(c => c.country === country).length
    : ALBANIAN_CITIES.length;
  return dbCount > 0 ? dbCount : staticCount;
}
