import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Beaker, Microscope, ShieldCheck, Cpu } from "lucide-react";
import { PageHero } from "@/components/layout/PageShell";
import lab from "@/assets/images/lab.jpg";

export const Route = createFileRoute("/innovation")({
  head: () => ({
    meta: [
      { title: "R&D and Innovation — Signova Group" },
      { name: "description", content: "Inside Signova's research lab — chelation chemistry, nano formulations, bio-stimulants and ISO-certified quality control." },
      { property: "og:title", content: "Signova R&D and Innovation" },
      { property: "og:description", content: "Science behind India's premium crop nutrition brand." },
      { property: "og:image", content: lab },
    ],
  }),
  component: Innovation,
});

const pillars = [
  { i: Beaker, t: "Formulation Science", d: "Chelation chemistry, nano emulsions and bio-actives developed in-house." },
  { i: Microscope, t: "Field Trials", d: "500+ trials across 22 states ensure every product performs in real conditions." },
  { i: ShieldCheck, t: "Quality Assurance", d: "ISO 9001:2015 facility — daily QC across 200+ parameters." },
  { i: Cpu, t: "AgriTech Platform", d: "Digital advisory, soil mapping and dose calculators for partner farmers." },
];

function Innovation() {
  return (
    <>
      <PageHero
        eyebrow="R&D & Innovation"
        title="Where soil science meets molecular chemistry"
        subtitle="A 30-scientist research centre engineering tomorrow's crop solutions today."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-lime-gradient opacity-20 blur-3xl rounded-3xl" />
            <img src={lab} loading="lazy" alt="Signova lab" className="relative rounded-3xl shadow-card" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Science you can see in the harvest.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Our lab develops every product from molecule to bottle — chelating agents are synthesized,
              tested and field-validated under one roof.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Continuous innovation is why Signova owns 12+ patents and launched India's first nano-zinc
              liquid micronutrient.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-3xl p-7 shadow-card hover:shadow-glow transition"
            >
              <div className="size-12 rounded-2xl bg-lime-gradient grid place-items-center mb-5">
                <p.i className="size-5 text-charcoal" />
              </div>
              <h3 className="text-lg font-bold mb-2">{p.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
