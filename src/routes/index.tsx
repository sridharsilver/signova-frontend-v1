import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, FlaskConical, Leaf, Atom, Droplets, Shield, Star, Quote, ChevronRight, PlayCircle, ChevronLeft } from "lucide-react";
import heroFarm from "@/assets/images/hero-farm.jpg";
import lab from "@/assets/images/lab.jpg";
import farmer from "@/assets/images/farmer.jpg";
import products from "@/assets/images/products.jpg";
import leaves from "@/assets/images/leaves.jpg";
import chilliImg from "@/assets/images/crops/chilli.png";
import paddyImg from "@/assets/images/crops/paddy.png";
import cottonImg from "@/assets/images/crops/cotton.png";
import mangoImg from "@/assets/images/crops/mango.png";
import tomatoImg from "@/assets/images/crops/tomato.png";
import citrusImg from "@/assets/images/crops/citrus.png";
import watermelonImg from "@/assets/images/crops/watermelon.png";
import cashewImg from "@/assets/images/crops/cashew.png";
import { Counter } from "@/components/common/Counter";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedArticles } from "./knowledge.$slug";
import { CROPS } from "@/data/crops";

const LOCAL_CROP_IMAGES: Record<string, string> = {
  chilli: chilliImg,
  paddy: paddyImg,
  cotton: cottonImg,
  mango: mangoImg,
  tomato: tomatoImg,
  citrus: citrusImg,
  watermelon: watermelonImg,
  cashew: cashewImg,
};

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

