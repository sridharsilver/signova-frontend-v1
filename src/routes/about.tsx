import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Eye, Heart, Award, Play, X } from "lucide-react";
import lab from "@/assets/images/lab.jpg";
import farmer from "@/assets/images/farmer.jpg";
import { PageHero } from "@/components/layout/PageShell";
import { useLanguage } from "@/hooks/use-language";

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
  const { t } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const localizedValues = [
    { i: Target, t: t("about.values.missionTitle"), d: t("about.values.missionDesc") },
    { i: Eye, t: t("about.values.visionTitle"), d: t("about.values.visionDesc") },
    { i: Heart, t: t("about.values.valuesTitle"), d: t("about.values.valuesDesc") },
    { i: Award, t: t("about.values.qualityTitle"), d: t("about.values.qualityDesc") },
  ];

  const localizedTimeline = [
    { y: "2013", t: t("about.timeline.y2013t"), d: t("about.timeline.y2013d") },
    { y: "2016", t: t("about.timeline.y2016t"), d: t("about.timeline.y2016d") },
    { y: "2021", t: t("about.timeline.y2021t"), d: t("about.timeline.y2021d") },
    { y: "2025", t: t("about.timeline.y2025t"), d: t("about.timeline.y2025d") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("navbar.aboutUs")}
        title={t("about.story.title")}
        subtitle={t("about.story.desc2")}
      />

      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-6 bg-lime-gradient opacity-20 blur-3xl rounded-3xl transition-opacity group-hover:opacity-40" />
            <button onClick={() => setIsVideoOpen(true)} className="relative block w-full rounded-3xl overflow-hidden shadow-card text-left focus:outline-none">
              <img src="/signova-hq.jpg" loading="lazy" alt="Signova Headquarters" className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/30">
                <div className="size-20 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center ring-1 ring-white/50 group-hover:scale-110 transition-transform">
                  <Play className="size-8 text-white fill-white ml-1" />
                </div>
              </div>
            </button>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-4">{t("about.story.eyebrow")}</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t("about.story.title")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {t("about.story.desc1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("about.story.desc2")}
            </p>
            <p className="text-leaf font-medium leading-relaxed">
              {t("about.story.desc3")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative">
            <div className="absolute -inset-4 bg-lime-gradient opacity-30 blur-2xl rounded-full" />
            <img 
              src="/ceo-profile.jpg" 
              alt="Founder & CEO" 
              className="relative w-full max-w-sm mx-auto aspect-[4/5] object-cover rounded-[2.5rem] shadow-xl transition-all duration-500 hover:scale-[1.02]" 
            />
          </div>
          <div className="md:col-span-7 text-center md:text-left">
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">Leadership</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Visionary Leadership</h2>
            <div className="relative">
              <span className="absolute -top-6 -left-6 text-6xl text-leaf/20 font-serif">"</span>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 italic relative z-10">
                Since our inception, our core philosophy has always been to empower the Indian farmer with world-class, scientifically proven agricultural solutions. We believe that when the farmer grows, the nation thrives.
              </p>
            </div>
            <div>
              <div className="font-bold text-2xl text-foreground">Founder & CEO</div>
              <div className="text-leaf font-medium mt-1">Signova Group</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localizedValues.map((v, i) => (
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
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">{t("about.timeline.eyebrow")}</div>
            <h2 className="text-4xl md:text-5xl font-bold">{t("about.timeline.title")}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-leaf to-transparent" />
            <div className="space-y-12">
              {localizedTimeline.map((m, i) => (
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
            <h2 className="text-3xl md:text-5xl font-bold mb-5">{t("about.cta.title")}</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">{t("about.cta.desc")}</p>
            <Link to="/contact" className="inline-flex px-8 py-4 rounded-2xl bg-lime-gradient text-charcoal font-semibold">{t("about.cta.btn")}</Link>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="size-6" />
              </button>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ftm_aUttYGo?autoplay=1"
                title="Signova Group Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
