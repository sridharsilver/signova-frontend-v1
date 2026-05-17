import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FlaskConical, Leaf, Atom, Droplets, Shield, Star, Quote, ChevronRight, PlayCircle } from "lucide-react";
import heroFarm from "@/assets/images/hero-farm.jpg";
import lab from "@/assets/images/lab.jpg";
import farmer from "@/assets/images/farmer.jpg";
import products from "@/assets/images/products.jpg";
import leaves from "@/assets/images/leaves.jpg";
import { Counter } from "@/components/common/Counter";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signova Group — Redefining Crop Nutrition with Science" },
      { name: "description", content: "Trusted by 100,000+ farmers. Premium micronutrients, bio-stimulants & nano-tech crop solutions made in India." },
      { property: "og:title", content: "Signova Group — Premium Crop Nutrition" },
      { property: "og:description", content: "Advanced micronutrients trusted by 100,000+ Indian farmers." },
      { property: "og:image", content: heroFarm },
    ],
  }),
  component: HomePage,
});

const stats = [
  { n: 100000, s: "+", l: "Happy Farmers" },
  { n: 3000, s: "+", l: "Dealers" },
  { n: 300, s: "+", l: "Products" },
  { n: 250, s: "+", l: "Experts" },
];

const categories = [
  { icon: Atom, title: "Chelated Micronutrients", desc: "EDTA-chelated nutrients for maximum absorption.", grad: "from-leaf to-deep" },
  { icon: Shield, title: "Crop Protectors", desc: "Advanced protection against pests and diseases.", grad: "from-deep to-charcoal" },
  { icon: Sparkles, title: "Nano Technology", desc: "Next-gen nano formulations for precision farming.", grad: "from-lime to-leaf" },
  { icon: Droplets, title: "Bio Stimulants", desc: "Natural growth boosters for stronger crops.", grad: "from-leaf to-lime" },
  { icon: Leaf, title: "Organic Solutions", desc: "Certified organic inputs for sustainable yield.", grad: "from-deep to-leaf" },
  { icon: FlaskConical, title: "Specialty Fertilizers", desc: "Crop-specific blends developed by our R&D team.", grad: "from-charcoal to-deep" },
];

const crops = [
  { name: "Chilli", emoji: "🌶️" },
  { name: "Paddy", emoji: "🌾" },
  { name: "Cotton", emoji: "🌿" },
  { name: "Mango", emoji: "🥭" },
  { name: "Tomato", emoji: "🍅" },
  { name: "Citrus", emoji: "🍊" },
  { name: "Watermelon", emoji: "🍉" },
  { name: "Cashew", emoji: "🌰" },
];

const stories = [
  { name: "Ramesh Patel", crop: "Cotton • Gujarat", quote: "Yield jumped 32% in one season after switching to Signova micronutrients.", img: farmer },
  { name: "Lakshmi Devi", crop: "Chilli • Andhra Pradesh", quote: "Healthier plants, deeper colour, and a buyer waiting at the gate.", img: farmer },
  { name: "Suresh Kumar", crop: "Paddy • Telangana", quote: "The team's field guidance is what truly sets Signova apart.", img: farmer },
];

const articles = [
  { tag: "Nutrition", title: "Why zinc deficiency silently caps your paddy yield", img: leaves },
  { tag: "Guide", title: "A 7-step micronutrient plan for chilli farmers", img: heroFarm },
  { tag: "Innovation", title: "Nano urea: smaller particle, bigger harvest", img: lab },
];

