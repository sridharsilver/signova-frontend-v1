import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageShell";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Solutions — Signova Group" },
      { name: "description", content: "Crop-specific nutrition programmes for chilli, paddy, cotton, mango, tomato, citrus, watermelon and cashew." },
      { property: "og:title", content: "Signova Crop Solutions" },
      { property: "og:description", content: "Tailored science for every crop you grow." },
    ],
  }),
  component: Crops,
});

const crops = [
  { name: "Chilli", emoji: "🌶️", note: "Colour, pungency, fruit set", c: "from-red-500/30 to-orange-500/20" },
  { name: "Paddy", emoji: "🌾", note: "Tillering, grain filling, yield", c: "from-amber-400/30 to-lime/20" },
  { name: "Cotton", emoji: "🌿", note: "Boll weight, lint quality", c: "from-emerald-400/30 to-teal-500/20" },
  { name: "Mango", emoji: "🥭", note: "Flowering, fruit retention", c: "from-yellow-400/30 to-orange-400/20" },
  { name: "Tomato", emoji: "🍅", note: "Fruit setting, shelf life", c: "from-red-400/30 to-rose-400/20" },
  { name: "Citrus", emoji: "🍊", note: "Brix, juice quality", c: "from-orange-400/30 to-yellow-400/20" },
  { name: "Watermelon", emoji: "🍉", note: "Sweetness, weight uniformity", c: "from-pink-400/30 to-emerald-400/20" },
  { name: "Cashew", emoji: "🌰", note: "Nut size, kernel weight", c: "from-amber-500/30 to-stone-400/20" },
];

function Crops() {
  return (
    <>
      <PageHero
        eyebrow="Crop Solutions"
        title="Tailored science for every crop"
        subtitle="Stage-wise nutrition programmes designed by agronomists and tested across Indian agro-climatic zones."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-card shadow-card hover:shadow-glow hover:-translate-y-1 transition cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.c} opacity-60 group-hover:opacity-100 transition`} />
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="text-7xl">{c.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.note}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-secondary/40">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-5">Need a custom programme?</h2>
          <p className="text-muted-foreground text-lg mb-8">Our agronomists craft stage-wise nutrition plans for any crop in any region.</p>
          <a href="/contact" className="inline-flex px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold">Talk to an agronomist</a>
        </div>
      </section>
    </>
  );
}
