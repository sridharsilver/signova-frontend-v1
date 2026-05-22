import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageShell";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/infrastructure")({
  head: () => ({
    meta: [
      { title: "Infrastructure & Facilities | Signova Group" },
      { name: "description", content: "Signova Infrastructure boasts advanced facilities, providing top-tier agricultural solutions for optimal crop growth." },
      { property: "og:title", content: "Infrastructure & Facilities | Signova Group" },
      { property: "og:description", content: "Signova Infrastructure boasts advanced facilities, providing top-tier agricultural solutions for optimal crop growth." },
    ],
  }),
  component: Infrastructure,
});

function Infrastructure() {
  const { t } = useLanguage();

  const facilities = [
    {
      image: "/images/infrastructure/f1-manufacturing.png",
      title: t("infrastructure.f1.title"),
      desc: t("infrastructure.f1.desc"),
    },
    {
      image: "/images/infrastructure/f2-research.png",
      title: t("infrastructure.f2.title"),
      desc: t("infrastructure.f2.desc"),
    },
    {
      image: "/images/infrastructure/f3-qa.png",
      title: t("infrastructure.f3.title"),
      desc: t("infrastructure.f3.desc"),
    },
    {
      image: "/images/infrastructure/f4-sustainable.png",
      title: t("infrastructure.f4.title"),
      desc: t("infrastructure.f4.desc"),
    },
    {
      image: "/images/infrastructure/f5-it.png",
      title: t("infrastructure.f5.title"),
      desc: t("infrastructure.f5.desc"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("navbar.infrastructure")}
        title={t("infrastructure.hero.title")}
        subtitle={t("infrastructure.hero.subtitle")}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {facilities.map((fac, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col ${
                  i < 2 ? "md:col-span-3" : "md:col-span-2"
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-lime-gradient mix-blend-multiply opacity-20 z-10 pointer-events-none transition-opacity group-hover:opacity-0" />
                  <img src={fac.image} alt={fac.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">
                    {fac.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-lime-gradient opacity-5 mix-blend-multiply" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="text-sm font-semibold text-leaf tracking-widest uppercase mb-4">
            {t("infrastructure.why.eyebrow")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            {t("infrastructure.why.title")}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div>
              <h4 className="text-xl font-bold mb-3 text-card-foreground">{t("infrastructure.why.p1title")}</h4>
              <p className="text-muted-foreground">{t("infrastructure.why.p1desc")}</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-card-foreground">{t("infrastructure.why.p2title")}</h4>
              <p className="text-muted-foreground">{t("infrastructure.why.p2desc")}</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-card-foreground">{t("infrastructure.why.p3title")}</h4>
              <p className="text-muted-foreground">{t("infrastructure.why.p3desc")}</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-card-foreground">{t("infrastructure.why.p4title")}</h4>
              <p className="text-muted-foreground">{t("infrastructure.why.p4desc")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
