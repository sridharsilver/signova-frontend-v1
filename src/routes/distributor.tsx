import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { TrendingUp, Users, Megaphone, GraduationCap, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/distributor")({
  head: () => ({
    meta: [
      { title: "Become a Distributor — Signova Group" },
      { name: "description", content: "Partner with Signova. Industry-leading margins, exclusive territories, marketing support and field training." },
      { property: "og:title", content: "Signova Distributor Programme" },
      { property: "og:description", content: "Grow your business with India's premium agri-brand." },
    ],
  }),
  component: Dist,
});

function Dist() {
  const { t } = useLanguage();

  const localizedBenefits = [
    { i: TrendingUp, t: t("distributor.benefits.margins"), d: t("distributor.benefits.marginsDesc") },
    { i: Users, t: t("distributor.benefits.territory"), d: t("distributor.benefits.territoryDesc") },
    { i: Megaphone, t: t("distributor.benefits.marketing"), d: t("distributor.benefits.marketingDesc") },
    { i: GraduationCap, t: t("distributor.benefits.training"), d: t("distributor.benefits.trainingDesc") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("distributor.hero.eyebrow")}
        title={t("distributor.hero.title")}
        subtitle={t("distributor.hero.subtitle")}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localizedBenefits.map((b, i) => (
            <div key={i} className="bg-card rounded-3xl p-7 shadow-card hover:shadow-glow transition">
              <div className="size-12 rounded-2xl bg-lime-gradient grid place-items-center mb-5">
                <b.i className="size-5 text-charcoal" />
              </div>
              <h3 className="text-lg font-bold mb-2">{b.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-hero text-white p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -top-40 -right-40 size-96 rounded-full bg-lime-gradient opacity-30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">{t("distributor.form.title")}</h2>
              <p className="text-white/70 mb-6">{t("distributor.form.subtitle")}</p>
              <ul className="space-y-3 text-sm">
                {[
                  t("distributor.form.req1"),
                  t("distributor.form.req2"),
                  t("distributor.form.req3"),
                  t("distributor.form.req4")
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2"><Check className="size-4 text-lime mt-0.5" />{x}</li>
                ))}
              </ul>
            </div>
            <form className="glass-dark rounded-3xl p-7 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("distributor.form.name")} required />
              <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("distributor.form.phone")} required />
              <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("distributor.form.email")} type="email" />
              <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("distributor.form.location")} required />
              <textarea rows={3} className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("distributor.form.businessDetails")} />
              <button className="w-full px-5 py-3.5 rounded-xl bg-lime-gradient text-charcoal font-semibold hover:scale-[1.01] transition cursor-pointer">
                {t("distributor.form.submit")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
