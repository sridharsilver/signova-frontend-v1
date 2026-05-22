import { createFileRoute, Link } from "@tanstack/react-router";
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

import { supabase } from "@/lib/supabase";
import { CROPS } from "@/data/crops";

const LOCAL_CROP_IMAGES: Record<string, string> = {
  chilli: chilliImg,
  paddy: paddyImg,
  cotton: cottonImg,
  mango: mangoImg,
  tomato: tomatoImg,
  citrus: citrusImg,
  watermelon: watermelonImg,
  cashew: cashewImg,
};

export const Route = createFileRoute("/crops")({
  loader: async () => {
    try {
      const { data, error } = await supabase
        .from("crops")
        .select("*")
        .order("slug", { ascending: true });
      if (error || !data || data.length === 0) {
        return { crops: null };
      }
      return { crops: data };
    } catch (e) {
      console.error("Failed to fetch crops from Supabase:", e);
      return { crops: null };
    }
  },
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
  const { t, language } = useLanguage();
  const { crops: dbCrops } = Route.useLoaderData();

  const cropsList = dbCrops || CROPS;

  const cropCards = cropsList.map((crop) => {
    const slug = crop.slug;
    const name = typeof crop.name === "object" && crop.name
      ? (crop.name[language] || crop.name["en"] || "")
      : t(`crops.cropsGrid.${crop.slug}` as any, crop.name);

    const note = typeof crop.note === "object" && crop.note
      ? (crop.note[language] || crop.note["en"] || "")
      : t(`crops.cropsGrid.${crop.slug}Note` as any, crop.note);

    const img = ("image_url" in crop && crop.image_url)
      ? crop.image_url
      : (LOCAL_CROP_IMAGES[slug.toLowerCase()] || ("img" in crop ? crop.img : "") || paddyImg);

    return { slug, name, note, img };
  });

  return (
    <>
      <PageHero
        eyebrow={t("crops.hero.eyebrow")}
        title={t("crops.hero.title")}
        subtitle={t("crops.hero.subtitle")}
      />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {cropCards.map((crop, i) => (
              <Link
                key={crop.slug}
                to="/crops/$slug/nutrients"
                params={{ slug: crop.slug }}
                className="block"
              >
                <motion.div
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
                    <p className="text-white/60 text-xs md:text-[10px] font-semibold tracking-[0.18em] uppercase mb-2 md:mb-1.5">
                      {crop.note}
                    </p>

                    {/* Crop name + hover CTA */}
                    <div className="flex flex-col w-full">
                      <h3 className="text-white text-4xl md:text-3xl font-bold leading-tight">
                        {crop.name}
                      </h3>

                      {/* View Programme — always visible on mobile, slides in on hover on desktop */}
                      <span
                        className="flex items-center gap-1 text-white/80 text-sm md:text-xs font-medium hover:text-white transition-all duration-300 opacity-100 max-h-6 translate-y-0 mt-2 md:opacity-0 md:max-h-0 md:translate-y-1 md:mt-0 overflow-hidden self-end group-hover:opacity-100 group-hover:max-h-6 group-hover:translate-y-0 group-hover:mt-1.5"
                      >
                        View Programme
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Rounded corner inset border for premium feel */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />
                </motion.div>
              </Link>
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
