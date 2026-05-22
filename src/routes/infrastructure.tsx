import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Factory, FlaskConical, ShieldCheck, Leaf, Server } from "lucide-react";
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
      icon: Factory,
      title: t("infrastructure.f1.title"),
      desc: t("infrastructure.f1.desc"),
    },
    {
      icon: FlaskConical,
      title: t("infrastructure.f2.title"),
      desc: t("infrastructure.f2.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("infrastructure.f3.title"),
      desc: t("infrastructure.f3.desc"),
    },
    {
      icon: Leaf,
      title: t("infrastructure.f4.title"),
      desc: t("infrastructure.f4.desc"),
    },
    {
      icon: Server,
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((fac, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-gradient opacity-10 rounded-bl-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                
                <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center text-primary-text mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <fac.icon className="size-7" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-card-foreground relative z-10">
                  {fac.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {fac.desc}
                </p>
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
