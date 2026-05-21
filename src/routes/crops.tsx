import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageShell";
import { useLanguage } from "@/hooks/use-language";

import chilliImg from "@/assets/images/crops/chilli.png";
import paddyImg from "@/assets/images/crops/paddy.png";
import cottonImg from "@/assets/images/crops/cotton.png";
import mangoImg from "@/assets/images/crops/mango.png";
import tomatoImg from "@/assets/images/crops/tomato.png";
import citrusImg from "@/assets/images/crops/citrus.png";
import watermelonImg from "@/assets/images/crops/watermelon.png";
import cashewImg from "@/assets/images/crops/cashew.png";

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

  const cropCards = [
    { name: t("crops.cropsGrid.chilli"),     note: t("crops.cropsGrid.chilliNote"),     img: chilliImg },
    { name: t("crops.cropsGrid.paddy"),       note: t("crops.cropsGrid.paddyNote"),       img: paddyImg },
    { name: t("crops.cropsGrid.cotton"),      note: t("crops.cropsGrid.cottonNote"),      img: cottonImg },
    { name: t("crops.cropsGrid.mango"),       note: t("crops.cropsGrid.mangoNote"),       img: mangoImg },
    { name: t("crops.cropsGrid.tomato"),      note: t("crops.cropsGrid.tomatoNote"),      img: tomatoImg },
    { name: t("crops.cropsGrid.citrus"),      note: t("crops.cropsGrid.citrusNote"),      img: citrusImg },
    { name: t("crops.cropsGrid.watermelon"), note: t("crops.cropsGrid.watermelonNote"), img: watermelonImg },
    { name: t("crops.cropsGrid.cashew"),      note: t("crops.cropsGrid.cashewNote"),      img: cashewImg },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("crops.hero.eyebrow")}
        title={t("crops.hero.title")}
        subtitle={t("crops.hero.subtitle")}
      />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {cropCards.map((crop, i) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Background Photo */}
                <img
                  src={crop.img}
                  alt={crop.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay — darker at bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Subtle vignette on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                {/* Bottom text content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Category eyebrow */}
                  <p className="text-white/60 text-[10px] font-semibold tracking-[0.18em] uppercase mb-1.5">
                    {crop.note}
                  </p>

                  {/* Crop name + hover CTA */}
                  <div className="flex items-end justify-between gap-2">
                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                      {crop.name}
                    </h3>

                    {/* View Programme — hidden by default, slides in on hover */}
                    <a
                      href="/contact"
                      className="flex items-center gap-1 text-white/80 text-xs font-medium hover:text-white transition-all duration-300 shrink-0 mb-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      View Programme
                      <ArrowUpRight className="size-3" />
                    </a>
                  </div>
                </div>

                {/* Rounded corner inset border for premium feel */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t("crops.custom.title")}</h2>
          <p className="text-muted-foreground text-lg mb-8">{t("crops.custom.desc")}</p>
          <a
            href="/contact"
            className="inline-flex px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold cursor-pointer hover:scale-[1.02] transition-transform"
          >
            {t("crops.custom.btn")}
          </a>
        </div>
      </section>
    </>
  );
}
