import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Atom, Shield, Sparkles, Droplets, Leaf, FlaskConical, X, Beaker, Package } from "lucide-react";
import { PageHero } from "@/components/layout/PageShell";
import products from "@/assets/images/products.jpg";
import agrimax from "@/assets/images/products/agrimax.png";
import zn12 from "@/assets/images/products/zn12.png";
import boost from "@/assets/images/products/boost.png";
import nanoUrea from "@/assets/images/products/nano-urea.png";
import shield from "@/assets/images/products/shield.png";
import organo from "@/assets/images/products/organo.png";
import bloom from "@/assets/images/products/bloom.png";

type Product = {
  name: string;
  cat: string;
  desc: string;
  tag?: string;
  image?: string;
  uses?: string;
  dosage?: string;
  sizes?: string[];
};

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & Services — Signova Group" },
      { name: "description", content: "Explore Signova's range of chelated micronutrients, bio-stimulants, nano-tech products, crop protectors and organic solutions." },
      { property: "og:title", content: "Signova Products" },
      { property: "og:description", content: "300+ science-backed crop solutions for Indian farmers." },
      { property: "og:image", content: products },
    ],
  }),
  component: Products,
});

const cats = [
  { id: "all", name: "All", icon: Sparkles },
  { id: "chelated", name: "Chelated", icon: Atom },
  { id: "bio", name: "Bio Stimulants", icon: Droplets },
  { id: "nano", name: "Nano Tech", icon: Sparkles },
  { id: "protect", name: "Protectors", icon: Shield },
  { id: "organic", name: "Organic", icon: Leaf },
  { id: "specialty", name: "Specialty", icon: FlaskConical },
];

const items: Product[] = [
  {
    name: "Agrimax",
    cat: "chelated",
    desc: "Chelated micronutrient mixture — boosts uptake of N, P & K across all major crops.",
    tag: "Featured",
    image: agrimax,
    uses: "A mixture of adequate chelating micronutrients. Agrimax F-4 is suitable for lemon, orange, cotton, paddy, mango, and vine crops. It plays a major role in enhancing the utilization of nitrogen, phosphorus, and potash in plants.",
    dosage: "2 gms. per liter of water.",
    sizes: ["100 gms", "250 gms", "500 gms", "1 Kg"],
  },
  {
    name: "Signova Zn-12",
    cat: "chelated",
    desc: "Chelated zinc 12% EDTA — corrects deficiency in paddy, citrus, vegetables.",
    tag: "Bestseller",
    image: zn12,
    uses: "Chelated Zinc 12% EDTA corrects zinc deficiency in paddy, wheat, citrus, sugarcane and vegetables. Improves chlorophyll formation, enzyme activity and overall yield quality.",
    dosage: "1 gm per liter of water for foliar spray; 5 kg/acre for soil application.",
    sizes: ["100 gms", "250 gms", "500 gms", "1 Kg", "5 Kg"],
  },
  {
    name: "Signova Fe-12",
    cat: "chelated",
    desc: "Chelated iron 12% EDTA — restores chlorophyll & green colour fast.",
    image: zn12,
    uses: "Chelated Iron 12% EDTA cures iron chlorosis (yellowing of leaves) in citrus, grapes, pomegranate and ornamental crops. Restores deep green colour within days.",
    dosage: "1 gm per liter of water for foliar spray.",
    sizes: ["100 gms", "250 gms", "500 gms", "1 Kg"],
  },
  {
    name: "Signova Cu-Pro",
    cat: "chelated",
    desc: "Copper EDTA for orchard nutrition & disease prep.",
    image: zn12,
    uses: "Chelated Copper EDTA strengthens orchard crops, improves disease resistance and supports protein synthesis in vine, citrus and pomegranate plantations.",
    dosage: "1 gm per liter of water.",
    sizes: ["100 gms", "250 gms", "500 gms"],
  },
  {
    name: "Signova Boost",
    cat: "bio",
    desc: "Seaweed-based bio-stimulant for vegetative & flowering boost.",
    image: boost,
    uses: "Premium seaweed extract enriched with natural growth hormones, amino acids and trace nutrients. Promotes vegetative growth, flowering, fruit set and stress tolerance.",
    dosage: "2 ml per liter of water for foliar spray.",
    sizes: ["250 ml", "500 ml", "1 L", "5 L"],
  },
  {
    name: "Signova Roots",
    cat: "bio",
    desc: "Humic + fulvic acid blend for stronger root architecture.",
    image: boost,
    uses: "Humic and fulvic acid blend that improves soil structure, enhances nutrient absorption and develops a strong root system. Suitable for all crops in all soil types.",
    dosage: "2-3 ml per liter of water; or 1 L per acre via drip.",
    sizes: ["500 ml", "1 L", "5 L"],
  },
  {
    name: "Nano Urea Liquid",
    cat: "nano",
    desc: "Patented nano-nitrogen — half the dose, full the harvest.",
    tag: "New",
    image: nanoUrea,
    uses: "Nano-engineered liquid nitrogen with 4% nitrogen by weight. Delivers efficient foliar nitrogen, reduces conventional urea use by up to 50% and boosts grain quality.",
    dosage: "4 ml per liter of water; 2 sprays at active tillering & panicle stage.",
    sizes: ["500 ml", "1 L"],
  },
  {
    name: "Nano Zinc",
    cat: "nano",
    desc: "Particle-engineered zinc for foliar precision delivery.",
    image: nanoUrea,
    uses: "Nano-particle zinc for ultra-precise foliar delivery. Corrects zinc deficiency at micro-doses with superior absorption compared to conventional chelates.",
    dosage: "2 ml per liter of water.",
    sizes: ["250 ml", "500 ml", "1 L"],
  },
  {
    name: "Signova Shield",
    cat: "protect",
    desc: "Broad-spectrum fungicide for blight, mildew & rust.",
    image: shield,
    uses: "Systemic broad-spectrum fungicide for control of blight, downy mildew, powdery mildew and rust in vegetables, grapes, potato and cereals.",
    dosage: "2 ml per liter of water.",
    sizes: ["100 ml", "250 ml", "500 ml", "1 L"],
  },
  {
    name: "Signova Guard",
    cat: "protect",
    desc: "Insecticide for sucking pests in cotton & chilli.",
    image: shield,
    uses: "Contact and systemic insecticide effective against sucking pests like aphids, jassids, whitefly and thrips in cotton, chilli, brinjal and okra.",
    dosage: "1.5 ml per liter of water.",
    sizes: ["100 ml", "250 ml", "500 ml", "1 L"],
  },
  {
    name: "OrganoGold",
    cat: "organic",
    desc: "Certified organic granule — slow-release NPK + micronutrients.",
    image: organo,
    uses: "Certified organic granular fertilizer with slow-release NPK and full micronutrient profile. Improves soil health, microbial activity and delivers sustained nutrition.",
    dosage: "50-100 kg per acre as basal application.",
    sizes: ["1 Kg", "5 Kg", "25 Kg", "50 Kg"],
  },
  {
    name: "Bloom Mix",
    cat: "specialty",
    desc: "Crop-specific NPK 13-40-13 for flower induction.",
    image: bloom,
    uses: "Water-soluble NPK 13-40-13 specially formulated for flower induction, bud development and uniform bloom in horticultural and floricultural crops.",
    dosage: "5 gms per liter of water.",
    sizes: ["1 Kg", "5 Kg", "25 Kg"],
  },
  {
    name: "Yield Max",
    cat: "specialty",
    desc: "Potash-rich 0-0-50 for grain filling and fruit weight.",
    image: bloom,
    uses: "Sulphate of potash (0-0-50) ideal for grain filling, fruit weight, sugar content and shelf-life improvement in all crops.",
    dosage: "5 gms per liter of water; or 25 kg/acre via drip.",
    sizes: ["1 Kg", "5 Kg", "25 Kg"],
  },
];

