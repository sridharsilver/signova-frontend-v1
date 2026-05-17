import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

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

const roles = [
  { t: "Senior R&D Scientist", l: "Hyderabad", d: "Lead chelation chemistry projects and patent filings.", type: "Full-time" },
  { t: "Field Agronomist", l: "Vidarbha, MH", d: "Support cotton & soybean farmers with nutrition programmes.", type: "Full-time" },
  { t: "Regional Sales Manager", l: "Bengaluru", d: "Drive growth across Karnataka & TN dealer network.", type: "Full-time" },
  { t: "Production Engineer", l: "Visakhapatnam", d: "Optimize manufacturing throughput and quality.", type: "Full-time" },
  { t: "Digital Marketing Lead", l: "Hyderabad", d: "Own farmer-facing content, video & community programmes.", type: "Full-time" },
  { t: "QA Chemist", l: "Hyderabad", d: "Daily QC across 200+ parameters; ISO compliance.", type: "Full-time" },
];

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build the future of Indian agriculture"
        subtitle="Join 250+ scientists, agronomists and operators transforming how India grows."
      />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-4">
          {roles.map((r, i) => (
            <div
              key={i}
              className="group bg-card rounded-3xl p-7 shadow-card hover:shadow-glow hover:-translate-y-0.5 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1"><Briefcase className="size-3" />{r.type}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{r.l}</span>
                </div>
                <h3 className="text-xl font-bold">{r.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.d}</p>
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold group-hover:gap-3 transition-all">
                Apply <ArrowRight className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
