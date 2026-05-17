import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Award } from "lucide-react";
import lab from "@/assets/images/lab.jpg";
import farmer from "@/assets/images/farmer.jpg";
import { PageHero } from "@/components/layout/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Signova Group — Our Story & Mission" },
      { name: "description", content: "Founded in 2004, Signova Group is a leading Indian agri-tech company in micronutrients, bio-stimulants and crop protection." },
      { property: "og:title", content: "About Signova Group" },
      { property: "og:description", content: "Two decades of growing India's harvests through science." },
    ],
  }),
  component: About,
});

function About() {
  const values = [
    { i: Target, t: "Mission", d: "Put world-class crop science into the hands of every Indian farmer." },
    { i: Eye, t: "Vision", d: "Be Asia's most trusted micronutrient and bio-solution brand by 2030." },
    { i: Heart, t: "Values", d: "Farmer-first, science-led, sustainable, and uncompromisingly quality-focused." },
    { i: Award, t: "Quality", d: "ISO 9001:2015 certified manufacturing with daily QC across 200+ parameters." },
  ];

  const timeline = [
    { y: "2004", t: "Founded", d: "Signova established with a single product line in Hyderabad." },
    { y: "2010", t: "R&D Centre", d: "First in-house chelation research facility commissioned." },
    { y: "2016", t: "Pan-India", d: "Network expanded to 20+ states with 1,000+ dealers." },
    { y: "2021", t: "Nano Tech", d: "Launched India's first nano-zinc liquid micronutrient." },
    { y: "2025", t: "100k Farmers", d: "Crossed the 100,000 active farmer milestone." },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Two decades of growing India's harvests"
        subtitle="From a single product to 300+ science-backed crop solutions trusted across India."
      />

      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-lime-gradient opacity-20 blur-3xl rounded-3xl" />
            <img src={farmer} loading="lazy" alt="Farmer in field" className="relative rounded-3xl shadow-card" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-4">Our Story</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Built on the soil, refined in the lab.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Signova Group was founded in 2004 with a singular belief — that Indian farmers deserve world-class
              crop nutrition without compromise. What began with a single chelated micronutrient has grown into a
              portfolio of 300+ products serving farmers in 22 states.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today our R&D, manufacturing and 250+ field experts work together to deliver measurable yield
              improvements — season after season.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-3xl p-7 shadow-card hover:shadow-glow transition"
              >
                <div className="size-12 rounded-2xl bg-lime-gradient grid place-items-center mb-5">
                  <v.i className="size-5 text-charcoal" />
                </div>
                <h3 className="text-lg font-bold mb-2">{v.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">Milestones</div>
            <h2 className="text-4xl md:text-5xl font-bold">Our journey so far</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-leaf to-transparent" />
            <div className="space-y-12">
              {timeline.map((m, i) => (
                <motion.div
                  key={m.y}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex md:items-center gap-6 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 size-4 rounded-full bg-lime-gradient ring-4 ring-background" />
                  <div className="md:w-1/2 md:px-12 pl-12 md:pl-0">
                    <div className="bg-card rounded-2xl p-6 shadow-card">
                      <div className="text-3xl font-display font-bold text-gradient">{m.y}</div>
                      <div className="font-bold mt-1">{m.t}</div>
                      <p className="text-sm text-muted-foreground mt-2">{m.d}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] bg-hero text-white p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-5">Ready to grow with us?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Join 100,000+ farmers and 3,000+ dealers already partnering with Signova.</p>
            <Link to="/contact" className="inline-flex px-8 py-4 rounded-2xl bg-lime-gradient text-charcoal font-semibold">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