function Products() {
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return items.filter((i) =>
      (active === "all" || i.cat === active) &&
      (q === "" || i.name.toLowerCase().includes(q.toLowerCase()) || i.desc.toLowerCase().includes(q.toLowerCase()))
    );
  }, [active, q]);

  return (
    <>
      <PageHero
        eyebrow="Products & Services"
        title="A complete crop nutrition portfolio"
        subtitle="300+ products across micronutrients, bio-stimulants, nano-tech, protectors and organic solutions."
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:border-leaf shadow-card"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                  active === c.id
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "bg-card border border-border hover:border-leaf"
                }`}
              >
                <c.icon className="size-4" />
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.button
                key={p.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 9) * 0.05 }}
                onClick={() => setSelected(p)}
                className="text-left group bg-card rounded-3xl p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition relative overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 size-40 rounded-full bg-lime-gradient opacity-10 group-hover:opacity-30 blur-2xl transition" />
                {p.tag && (
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-lime-gradient text-charcoal z-10">
                    {p.tag}
                  </div>
                )}
                {p.image ? (
                  <div className="aspect-square mb-5 rounded-2xl bg-gradient-to-br from-secondary to-background overflow-hidden grid place-items-center p-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="size-12 rounded-2xl bg-secondary grid place-items-center mb-5">
                    <Atom className="size-5 text-leaf" />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm grid place-items-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-card rounded-3xl shadow-glow max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 z-10 size-10 rounded-full bg-secondary hover:bg-muted grid place-items-center transition"
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-gradient-to-br from-secondary to-background grid place-items-center p-8 md:p-12 md:rounded-l-3xl">
                      {selected.image ? (
                        <img
                          src={selected.image}
                          alt={selected.name}
                          className="max-h-80 w-auto object-contain"
                        />
                      ) : (
                        <div className="size-32 rounded-3xl bg-lime-gradient grid place-items-center">
                          <Atom className="size-14 text-charcoal" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:p-10">
                      {selected.tag && (
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-lime-gradient text-charcoal mb-3">
                          {selected.tag}
                        </div>
                      )}
                      <h2 className="font-display text-3xl font-bold mb-3">{selected.name}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {selected.uses ?? selected.desc}
                      </p>

                      {selected.dosage && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-leaf mb-1.5">
                            <Beaker className="size-4" />
                            Dosage
                          </div>
                          <p className="text-sm text-foreground/80">{selected.dosage}</p>
                        </div>
                      )}

                      {selected.sizes && selected.sizes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-leaf mb-2">
                            <Package className="size-4" />
                            Available sizes
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selected.sizes.map((s) => (
                              <span
                                key={s}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary border border-border"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-20">No products match your search.</div>
          )}
        </div>
      </section>
    </>
  );
}
