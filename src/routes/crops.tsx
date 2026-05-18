import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageShell";
import { useLanguage } from "@/hooks/use-language";

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

function Crops() {
  const { t } = useLanguage();

  const localizedCrops = [
    { name: t("crops.cropsGrid.chilli"), emoji: "🌶️", note: t("crops.cropsGrid.chilliNote"), c: "from-red-500/30 to-orange-500/20" },
    { name: t("crops.cropsGrid.paddy"), emoji: "🌾", note: t("crops.cropsGrid.paddyNote"), c: "from-amber-400/30 to-lime/20" },
    { name: t("crops.cropsGrid.cotton"), emoji: "🌿", note: t("crops.cropsGrid.cottonNote"), c: "from-emerald-400/30 to-teal-500/20" },
    { name: t("crops.cropsGrid.mango"), emoji: "🥭", note: t("crops.cropsGrid.mangoNote"), c: "from-yellow-400/30 to-orange-400/20" },
    { name: t("crops.cropsGrid.tomato"), emoji: "🍅", note: t("crops.cropsGrid.tomatoNote"), c: "from-red-400/30 to-rose-400/20" },
    { name: t("crops.cropsGrid.citrus"), emoji: "🍊", note: t("crops.cropsGrid.citrusNote"), c: "from-orange-400/30 to-yellow-400/20" },
    { name: t("crops.cropsGrid.watermelon"), emoji: "🍉", note: t("crops.cropsGrid.watermelonNote"), c: "from-pink-400/30 to-emerald-400/20" },
    { name: t("crops.cropsGrid.cashew"), emoji: "🌰", note: t("crops.cropsGrid.cashewNote"), c: "from-amber-500/30 to-stone-400/20" },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("crops.hero.eyebrow")}
        title={t("crops.hero.title")}
        subtitle={t("crops.hero.subtitle")}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {localizedCrops.map((c, i) => (
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
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t("crops.custom.title")}</h2>
          <p className="text-muted-foreground text-lg mb-8">{t("crops.custom.desc")}</p>
          <a href="/contact" className="inline-flex px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold cursor-pointer">{t("crops.custom.btn")}</a>
        </div>
      </section>
    </>
  );
}