function HomePage() {
  const { t, language } = useLanguage();
  const [dbCrops, setDbCrops] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchCrops() {
      try {
        const { data, error } = await supabase
          .from("crops")
          .select("*")
          .order("slug", { ascending: true });
        if (!error && data && data.length > 0) {
          setDbCrops(data);
        }
      } catch (err) {
        console.warn("Failed to fetch crops for homepage:", err);
      }
    }
    fetchCrops();
  }, []);

  const stats = [
    { n: 100000, s: "+", l: t("home.stats.farmers") },
    { n: 3000, s: "+", l: t("home.stats.dealers") },
    { n: 300, s: "+", l: t("home.stats.products") },
    { n: 250, s: "+", l: t("home.stats.experts") },
  ];

  const categories = [
    { icon: Atom, title: t("home.categories.chelated.title"), desc: t("home.categories.chelated.desc"), grad: "from-leaf to-deep" },
    { icon: Shield, title: t("home.categories.protectors.title"), desc: t("home.categories.protectors.desc"), grad: "from-deep to-charcoal" },
    { icon: Sparkles, title: t("home.categories.nano.title"), desc: t("home.categories.nano.desc"), grad: "from-lime to-leaf" },
    { icon: Droplets, title: t("home.categories.bio.title"), desc: t("home.categories.bio.desc"), grad: "from-leaf to-lime" },
    { icon: Leaf, title: t("home.categories.organic.title"), desc: t("home.categories.organic.desc"), grad: "from-deep to-leaf" },
    { icon: FlaskConical, title: t("home.categories.specialty.title"), desc: t("home.categories.specialty.desc"), grad: "from-charcoal to-deep" },
  ];

  const cropsList = dbCrops || CROPS;
  const crops = cropsList.map((crop) => {
    const slug = crop.slug;
    const name = typeof crop.name === "object" && crop.name
      ? (crop.name[language] || crop.name["en"] || "")
      : t(`crops.cropsGrid.${crop.slug}` as any, crop.name);
    const note = typeof crop.note === "object" && crop.note
      ? (crop.note[language] || crop.note["en"] || "")
      : t(`crops.cropsGrid.${crop.slug}Note` as any, crop.note);
    const img = ("image_url" in crop && crop.image_url)
      ? crop.image_url
      : (LOCAL_CROP_IMAGES[slug.toLowerCase()] || ("img" in crop ? crop.img : "") || paddyImg);
    return { slug, name, note, img };
  });

  const stories = [
    { name: "Ramesh Patel", crop: t("home.testimonials.cottonGuj"), quote: t("home.testimonials.rameshQuote"), img: farmer },
    { name: "Lakshmi Devi", crop: t("home.testimonials.chilliAp"), quote: t("home.testimonials.lakshmiQuote"), img: farmer },
    { name: "Suresh Kumar", crop: t("home.testimonials.paddyTel"), quote: t("home.testimonials.sureshQuote"), img: farmer },
  ];

  const localizedArticles = getLocalizedArticles(language).slice(0, 3);

  const defaultHeroSettings = {
    layout: "minimalist",
    showSlideNumber: true,
    showControls: true,
    autoplayInterval: 5,
    slides: [
      {
        id: "default",
        title: "Redefining {Crop Nutrition} with Science & Innovation",
        subtitle: "Advanced micronutrients and crop solutions trusted by thousands of farmers across India.",
        eyebrow: "Science • Nutrition • Growth",
        image: heroFarm,
        primaryBtnText: "Explore Products",
        primaryBtnLink: "/products",
        secondaryBtnText: "Become a Distributor",
        secondaryBtnLink: "/distributor"
      }
    ]
  };

  const [heroSettings, setHeroSettings] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("signova_frontend_settings");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.hero && parsed.hero.slides && parsed.hero.slides.length > 0) {
            return parsed.hero;
          }
        }
      } catch (err) {
        console.warn("Failed to parse initial hero settings from cache", err);
      }
    }
    return {
      layout: null, // Start as null to prevent flashing minimalist layout on refresh!
      showSlideNumber: true,
      showControls: true,
      showControlsMobile: true,
      slides: defaultHeroSettings.slides
    };
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. Fetch Dynamic settings from Supabase
  useEffect(() => {
    async function fetchHeroSettings() {
      try {
        const { data, error } = await supabase
          .from("frontend_settings")
          .select("*")
          .eq("key", "hero")
          .single();

        if (error) {
          // Fallback to localStorage
          const local = localStorage.getItem("signova_frontend_settings");
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed.hero && parsed.hero.slides && parsed.hero.slides.length > 0) {
              setHeroSettings(parsed.hero);
              return;
            }
          }
          setHeroSettings(defaultHeroSettings);
        } else if (data && data.value && data.value.slides && data.value.slides.length > 0) {
          setHeroSettings(data.value);
          
          // Cache the fresh settings in localStorage to prevent FOUC / layout flash on future visits
          try {
            const localRaw = localStorage.getItem("signova_frontend_settings") || "{}";
            const parsed = JSON.parse(localRaw);
            parsed.hero = data.value;
            localStorage.setItem("signova_frontend_settings", JSON.stringify(parsed));
          } catch {
            localStorage.setItem("signova_frontend_settings", JSON.stringify({ hero: data.value }));
          }
        } else {
          setHeroSettings(defaultHeroSettings);
        }
      } catch (err) {
        console.warn("Failed to load dynamic hero settings, falling back.", err);
        setHeroSettings(defaultHeroSettings);
      }
    }

    fetchHeroSettings();
  }, []);

  // 2. Setup sliding interval (dynamic slide duration) when layout is 'slider'
  useEffect(() => {
    if (heroSettings.layout !== "slider" || heroSettings.slides.length <= 1) return;
    
    const duration = (heroSettings.autoplayInterval || 5) * 1000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSettings.slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [heroSettings.layout, heroSettings.slides.length, heroSettings.autoplayInterval]);

  const activeSlide = heroSettings.slides[currentSlide] || heroSettings.slides[0];

  const [bgImage, setBgImage] = useState<string>(() => {
    return activeSlide?.image || heroFarm;
  });

  // 3. Preload slide background images to prevent black-screen/flash on loading or 404 errors
  useEffect(() => {
    if (!activeSlide?.image) {
      setBgImage(heroFarm);
      return;
    }

    const img = new Image();
    img.src = activeSlide.image;
    img.onload = () => {
      setBgImage(activeSlide.image);
    };
    img.onerror = () => {
      setBgImage(heroFarm); // Fallback if image fails to load (e.g. 404)
    };
  }, [activeSlide?.image]);

  const renderTitle = (titleText: string) => {
    // 1. First, check if there are curly braces in the text.
    if (titleText.includes("{") && titleText.includes("}")) {
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
    }

    // 2. Backward compatibility fallback: if no braces, wrap "Crop Nutrition" automatically.
    if (titleText.includes("Crop Nutrition")) {
      const parts = titleText.split("Crop Nutrition");
      return (
        <>
          {parts[0]}
          <span className="text-gradient">Crop Nutrition</span>
          {parts[1]}
        </>
      );
    }

    return titleText;
  };

  const isDefault = activeSlide.id === "default";
  
  // Dynamically map seeded database strings or default slider texts to translation keys
  const slideTitle = isDefault || activeSlide.title === "Redefining {Crop Nutrition} with Science & Innovation"
    ? t("home.hero.title")
    : activeSlide.title;
    
  const slideSubtitle = isDefault || activeSlide.subtitle === "Advanced micronutrients and crop solutions trusted by thousands of farmers across India."
    ? t("home.hero.subtitle")
    : activeSlide.subtitle;
    
  const slideEyebrow = isDefault || activeSlide.eyebrow === "Science • Nutrition • Growth" || activeSlide.eyebrow === "Science \u2022 Nutrition \u2022 Growth"
    ? t("home.hero.eyebrow")
    : activeSlide.eyebrow;
    
  const primaryBtn = isDefault || activeSlide.primaryBtnText === "Explore Products"
    ? t("home.hero.explore")
    : activeSlide.primaryBtnText;
    
  const secondaryBtn = isDefault || activeSlide.secondaryBtnText === "Become a Distributor" || activeSlide.secondaryBtnText === "Become a Partner"
    ? t("home.hero.becomePartner")
    : activeSlide.secondaryBtnText;

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal pt-28 pb-36">
        
        {/* ANIMATED BACKGROUND SLIDES (Only for 'slider' and 'minimalist' layouts) */}
        {heroSettings.layout !== "split" && (
          <div className="absolute inset-0 z-0">
            <AnimatePresence>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                {/* Overlays - Minimalist gets a slightly darker, centered overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/80 to-charcoal/40" />
                {heroSettings.layout === "minimalist" && (
                  <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Floating background particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-2 rounded-full bg-lime/30 blur-sm z-10"
            style={{ left: `${(i * 83) % 100}%`, top: `${(i * 47) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full text-white z-20">
          
          {/* 0. PREMIUM HERO LOADING SKELETON (To prevent layout shift / flash on refresh!) */}
          {heroSettings.layout === null && (
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto py-12 space-y-8 animate-pulse">
              {/* Eyebrow Pill Shimmer */}
              <div className="h-7 w-48 bg-white/10 rounded-full" />
              {/* Title Shimmer */}
              <div className="space-y-3 w-full">
                <div className="h-14 sm:h-16 w-11/12 bg-white/10 rounded-2xl mx-auto" />
                <div className="h-14 sm:h-16 w-3/4 bg-white/10 rounded-2xl mx-auto" />
              </div>
              {/* Subtitle Shimmer */}
              <div className="space-y-2 w-full max-w-2xl pt-2">
                <div className="h-5 w-full bg-white/10 rounded-lg" />
                <div className="h-5 w-5/6 bg-white/10 rounded-lg mx-auto" />
              </div>
              {/* Buttons Shimmer */}
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <div className="h-14 w-40 bg-white/10 rounded-2xl" />
                <div className="h-14 w-44 bg-white/10 rounded-2xl" />
              </div>
            </div>
          )}

          {/* 1. MINIMALIST LAYOUT (Center-aligned Copy) */}
          {heroSettings.layout === "minimalist" && (
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.25em] text-lime mb-8"
              >
                <Sparkles className="size-3.5" /> {slideEyebrow}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight"
              >
                {renderTitle(slideTitle)}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-8 text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed"
              >
                {slideSubtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-4 justify-center"
              >
                {primaryBtn && (
                  <Link 
                    to={activeSlide.primaryBtnLink} 
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-lime-gradient text-charcoal font-semibold shadow-glow hover:scale-[1.02] transition cursor-pointer"
                  >
                    {primaryBtn}
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                  </Link>
                )}
                {secondaryBtn && (
                  <Link 
                    to={activeSlide.secondaryBtnLink} 
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl glass-dark text-white font-semibold hover:bg-white/10 transition cursor-pointer"
                  >
                    <PlayCircle className="size-5" /> {secondaryBtn}
                  </Link>
                )}
              </motion.div>
            </div>
          )}

          {/* 2. SPLIT SCREEN LAYOUT (50/50 Dual Column Grid) */}
          {heroSettings.layout === "split" && (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
              {/* Left Column Copy */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.25em] text-lime">
                  <Sparkles className="size-3.5" /> {slideEyebrow}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
                  {renderTitle(slideTitle)}
                </h1>

                <p className="text-lg text-white/70 leading-relaxed max-w-xl">
                  {slideSubtitle}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  {primaryBtn && (
                    <Link 
                      to={activeSlide.primaryBtnLink} 
                      className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-lime-gradient text-charcoal font-semibold shadow-glow hover:scale-[1.02] transition cursor-pointer"
                    >
                      {primaryBtn}
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                    </Link>
                  )}
                  {secondaryBtn && (
                    <Link 
                      to={activeSlide.secondaryBtnLink} 
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl glass-dark text-white font-semibold hover:bg-white/10 transition cursor-pointer"
                    >
                      <PlayCircle className="size-5" /> {secondaryBtn}
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Right Column Visual Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                {/* Glowing Background Blur */}
                <div className="absolute -inset-4 bg-lime/20 blur-3xl rounded-[2.5rem] z-0" />
                
                {/* Image Frame Card */}
                <div className="relative z-10 aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden border border-white/15 bg-charcoal/50 backdrop-blur-md group">
                  <img 
                    src={bgImage} 
                    alt={slideTitle} 
                    className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
                  />
                  {/* Subtle Card Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          )}

          {/* 3. DYNAMIC SLIDER LAYOUT (Cycling Full-bleed Carousel) */}
          {heroSettings.layout === "slider" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Pill Eyebrow */}
                {heroSettings.showSlideNumber !== false && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.25em] text-lime mb-8">
                    <Sparkles className="size-3.5" /> {slideEyebrow || `Slide ${currentSlide + 1} of ${heroSettings.slides.length}`}
                  </div>
                )}

                {/* Slide Header */}
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] max-w-5xl">
                  {renderTitle(slideTitle)}
                </h1>

                {/* Slide Subtitle */}
                <p className="mt-8 text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
                  {slideSubtitle}
                </p>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-wrap gap-4">
                  {primaryBtn && (
                    <Link 
                      to={activeSlide.primaryBtnLink} 
                      className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-lime-gradient text-charcoal font-semibold shadow-glow hover:scale-[1.02] transition cursor-pointer"
                    >
                      {primaryBtn}
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                    </Link>
                  )}
                  {secondaryBtn && (
                    <Link 
                      to={activeSlide.secondaryBtnLink} 
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl glass-dark text-white font-semibold hover:bg-white/10 transition cursor-pointer"
                    >
                      <PlayCircle className="size-5" /> {secondaryBtn}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>
        {/* Unified Slider Navigation Deck (Grouped at the bottom-center, stacked perfectly above the scroll indicator) */}
        {heroSettings.layout === "slider" && heroSettings.slides.length > 1 && heroSettings.showControls !== false && (
          <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 z-30 items-center gap-5 glass-dark px-4 py-2 rounded-full border border-white/10 shadow-glow-lime/5 flex ${
            heroSettings.showControlsMobile === false ? "mobile-controls-hidden" : ""
          }`}>
            {/* Previous Slide Chevron */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSettings.slides.length) % heroSettings.slides.length)}
              className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Navigation Dots */}
            <div className="flex gap-2">
              {heroSettings.slides.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    currentSlide === index ? "w-5 bg-lime" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Slide Chevron */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSettings.slides.length)}
              className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}

        {/* Scroll Indicator (Visible across ALL layout modes, centered at bottom of section) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40 text-xs uppercase tracking-[0.3em] z-30 pointer-events-none">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
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
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-4">{t("home.about.eyebrow")}</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {renderTitle(t("home.about.title"))}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {t("home.about.desc1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("home.about.desc2")}
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all cursor-pointer">
              {t("home.about.cta")} <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="py-28 bg-secondary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">{t("home.categories.eyebrow")}</div>
            <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(t("home.categories.title"))}</h2>
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
                <Link to="/products" className="relative inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all cursor-pointer">
                  {t("home.categories.learnMore")} <ChevronRight className="size-4" />
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
              <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">{t("home.crops.eyebrow")}</div>
              <h2 className="text-4xl md:text-6xl font-bold max-w-2xl">{renderTitle(t("home.crops.title"))}</h2>
            </div>
            <Link to="/crops" className="inline-flex items-center gap-2 text-primary font-semibold cursor-pointer">
              {t("home.crops.cta")} <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {crops.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Link to="/crops/$slug/nutrients" params={{ slug: c.slug }} className="absolute inset-0">
                  {/* Background Photo */}
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-5">
                    <p className="text-white/60 text-xs md:text-[10px] font-semibold tracking-[0.18em] uppercase mb-2 md:mb-1.5">
                      {c.note}
                    </p>
                    <div className="flex flex-col w-full">
                      <h3 className="text-white text-4xl md:text-2xl font-bold leading-tight">
                        {c.name}
                      </h3>
                      {/* View Programme — always visible on mobile, slides in on hover on desktop */}
                      <span className="flex items-center gap-1 text-white/80 text-sm md:text-xs font-medium hover:text-white transition-all duration-300 opacity-100 max-h-6 translate-y-0 mt-2 md:opacity-0 md:max-h-0 md:translate-y-1 md:mt-0 overflow-hidden self-end group-hover:opacity-100 group-hover:max-h-6 group-hover:translate-y-0 group-hover:mt-1.5">
                        View Programme <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Border ring */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />
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
            <div className="text-xs uppercase tracking-[0.25em] text-lime font-semibold mb-4">{t("home.innovation.eyebrow")}</div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {renderTitle(t("home.innovation.title"))}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
              {t("home.innovation.desc")}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: t("home.innovation.stats.iso"), v: t("home.innovation.stats.isoVal") },
                { k: t("home.innovation.stats.patents"), v: t("home.innovation.stats.patentsVal") },
                { k: t("home.innovation.stats.trials"), v: t("home.innovation.stats.trialsVal") },
                { k: t("home.innovation.stats.tests"), v: t("home.innovation.stats.testsVal") },
              ].map((x) => (
                <div key={x.k} className="glass-dark rounded-2xl p-5">
                  <div className="text-2xl font-bold text-gradient">{x.v}</div>
                  <div className="text-xs uppercase tracking-wider text-white/60 mt-1">{x.k}</div>
                </div>
              ))}
            </div>
            <Link to="/innovation" className="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-2xl bg-lime-gradient text-charcoal font-semibold cursor-pointer">
              {t("home.innovation.cta")} <ArrowRight className="size-4" />
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
            <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">{t("home.testimonials.eyebrow")}</div>
            <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(t("home.testimonials.title"))}</h2>
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
              <div className="text-xs uppercase tracking-[0.25em] text-lime font-semibold mb-4">{t("home.distributorCta.eyebrow")}</div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                {renderTitle(t("home.distributorCta.title"))}
              </h2>
              <p className="text-white/75 mb-8 max-w-md">
                {t("home.distributorCta.desc")}
              </p>
              <div className="space-y-3">
                {[
                  t("home.distributorCta.bullet1"),
                  t("home.distributorCta.bullet2"),
                  t("home.distributorCta.bullet3"),
                  t("home.distributorCta.bullet4")
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3 text-sm">
                    <div className="size-6 rounded-full bg-lime-gradient grid place-items-center text-charcoal font-bold">✓</div>
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-dark rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-5">{t("home.distributorCta.enquiryTitle")}</h3>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("home.distributorCta.namePlaceholder")} />
                <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("home.distributorCta.phonePlaceholder")} />
                <input className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm border border-white/15 placeholder:text-white/50 focus:outline-none focus:border-lime" placeholder={t("home.distributorCta.locationPlaceholder")} />
                <button className="w-full px-5 py-3.5 rounded-xl bg-lime-gradient text-charcoal font-semibold hover:scale-[1.01] transition cursor-pointer">
                  {t("home.distributorCta.submit")}
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
              <div className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold mb-3">{t("home.knowledge.eyebrow")}</div>
              <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(t("home.knowledge.title"))}</h2>
            </div>
            <Link to="/knowledge" className="inline-flex items-center gap-2 text-primary font-semibold cursor-pointer">
              {t("home.knowledge.cta")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {localizedArticles.map((a, i) => (
              <Link
                key={i}
                to="/knowledge/$slug"
                params={{ slug: a.slug }}
                className="group block bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition hover:-translate-y-1 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={a.img} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-wider text-leaf font-semibold mb-3">{a.tag}</div>
                  <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition leading-relaxed">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
