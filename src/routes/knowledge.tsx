import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { Clock } from "lucide-react";
import { getLocalizedArticles } from "./knowledge.$slug";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Centre — Signova Group" },
      { name: "description", content: "Crop nutrition guides, deficiency identification, agronomy tips and the latest agri-research from Signova experts." },
      { property: "og:title", content: "Signova Knowledge Centre" },
      { property: "og:description", content: "Practical agronomy from India's top crop scientists." },
    ],
  }),
  component: Knowledge,
});

function Knowledge() {
  const { t, language } = useLanguage();
  const articles = getLocalizedArticles(language);

  return (
    <>
      <PageHero
        eyebrow={t("knowledge.hero.eyebrow")}
        title={t("knowledge.hero.title")}
        subtitle={t("knowledge.hero.subtitle")}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((p) => (
            <Link
              key={p.slug}
              to="/knowledge/$slug"
              params={{ slug: p.slug }}
              className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-1 transition cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider mb-3">
                  <span className="text-leaf font-semibold">{p.tag}</span>
                  <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="size-3" />{p.time}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
