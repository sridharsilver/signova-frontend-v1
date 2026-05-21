import chilliImg from "@/assets/images/crops/chilli.png";
import paddyImg from "@/assets/images/crops/paddy.png";
import cottonImg from "@/assets/images/crops/cotton.png";
import mangoImg from "@/assets/images/crops/mango.png";
import tomatoImg from "@/assets/images/crops/tomato.png";
import citrusImg from "@/assets/images/crops/citrus.png";
import watermelonImg from "@/assets/images/crops/watermelon.png";
import cashewImg from "@/assets/images/crops/cashew.png";

export interface Crop {
  slug: string;
  name: string;
  note: string;
  img: string;
}

export interface Deficiency {
  name: string;
  img: string;
  symptoms: string;
  affect: string;
  product: string;
  soilDrip: string;
  benefit: string;
}

export const CROPS: Crop[] = [
  { slug: "chilli", name: "Chilli", note: "Colour, fruit setting, pungency", img: chilliImg },
  { slug: "paddy", name: "Paddy", note: "Tillering, grain filling, yield", img: paddyImg },
  { slug: "cotton", name: "Cotton", note: "Boll weight, lint quality", img: cottonImg },
  { slug: "mango", name: "Mango", note: "Flowering, fruit retention", img: mangoImg },
  { slug: "tomato", name: "Tomato", note: "Fruit setting, shelf life", img: tomatoImg },
  { slug: "citrus", name: "Citrus", note: "Brix, juice quality", img: citrusImg },
  { slug: "watermelon", name: "Watermelon", note: "Sweetness, weight uniformity", img: watermelonImg },
  { slug: "cashew", name: "Cashew", note: "Nut size, kernel weight", img: cashewImg },
];

export function getCropBySlug(slug: string): Crop | undefined {
  return CROPS.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getDeficienciesForCrop(slug: string): Deficiency[] {
  const crop = getCropBySlug(slug);
  const cropName = crop ? crop.name : "Crop";
  const cropImg = crop ? crop.img : paddyImg;

  // Customized descriptions per crop for maximum relevance and quality
  return [
    {
      name: "Magnesium Deficiency",
      img: cropImg,
      symptoms: `Interveinal chlorosis (yellowing between veins) starting on the older leaves of ${cropName}. Leaf margins may remain green or turn purplish-red in certain varieties.`,
      affect: `Severely reduces chlorophyll content and photosynthetic activity, leading to premature leaf drop, stunted root growth, and poor seed/grain development.`,
      product: "SMag (Foliar spray: 3-5 g/L of water)",
      soilDrip: "Magnesium Sulphate (Soil/Drip: 10-15 kg/acre during early vegetative stage)",
      benefit: "Restores deep green leaf color, boosts photosynthetic efficiency, and enhances nutrient absorption for robust early growth.",
    },
    {
      name: "Sulphur Deficiency",
      img: cropImg,
      symptoms: `Younger leaves of ${cropName} turn pale yellow or light green first, while older leaves remain green. Plant height is stunted, and stem growth is thin.`,
      affect: `Inhibits protein synthesis and chlorophyll formation. Results in reduced tillering in paddy, fewer flowers, and lower oil/protein quality.`,
      product: "Signova Sulphur (Foliar spray: 2-3 g/L of water)",
      soilDrip: "Sulphur WG 90% (Soil application: 3-5 kg/acre at sowing or transplanting)",
      benefit: "Enhances nitrogen use efficiency, promotes amino acid synthesis, and significantly increases crop yield and quality.",
    },
    {
      name: "Zinc Deficiency",
      img: cropImg,
      symptoms: `Dusty brown spots or bronzing on leaves, shortened internodes (rosetting), and stunted crop growth. Leaves become narrow, small, and brittle.`,
      affect: `Disrupts auxin (growth hormone) production, starch metabolism, and internode elongation. Can cause crop maturity to be delayed by up to two weeks.`,
      product: "Chilachel Zinc 12% (EDTA) (Foliar spray: 0.5-1 g/L of water)",
      soilDrip: "Zinkox (Nano Zinc) (Soil/Drip: 1-2 L/acre during early growth stages)",
      benefit: "Corrects stunting, improves tillering/branching, promotes uniform flowering, and ensures early maturity.",
    },
    {
      name: "Boron Deficiency",
      img: cropImg,
      symptoms: `Death of growing tips, young leaves showing white/rolled tips, and distorted flower buds. Poor root development and hollow stems may occur.`,
      affect: `Impairs cell division, sugar translocation, and pollen tube growth. Leads to high flower drop, fruit cracking, deformed fruit shape, and high spikelet sterility.`,
      product: "Signova Boron 20% (Foliar spray: 1-1.5 g/L of water at pre-flowering)",
      soilDrip: "Nutrisol-B (Soil/Drip: 2-3 kg/acre during soil preparation or early stages)",
      benefit: "Improves pollen viability, enhances fruit/seed setting, prevents fruit/stem cracking, and improves sugar translocation.",
    },
  ];
}

// Fallback template for backward compatibility/direct reference
export const deficiencyTemplate = getDeficienciesForCrop("paddy");
