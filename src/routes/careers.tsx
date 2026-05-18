import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Signova Group" },
      { name: "description", content: "Build the future of Indian agriculture. Open roles in R&D, sales, manufacturing and field agronomy at Signova Group." },
      { property: "og:title", content: "Careers at Signova" },
      { property: "og:description", content: "Join a 250-strong team transforming Indian agriculture." },
    ],
  }),
  component: Careers,
});

function Careers() {
  const { t } = useLanguage();

  const localizedRoles = [
    {
      t: t("careers.vacancies.officer"),
      l: t("careers.vacancies.officerLoc"),
      d: t("careers.vacancies.officerDesc"),
      type: "Full-time"
    },
    {
      t: t("careers.vacancies.chemist"),
      l: t("careers.vacancies.chemistLoc"),
      d: t("careers.vacancies.chemistDesc"),
      type: "Full-time"
    }
  ];

  return (
    <>
      <PageHero
        eyebrow={t("careers.hero.eyebrow")}
        title={t("careers.hero.title")}
        subtitle={t("careers.hero.subtitle")}
      />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-foreground/90">{t("careers.vacancies.title")}</h2>
          {localizedRoles.map((r, i) => (
            <div
              key={i}
              className="group bg-card rounded-3xl p-7 shadow-card hover:shadow-glow hover:-translate-y-0.5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1"><Briefcase className="size-3" />{r.type}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{r.l}</span>
                </div>
                <h3 className="text-xl font-bold">{r.t}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.d}</p>
              </div>
              <a
                href="mailto:careers@signovagroup.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold group-hover:gap-3 transition-all cursor-pointer whitespace-nowrap self-start md:self-center"
              >
                {t("careers.vacancies.applyBtn")} <ArrowRight className="size-4" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
