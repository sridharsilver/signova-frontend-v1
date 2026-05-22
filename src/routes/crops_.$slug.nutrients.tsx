import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Leaf,
  FlaskConical,
  Sprout,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageShell";
import { getCropBySlug, getDeficienciesForCrop } from "@/data/crops";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/lib/supabase";

import chilliImg from "@/assets/images/crops/chilli.png";
import paddyImg from "@/assets/images/crops/paddy.png";
import cottonImg from "@/assets/images/crops/cotton.png";
import mangoImg from "@/assets/images/crops/mango.png";
import tomatoImg from "@/assets/images/crops/tomato.png";
import citrusImg from "@/assets/images/crops/citrus.png";
import watermelonImg from "@/assets/images/crops/watermelon.png";
import cashewImg from "@/assets/images/crops/cashew.png";

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

type Accent = {
  symbol: string;
  ring: string; // ring color class
  chip: string; // chip background
  glow: string; // soft glow gradient
};

const ACCENTS: Accent[] = [
  { symbol: "Mg", ring: "ring-emerald-500/30", chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", glow: "from-emerald-500/20 via-emerald-500/5 to-transparent" },
  { symbol: "S",  ring: "ring-amber-500/30",   chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",     glow: "from-amber-500/20 via-amber-500/5 to-transparent" },
  { symbol: "Zn", ring: "ring-sky-500/30",     chip: "bg-sky-500/10 text-sky-600 dark:text-sky-400",         glow: "from-sky-500/20 via-sky-500/5 to-transparent" },
  { symbol: "B",  ring: "ring-rose-500/30",    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",       glow: "from-rose-500/20 via-rose-500/5 to-transparent" },
];

function getAccent(symbol: string, index: number): Accent {
  const normalized = symbol.trim().toLowerCase();
  const match = ACCENTS.find(a => a.symbol.toLowerCase() === normalized);
  if (match) return match;
  
  if (normalized === "n" || normalized === "nitrogen") {
    return { symbol, ring: "ring-blue-500/30", chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400", glow: "from-blue-500/20 via-blue-500/5 to-transparent" };
  }
  if (normalized === "p" || normalized === "phosphorus") {
    return { symbol, ring: "ring-purple-500/30", chip: "bg-purple-500/10 text-purple-600 dark:text-purple-400", glow: "from-purple-500/20 via-purple-500/5 to-transparent" };
  }
  if (normalized === "k" || normalized === "potassium") {
    return { symbol, ring: "ring-orange-500/30", chip: "bg-orange-500/10 text-orange-600 dark:text-orange-400", glow: "from-orange-500/20 via-orange-500/5 to-transparent" };
  }
  if (normalized === "ca" || normalized === "calcium") {
    return { symbol, ring: "ring-teal-500/30", chip: "bg-teal-500/10 text-teal-600 dark:text-teal-400", glow: "from-teal-500/20 via-teal-500/5 to-transparent" };
  }
  if (normalized === "fe" || normalized === "iron") {
    return { symbol, ring: "ring-amber-700/30", chip: "bg-amber-700/10 text-amber-700 dark:text-amber-500", glow: "from-amber-700/20 via-amber-700/5 to-transparent" };
  }
  if (normalized === "mn" || normalized === "manganese") {
    return { symbol, ring: "ring-fuchsia-500/30", chip: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400", glow: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent" };
  }
  
  const fallback = ACCENTS[index % ACCENTS.length];
  return { ...fallback, symbol };
}

export const Route = createFileRoute("/crops_/$slug/nutrients")({
  loader: async ({ params }) => {
    try {
      const { data: cropData, error: cropError } = await supabase
        .from("crops")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();

      if (cropError) throw cropError;

      if (cropData) {
        const { data: defData, error: defError } = await supabase
          .from("crop_deficiencies")
          .select("*")
          .eq("crop_id", cropData.id)
          .order("sort_order", { ascending: true });

        if (defError) throw defError;

        return {
          crop: cropData,
          deficiencies: defData || [],
        };
      }
    } catch (e) {
      console.warn("Failed to fetch crop nutrients from Supabase, falling back to static data:", e);
    }

    const staticCrop = getCropBySlug(params.slug);
    if (!staticCrop) throw notFound();
    const staticDeficiencies = getDeficienciesForCrop(params.slug);
    return {
      crop: staticCrop,
      deficiencies: staticDeficiencies,
    };
  },
  head: ({ loaderData }) => {
    let lang = "en";
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("signova_chat_lang");
        if (saved && ["en", "hi", "te", "gu", "mr", "ta", "kn"].includes(saved)) {
          lang = saved;
        }
      } catch {}
    }

    const crop = loaderData?.crop;
    let name = "Crop";
    if (crop) {
      if (typeof crop.name === "object" && crop.name) {
        name = (crop.name as any)[lang] || (crop.name as any)["en"] || "Crop";
      } else {
        name = crop.name;
      }
    }

    const title = `${name} Nutrient Management — Signova Group`;
    const description = `Stage-wise nutrient deficiency guide for ${name}: symptoms, affects and recommended Signova solutions.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CropNutrients,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="max-w-2xl mx-auto p-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="px-5 py-2 rounded-lg bg-primary text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto p-12 text-center">
      <h2 className="text-3xl font-bold mb-3">Crop not found</h2>
      <p className="text-muted-foreground mb-6">We don't have nutrient information for this crop yet.</p>
      <Link to="/crops" className="inline-flex px-5 py-2 rounded-lg bg-primary text-primary-foreground">
        Back to Crops
      </Link>
    </div>
  ),
});

function CropNutrients() {
  const { crop, deficiencies } = Route.useLoaderData();
  const { t, language } = useLanguage();

  const cropName = typeof crop.name === "object" && crop.name
    ? ((crop.name as any)[language] || (crop.name as any)["en"] || "")
    : t(`crops.cropsGrid.${crop.slug}` as any, crop.name);

  const localizedDeficiencies = deficiencies.map((d: any, i: number) => {
    const name = typeof d.name === "object" && d.name
      ? (d.name[language] || d.name["en"] || "")
      : d.name;
    const symptoms = typeof d.symptoms === "object" && d.symptoms
      ? (d.symptoms[language] || d.symptoms["en"] || "")
      : d.symptoms;
    const affect = typeof d.affect === "object" && d.affect
      ? (d.affect[language] || d.affect["en"] || "")
      : d.affect;
    const product = typeof d.product === "object" && d.product
      ? (d.product[language] || d.product["en"] || "")
      : d.product;
    const soilDrip = typeof d.soil_drip === "object" && d.soil_drip
      ? (d.soil_drip[language] || d.soil_drip["en"] || "")
      : (typeof d.soilDrip === "object" && d.soilDrip
          ? (d.soilDrip[language] || d.soilDrip["en"] || "")
          : (d.soil_drip || d.soilDrip || ""));
    const benefit = typeof d.benefit === "object" && d.benefit
      ? (d.benefit[language] || d.benefit["en"] || "")
      : d.benefit;
    
    const cropImg = ("image_url" in crop && crop.image_url)
      ? crop.image_url
      : (LOCAL_CROP_IMAGES[crop.slug.toLowerCase()] || paddyImg);

    const img = ("image_url" in d && d.image_url)
      ? d.image_url
      : (d.img || cropImg);

    const symbol = d.nutrient_symbol || d.nutrientSymbol || "Mg";
    const accent = getAccent(symbol, i);

    return {
      name,
      symptoms,
      affect,
      product,
      soilDrip,
      benefit,
      nutrientSymbol: symbol,
      accent,
      img,
    };
  });

  return (
    <>
      <PageHero
        eyebrow="Nutrient Management"
        title={`${cropName} Nutrient Management`}
        subtitle="Identify nutrient deficiencies in the field and apply the right Signova solution at the right stage."
      />

      {/* Quick-nav strip */}
      <section className="border-b border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-md sticky top-20 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
          <Link
            to="/crops"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
          >
            <ArrowLeft className="size-4" /> All crops
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground hidden md:inline">
            Jump to ·
          </span>
          {localizedDeficiencies.map((d, i: number) => (
            <a
              key={d.name}
              href={`#${slugify(d.name)}`}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${d.accent.ring} ${d.accent.chip} hover:scale-[1.03] transition-transform`}
            >
              <span className="font-mono opacity-80">{d.accent.symbol}</span>
              {d.name.replace(" Deficiency", "")}
            </a>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full bg-lime-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 size-[420px] rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Intro line */}
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-xs uppercase tracking-[0.18em] text-accent-foreground mb-4">
              <Sparkles className="size-3.5" /> Field Reference
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Common deficiencies in <span className="text-primary">{cropName.toLowerCase()}</span> &amp; how to fix them
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Spot symptoms early, understand the impact on yield and quality, and apply the matched Signova
              product through foliar spray, soil or drip — all in one place.
            </p>
          </div>

          <div className="space-y-16">
            {localizedDeficiencies.map((d, i: number) => (
              <DeficiencyCard key={d.name} d={d} index={i} totalCount={localizedDeficiencies.length} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary via-emerald-800 to-emerald-950 p-10 md:p-14 text-primary-foreground">
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-lime-500/10 blur-3xl" />
            <div className="relative grid md:grid-cols-[1.6fr_1fr] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs uppercase tracking-[0.18em] mb-4">
                  <ShieldCheck className="size-3.5" /> Trusted by 100,000+ farmers
                </div>
                <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                  Not sure which deficiency you're seeing?
                </h3>
                <p className="mt-3 text-primary-foreground/80 max-w-xl">
                  Send a photo of your field to our agronomist — get a personalised spray schedule for your
                  {" "}{cropName.toLowerCase()} crop within 24 hours.
                </p>
              </div>
              <div className="flex md:justify-end">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-6 py-3 font-semibold hover:bg-white/95 hover:translate-x-0.5 transition-all shadow-lg"
                >
                  Talk to an agronomist <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DeficiencyCard({
  d,
  index,
  totalCount,
}: {
  d: any;
  index: number;
  totalCount: number;
}) {
  const reverse = index % 2 === 1;
  const accent = d.accent;
  return (
    <article
      id={slugify(d.name)}
      className="group relative scroll-mt-40 transition-all duration-300"
    >
      {/* Big numeric step in background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-0 md:-left-6 text-[8rem] md:text-[10rem] font-bold leading-none text-foreground/[0.04] select-none"
      >
        0{index + 1}
      </div>

      <div
        className={`relative grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow ${
          reverse ? "md:[&>div:first-child]:order-2" : ""
        }`}
      >
        {/* Image side */}
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden bg-muted">
          <div className={`absolute inset-0 bg-gradient-to-br ${accent.glow} mix-blend-screen`} />
          <img
            src={d.img}
            alt={d.name}
            loading="lazy"
            width={900}
            height={900}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Floating nutrient symbol */}
          <div className="absolute top-5 left-5 flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${accent.ring} ${accent.chip} hover:scale-[1.03] transition-transform`}>
              {accent.symbol}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-background/60 backdrop-blur border border-border text-xs font-semibold">
              Deficiency 0{index + 1} / {String(totalCount).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Content side */}
        <div className="p-8 md:p-12">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {d.name}
          </h3>
          <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-emerald-400" />

          {/* Symptoms / Affects — warning column */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <InfoTile
              icon={<AlertTriangle className="size-4" />}
              label="Symptoms"
              tone="warning"
              value={d.symptoms}
            />
            <InfoTile
              icon={<Leaf className="size-4" />}
              label="Affects"
              tone="warning"
              value={d.affect}
            />
          </div>

          {/* Solution block */}
          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white">
                <CheckCircle2 className="size-4" />
              </div>
              <h4 className="text-xl font-bold">Signova Solution</h4>
            </div>

            <div className="space-y-4">
              <SolutionRow
                icon={<FlaskConical className="size-4" />}
                label="Foliar / Product"
                value={d.product}
              />
              <SolutionRow
                icon={<Sprout className="size-4" />}
                label="Soil &amp; Drip"
                value={d.soilDrip}
              />
              <SolutionRow
                icon={<Sparkles className="size-4" />}
                label="Benefit"
                value={d.benefit}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "warning" | "default";
}) {
  const toneCls =
    tone === "warning"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20"
      : "bg-muted text-foreground ring-border";
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-5">
      <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneCls}`}>
        {icon} {label}
      </div>
      <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{value}</p>
    </div>
  );
}

function SolutionRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`shrink-0 mt-0.5 size-8 rounded-lg flex items-center justify-center ${
          highlight ? "bg-gradient-to-br from-primary to-emerald-500 text-white" : "bg-background border border-border text-foreground/80"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" dangerouslySetInnerHTML={{ __html: label }} />
        <p className="text-foreground/90 leading-relaxed text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-");
}