function HomePage() {
  const [hero, setHero] = useState({
    title: "Redefining {Crop Nutrition} with Science & Innovation",
    subtitle: "Advanced micronutrients and crop solutions trusted by thousands of farmers across India.",
    image: heroFarm,
    primaryBtnText: "Explore Products",
    primaryBtnLink: "/products",
    secondaryBtnText: "Become a Distributor",
    secondaryBtnLink: "/distributor"
  });

  useEffect(() => {
    async function fetchHeroSettings() {
      try {
        const { data, error } = await supabase
          .from("frontend_settings")
          .select("*")
          .eq("key", "hero")
          .single();

        if (error) {
          const local = localStorage.getItem("signova_frontend_settings");
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed.hero && parsed.hero.slides && parsed.hero.slides[0]) {
              applySettings(parsed.hero.slides[0]);
            }
          }
        } else if (data && data.value && data.value.slides && data.value.slides[0]) {
          applySettings(data.value.slides[0]);
        }
      } catch (err) {
        console.warn("Failed to load dynamic hero settings, falling back.", err);
      }
    }

    function applySettings(slide: any) {
      setHero({
        title: slide.title || "Redefining {Crop Nutrition} with Science & Innovation",
        subtitle: slide.subtitle || "Advanced micronutrients and crop solutions trusted by thousands of farmers across India.",
        image: slide.image || heroFarm,
        primaryBtnText: slide.primaryBtnText || "Explore Products",
        primaryBtnLink: slide.primaryBtnLink || "/products",
        secondaryBtnText: slide.secondaryBtnText || "Become a Distributor",
        secondaryBtnLink: slide.secondaryBtnLink || "/distributor"
      });
    }

    fetchHeroSettings();
  }, []);

  const renderTitle = (titleText: string) => {
    // Matches text inside curly braces: e.g. {Crop Nutrition}
    const parts = titleText.split(/(\{.*?\})/);
    return parts.map((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const cleanText = part.slice(1, -1);
        return (
          <span key={index} className="text-gradient">
            {cleanText}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <img src={heroFarm} alt="Lush Indian farmland aerial view" className="w-full h-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        </div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-2 rounded-full bg-lime/40 blur-sm"
            style={{ left: `${(i * 83) % 100}%`, top: `${(i * 47) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-6 py-32 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.25em] text-lime mb-8"
          >
            <Sparkles className="size-3.5" /> Science • Nutrition • Growth
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] max-w-5xl"
          >
            {renderTitle(hero.title)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 text-lg md:text-xl text-white/75 max-w-2xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to={hero.primaryBtnLink} className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-lime-gradient text-charcoal font-semibold shadow-glow hover:scale-[1.02] transition">
              {hero.primaryBtnText}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to={hero.secondaryBtnLink} className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl glass-dark text-white font-semibold hover:bg-white/10 transition">
              <PlayCircle className="size-5" /> {hero.secondaryBtnText}
            </Link>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/50 text-xs uppercase tracking-[0.3em]">
            <span>Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass shadow-card rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient">
                  <Counter to={s.n} suffix={s.s} />
                </div>
                <div className="mt-2 text-xs md:text-sm uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-lime-gradient opacity-20 blur-3xl rounded-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <img src={lab} alt="Signova research lab" loading="lazy" className="rounded-3xl object-cover h-72 w-full shadow-card" />
              <img src={leaves} alt="Healthy crop leaves" loading="lazy" className="rounded-3xl object-cover h-72 w-full mt-12 shadow-card" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-4">About Signova</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Two decades of growing <span className="text-gradient">India's harvests</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Established in 2004, Signova Group is a science-led agri-tech company developing micronutrients,
              bio-stimulants, and protection chemistries that help farmers grow more — sustainably.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our mission is simple: put world-class crop science in the hands of every Indian farmer,
              backed by ISO-certified manufacturing and a 250-strong field expert team.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              Read our story <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="py-28 bg-secondary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">What We Make</div>
            <h2 className="text-4xl md:text-6xl font-bold">Product <span className="text-gradient">Categories</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative bg-card rounded-3xl p-8 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute -top-20 -right-20 size-48 rounded-full bg-gradient-to-br ${c.grad} opacity-10 group-hover:opacity-30 blur-2xl transition`} />
                <div className={`relative size-14 rounded-2xl bg-gradient-to-br ${c.grad} grid place-items-center mb-6 shadow-lg`}>
                  <c.icon className="size-6 text-white" />
                </div>
                <h3 className="relative text-xl font-bold mb-3">{c.title}</h3>
                <p className="relative text-muted-foreground text-sm leading-relaxed mb-6">{c.desc}</p>
                <Link to="/products" className="relative inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="size-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CROPS */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">Crop Solutions</div>
              <h2 className="text-4xl md:text-6xl font-bold max-w-2xl">Tailored science for <span className="text-gradient">every crop</span></h2>
            </div>
            <Link to="/crops" className="inline-flex items-center gap-2 text-primary font-semibold">
              View all crops <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {crops.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to="/crops"
                  className="group block aspect-square rounded-3xl bg-gradient-to-br from-secondary to-card border border-border p-6 hover:border-leaf hover:shadow-glow transition-all hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-lime-gradient opacity-0 group-hover:opacity-10 transition" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="text-6xl">{c.emoji}</div>
                    <div>
                      <div className="text-xl font-bold">{c.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 group-hover:text-primary transition">
                        Explore <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INNOVATION / R&D */}
      <section className="relative py-32 bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0">
          <img src={lab} alt="Lab" loading="lazy" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-lime font-semibold mb-4">Innovation Lab</div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Research that grows <span className="text-gradient">tomorrow's harvest</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
              Our 30+ scientist R&D centre develops chelation chemistries, nano formulations, and bio-stimulants
              with rigorous quality control and ISO 9001:2015 certification.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "ISO Certified", v: "9001:2015" },
                { k: "Patents Filed", v: "12+" },
                { k: "Field Trials", v: "500+" },
                { k: "Quality Tests", v: "Daily" },
              ].map((x) => (
                <div key={x.k} className="glass-dark rounded-2xl p-5">
                  <div className="text-2xl font-bold text-gradient">{x.v}</div>
                  <div className="text-xs uppercase tracking-wider text-white/60 mt-1">{x.k}</div>
                </div>
              ))}
            </div>
            <Link to="/innovation" className="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-2xl bg-lime-gradient text-charcoal font-semibold">
              Inside our R&D <ArrowRight className="size-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-lime-gradient opacity-30 blur-3xl rounded-full" />
            <img src={products} alt="Premium product range" loading="lazy" className="relative rounded-3xl shadow-glow" />
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">Farmer Stories</div>
            <h2 className="text-4xl md:text-6xl font-bold">Yields that speak <span className="text-gradient">for themselves</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition aspect-[3/4]"
              >
                <img src={s.img} alt={s.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                <div className="absolute inset-0 p-7 flex flex-col justify-between text-white">
                  <Quote className="size-8 text-lime opacity-80" />
                  <div>
                    <p className="text-base mb-5 leading-relaxed">"{s.quote}"</p>
                    <div className="font-bold">{s.name}</div>
                    <div className="text-sm text-lime">{s.crop}</div>
                    <div className="flex gap-0.5 mt-2">
                      {[...Array(5)].map((_, j) => <Star key={j} className="size-3.5 fill-lime text-lime" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DISTRIBUTOR CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-hero p-10 md:p-16 text-white">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -top-40 -right-40 size-96 rounded-full bg-lime-gradient opacity-30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-lime font-semibold mb-4">Partner Programme</div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Grow your business with <span className="text-gradient">India's premium agri-brand</span>
              </h2>
              <p className="text-white/75 mb-8 max-w-md">
                Industry-leading margins, exclusive territories, marketing collateral and full agronomy support.
              </p>
              <div className="space-y-3">
                {["High margin structure", "Dedicated territory manager", "Co-branded marketing", "Tech & training support"].map((b) => (
                  <div key={b} className="flex items-center gap-3 text-sm">
                    <div className="size-6 rounded-full bg-lime-gradient grid place-items-center text-charcoal font-bold">✓</div>
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-dark rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-5">Quick enquiry</h3>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder="Your name" />
                <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder="Phone number" />
                <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder="District / State" />
                <button className="w-full px-5 py-3.5 rounded-xl bg-lime-gradient text-charcoal font-semibold hover:scale-[1.01] transition">
                  Apply Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE */}
      <section className="py-28 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">Knowledge Centre</div>
              <h2 className="text-4xl md:text-6xl font-bold">Insights from the <span className="text-gradient">field & lab</span></h2>
            </div>
            <Link to="/knowledge" className="inline-flex items-center gap-2 text-primary font-semibold">
              All articles <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <Link
                key={i}
                to="/knowledge"
                className="group block bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={a.img} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-wider text-leaf font-semibold mb-3">{a.tag}</div>
                  <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
