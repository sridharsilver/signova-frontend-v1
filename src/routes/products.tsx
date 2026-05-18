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
import { useLanguage } from "@/hooks/use-language";

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

function Products() {
  const { t } = useLanguage();
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const localizedCats = [
    { id: "all", name: t("products.catalog.allCategories"), icon: Sparkles },
    { id: "chelated", name: t("home.categories.chelated.title"), icon: Atom },
    { id: "bio", name: t("home.categories.bio.title"), icon: Droplets },
    { id: "nano", name: t("home.categories.nano.title"), icon: Sparkles },
    { id: "protect", name: t("home.categories.protectors.title"), icon: Shield },
    { id: "organic", name: t("home.categories.organic.title"), icon: Leaf },
    { id: "specialty", name: t("home.categories.specialty.title"), icon: FlaskConical },
  ];

  const localizedItems: Product[] = [
    {
      name: t("products.catalog.comboTitle"),
      cat: "chelated",
      desc: t("products.catalog.comboDesc"),
      tag: "Featured",
      image: agrimax,
      uses: t("products.catalog.comboDesc"),
      dosage: "2 gms. per liter of water.",
      sizes: ["100 gms", "250 gms", "500 gms", "1 Kg"],
    },
    {
      name: t("products.catalog.zincTitle"),
      cat: "nano",
      desc: t("products.catalog.zincDesc"),
      tag: "Bestseller",
      image: nanoUrea,
      uses: t("products.catalog.zincDesc"),
      dosage: "2 ml per liter of water.",
      sizes: ["250 ml", "500 ml", "1 L"],
    },
    {
      name: t("products.catalog.feTitle"),
      cat: "chelated",
      desc: t("products.catalog.feDesc"),
      image: zn12,
      uses: t("products.catalog.feDesc"),
      dosage: "1 gm per liter of water for foliar spray.",
      sizes: ["100 gms", "250 gms", "500 gms", "1 Kg"],
    },
    {
      name: t("products.catalog.boronTitle"),
      cat: "chelated",
      desc: t("products.catalog.boronDesc"),
      image: zn12,
      uses: t("products.catalog.boronDesc"),
      dosage: "1 gm per liter of water.",
      sizes: ["100 gms", "250 gms", "500 gms"],
    },
    {
      name: t("products.catalog.calciumTitle"),
      cat: "chelated",
      desc: t("products.catalog.calciumDesc"),
      image: zn12,
      uses: t("products.catalog.calciumDesc"),
      dosage: "1 ml per liter of water.",
      sizes: ["100 ml", "250 ml", "500 ml", "1 L"],
    },
    {
      name: t("products.catalog.bioTitle"),
      cat: "bio",
      desc: t("products.catalog.bioDesc"),
      image: boost,
      uses: t("products.catalog.bioDesc"),
      dosage: "2 ml per liter of water for foliar spray.",
      sizes: ["250 ml", "500 ml", "1 L", "5 L"],
    },
    {
      name: "Nano Urea Liquid",
      cat: "nano",
      desc: "Nano-engineered liquid nitrogen with 4% nitrogen by weight.",
      tag: "New",
      image: nanoUrea,
      uses: "Delivers efficient foliar nitrogen, reduces conventional urea use by up to 50% and boosts grain quality.",
      dosage: "4 ml per liter of water.",
      sizes: ["500 ml", "1 L"],
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
    }
  ];

  const filtered = useMemo(() => {
    return localizedItems.filter((i) =>
      (active === "all" || i.cat === active) &&
      (q === "" || i.name.toLowerCase().includes(q.toLowerCase()) || i.desc.toLowerCase().includes(q.toLowerCase()))
    );
  }, [active, q, localizedItems]);

  return (
    <>
      <PageHero
        eyebrow={t("products.hero.eyebrow")}
        title={t("products.hero.title")}
        subtitle={t("products.hero.subtitle")}
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search and Category Filter Deck */}
          <div className="space-y-6 mb-10">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("products.catalog.searchPlaceholder")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:border-leaf shadow-card"
              />
            </div>

            {/* Horizontal-scrolling premium category bar for mobile, wrapping grid for desktop */}
            <div className="flex overflow-x-auto pb-4 -mb-4 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:mb-0 flex-nowrap md:flex-wrap gap-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {localizedCats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition shrink-0 cursor-pointer ${
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
                className="text-left group bg-card rounded-3xl p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition relative overflow-hidden cursor-pointer"
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
                    className="absolute top-4 right-4 z-10 size-10 rounded-full bg-secondary hover:bg-muted grid place-items-center transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-gradient-to-br from-secondary to-background grid place-items-center p-8 md:p-12 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl">
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
                          <div className="flex items-center gap-2 text-sm font-semibold text-leaf mb-1.5 animate-pulse">
                            <Beaker className="size-4" />
                            {t("products.catalog.usage")}
                          </div>
                          <p className="text-sm text-foreground/80">{selected.dosage}</p>
                        </div>
                      )}

                      {selected.sizes && selected.sizes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-leaf mb-2">
                            <Package className="size-4" />
                            {t("products.catalog.packSize")}
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

                      <a
                        href="/contact"
                        className="mt-6 inline-flex w-full items-center justify-center px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition cursor-pointer text-center text-sm"
                      >
                        {t("products.catalog.inquiryBtn")}
                      </a>
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
