import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ── Load .env ────────────────────────────────────── */
const envPath = resolve(__dirname, "..", ".env");
const envContent = readFileSync(envPath, "utf8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1).replace(/^"|"$/g, "");
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/* ── i18n names/notes ─────────────────────────────── */
const I18N: Record<string, Record<string, string>> = {
  chilli: {
    en: "Chilli",
    hi: "मिर्च",
    te: "మిరపకాయ",
    gu: "મરચાં",
    mr: "मिरची",
    ta: "மிளகாய்",
    kn: "ಮೆಣಸಿನಕಾಯಿ",
  },
  paddy: {
    en: "Paddy",
    hi: "धान का खेत",
    te: "వరి",
    gu: "ડાંગર",
    mr: "भात",
    ta: "நெல்",
    kn: "ಭತ್ತ",
  },
  cotton: {
    en: "Cotton",
    hi: "कपास",
    te: "పత్తి",
    gu: "કપાસ",
    mr: "कापूस",
    ta: "பருத்தி",
    kn: "ಹತ್ತಿ",
  },
  mango: {
    en: "Mango",
    hi: "आम",
    te: "మామిడి",
    gu: "કેરી",
    mr: "आंबा",
    ta: "மாம்பழம்",
    kn: "ಮಾವು",
  },
  tomato: {
    en: "Tomato",
    hi: "टमाटर",
    te: "టొమాటో",
    gu: "ટામેટા",
    mr: "टोमॅटो",
    ta: "தக்காளி",
    kn: "ಟೊಮೆಟೊ",
  },
  citrus: {
    en: "Citrus",
    hi: "साइट्रस",
    te: "సిట్రస్",
    gu: "સાઇટ્રસ",
    mr: "मोसंबी",
    ta: "சிட்ரஸ்",
    kn: "ಸಿಟ್ರಸ್",
  },
  watermelon: {
    en: "Watermelon",
    hi: "तरबूज",
    te: "పుచ్చకాయ",
    gu: "તરબૂચ",
    mr: "टरबूज",
    ta: "தர்பூசணி",
    kn: "ಕಲ್ಲಂಗಡಿ",
  },
  cashew: {
    en: "Cashew",
    hi: "कश्यु",
    te: "జీడిపప్పు",
    gu: "કાજુ",
    mr: "काजू",
    ta: "முந்திரி",
    kn: "ಗೋಡಂಬಿ",
  },
};

const NOTE_I18N: Record<string, Record<string, string>> = {
  chilli: {
    en: "Colour, fruit setting, pungency",
    hi: "रंग, फल सेटिंग, तीखापन",
    te: "రంగు, పండు అమరిక, తీక్షణత",
    gu: "રંગ, ફળ સેટિંગ, તીક્ષ્ણતા",
    mr: "रंग, फळ सेटिंग, तिखटपणा",
    ta: "நிறம், பழ அமைப்பு, காரத்தன்மை",
    kn: "ಬಣ್ಣ, ಹಣ್ಣಿನ ಸೆಟ್ಟಿಂಗ್, ತೀಕ್ಷ್ಣತೆ",
  },
  paddy: {
    en: "Tillering, grain filling, yield",
    hi: "कल्ले फूटना, दाना भरना, उपज",
    te: "టిల్లరింగ్, ధాన్యం నింపడం, దిగుబడి",
    gu: "ખેડાણ, અનાજ ભરવા, ઉપજ",
    mr: "मशागत, धान्य भरणे, उत्पन्न",
    ta: "உழவு, தானிய நிரப்புதல், மகசூல்",
    kn: "ಉಳುಮೆ, ಧಾನ್ಯ ತುಂಬುವುದು, ಇಳುವರಿ",
  },
  cotton: {
    en: "Boll weight, lint quality",
    hi: "बीजकोष का वजन, लिंट गुणवत्ता",
    te: "బోల్ బరువు, మెత్తటి నాణ్యత",
    gu: "બોલ વજન, લિન્ટ ગુણવત્તા",
    mr: "बोल वजन, लिंट गुणवत्ता",
    ta: "பந்து எடை, பஞ்சு தரம்",
    kn: "ಬೊಲ್ ತೂಕ, ಲಿಂಟ್ ಗುಣಮಟ್ಟ",
  },
  mango: {
    en: "Flowering, fruit retention",
    hi: "फूल आना, फल प्रतिधारण",
    te: "పుష్పించే, పండు ధారణ",
    gu: "ફ્લાવરિંગ, ફળ રીટેન્શન",
    mr: "फ्लॉवरिंग, फळ धारणा",
    ta: "பூக்கும், பழம் தக்கவைத்தல்",
    kn: "ಹೂಬಿಡುವಿಕೆ, ಹಣ್ಣು ಧಾರಣ",
  },
  tomato: {
    en: "Fruit setting, shelf life",
    hi: "फल सेटिंग, शेल्फ जीवन",
    te: "పండ్ల అమరిక, షెల్ఫ్ జీవితం",
    gu: "ફળ સેટિંગ, શેલ્ફ જીવન",
    mr: "फळ सेटिंग, शेल्फ लाइफ",
    ta: "பழ அமைப்பு, அடுக்கு வாழ்க்கை",
    kn: "ಹಣ್ಣಿನ ಸೆಟ್ಟಿಂಗ್, ಶೆಲ್ಫ್ ಜೀವನ",
  },
  citrus: {
    en: "Brix, juice quality",
    hi: "ब्रिक्स, जूस की गुणवत्ता",
    te: "బ్రిక్స్, రసం నాణ్యత",
    gu: "બ્રિક્સ, રસ ગુણવત્તા",
    mr: "ब्रिक्स, रस गुणवत्ता",
    ta: "பிரிக்ஸ், சாறு தரம்",
    kn: "ಬ್ರಿಕ್ಸ್, ಜ್ಯೂಸ್ ಗುಣಮಟ್ಟ",
  },
  watermelon: {
    en: "Sweetness, weight uniformity",
    hi: "मिठास, वजन एकरूपता",
    te: "తీపి, బరువు ఏకరూపత",
    gu: "મીઠાશ, વજન એકરૂપતા",
    mr: "गोडपणा, वजन एकसारखेपणा",
    ta: "இனிப்பு, எடை சீரான தன்மை",
    kn: "ಮಾಧುರ್ಯ, ತೂಕದ ಏಕರೂಪತೆ",
  },
  cashew: {
    en: "Nut size, kernel weight",
    hi: "अखरोट का आकार, गिरी का वजन",
    te: "గింజ పరిమాణం, కెర్నల్ బరువు",
    gu: "અખરોટનું કદ, કર્નલનું વજન",
    mr: "नट आकार, कर्नल वजन",
    ta: "கொட்டை அளவு, கர்னல் எடை",
    kn: "ಕಾಯಿ ಗಾತ್ರ, ಕರ್ನಲ್ ತೂಕ",
  },
};

/* ── Crops data ────────────────────────────────────── */
const CROPS = [
  { slug: "chilli", sort_order: 1 },
  { slug: "paddy", sort_order: 2 },
  { slug: "cotton", sort_order: 3 },
  { slug: "mango", sort_order: 4 },
  { slug: "tomato", sort_order: 5 },
  { slug: "citrus", sort_order: 6 },
  { slug: "watermelon", sort_order: 7 },
  { slug: "cashew", sort_order: 8 },
];

/* ── Deficiency templates (one per crop) ──────────── */
function buildDeficiencies(cropName: string): Array<{
  name: string;
  symptoms: string;
  affect: string;
  product: string;
  soil_drip: string;
  benefit: string;
  nutrient_symbol: string;
  sort_order: number;
}> {
  return [
    {
      name: "Magnesium Deficiency",
      symptoms: `Interveinal chlorosis (yellowing between veins) starting on the older leaves of ${cropName}. Leaf margins may remain green or turn purplish-red in certain varieties.`,
      affect: `Severely reduces chlorophyll content and photosynthetic activity, leading to premature leaf drop, stunted root growth, and poor seed/grain development.`,
      product: "SMag (Foliar spray: 3-5 g/L of water)",
      soil_drip: "Magnesium Sulphate (Soil/Drip: 10-15 kg/acre during early vegetative stage)",
      benefit: "Restores deep green leaf color, boosts photosynthetic efficiency, and enhances nutrient absorption for robust early growth.",
      nutrient_symbol: "Mg",
      sort_order: 1,
    },
    {
      name: "Sulphur Deficiency",
      symptoms: `Younger leaves of ${cropName} turn pale yellow or light green first, while older leaves remain green. Plant height is stunted, and stem growth is thin.`,
      affect: `Inhibits protein synthesis and chlorophyll formation. Results in reduced tillering in paddy, fewer flowers, and lower oil/protein quality.`,
      product: "Signova Sulphur (Foliar spray: 2-3 g/L of water)",
      soil_drip: "Sulphur WG 90% (Soil application: 3-5 kg/acre at sowing or transplanting)",
      benefit: "Enhances nitrogen use efficiency, promotes amino acid synthesis, and significantly increases crop yield and quality.",
      nutrient_symbol: "S",
      sort_order: 2,
    },
    {
      name: "Zinc Deficiency",
      symptoms: `Dusty brown spots or bronzing on leaves, shortened internodes (rosetting), and stunted crop growth. Leaves become narrow, small, and brittle.`,
      affect: `Disrupts auxin (growth hormone) production, starch metabolism, and internode elongation. Can cause crop maturity to be delayed by up to two weeks.`,
      product: "Chilachel Zinc 12% (EDTA) (Foliar spray: 0.5-1 g/L of water)",
      soil_drip: "Zinkox (Nano Zinc) (Soil/Drip: 1-2 L/acre during early growth stages)",
      benefit: "Corrects stunting, improves tillering/branching, promotes uniform flowering, and ensures early maturity.",
      nutrient_symbol: "Zn",
      sort_order: 3,
    },
    {
      name: "Boron Deficiency",
      symptoms: `Death of growing tips, young leaves showing white/rolled tips, and distorted flower buds. Poor root development and hollow stems may occur.`,
      affect: `Impairs cell division, sugar translocation, and pollen tube growth. Leads to high flower drop, fruit cracking, deformed fruit shape, and high spikelet sterility.`,
      product: "Signova Boron 20% (Foliar spray: 1-1.5 g/L of water at pre-flowering)",
      soil_drip: "Nutrisol-B (Soil/Drip: 2-3 kg/acre during soil preparation or early stages)",
      benefit: "Improves pollen viability, enhances fruit/seed setting, prevents fruit/stem cracking, and improves sugar translocation.",
      nutrient_symbol: "B",
      sort_order: 4,
    },
  ];
}

/* ── Seed ──────────────────────────────────────────── */
async function seed() {
  console.log("🌱 Starting crops seed...\n");

  for (const cropDef of CROPS) {
    const { slug } = cropDef;
    const i18nName = I18N[slug];
    const i18nNote = NOTE_I18N[slug];

    if (!i18nName || !i18nNote) {
      console.warn(`⚠️  Skipping ${slug}: missing i18n data`);
      continue;
    }

    /* Upsert crop */
    const cropPayload = {
      slug,
      name: i18nName,
      note: i18nNote,
      image_url: null,
    };

    const { data: cropData, error: cropError } = await supabase
      .from("crops")
      .upsert(cropPayload, { onConflict: "slug" })
      .select("id")
      .single();

    if (cropError) {
      console.error(`❌ Failed to upsert crop "${slug}":`, cropError.message);
      continue;
    }

    const cropId = cropData.id;
    console.log(`✅ Crop "${slug}" upserted (id: ${cropId})`);

    /* Build and upsert deficiencies */
    const cropName = i18nName.en || slug;
    const deficiencies = buildDeficiencies(cropName).map((d) => ({
      crop_id: cropId,
      name: d.name,
      symptoms: d.symptoms,
      affect: d.affect,
      product: d.product,
      soil_drip: d.soil_drip,
      benefit: d.benefit,
      nutrient_symbol: d.nutrient_symbol,
      sort_order: d.sort_order,
    }));

    /* Delete old deficiencies for this crop, then insert fresh */
    const { error: delError } = await supabase
      .from("crop_deficiencies")
      .delete()
      .eq("crop_id", cropId);

    if (delError) {
      console.error(`❌ Failed to clear deficiencies for "${slug}":`, delError.message);
      continue;
    }

    const { error: defError } = await supabase
      .from("crop_deficiencies")
      .insert(deficiencies);

    if (defError) {
      console.error(`❌ Failed to insert deficiencies for "${slug}":`, defError.message);
    } else {
      console.log(`   ${deficiencies.length} deficiencies seeded for "${slug}"`);
    }
  }

  console.log("\n✨ Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
