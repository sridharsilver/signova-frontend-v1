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
import { getCropBySlug, getDeficienciesForCrop, type Deficiency } from "@/data/crops";

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

export const Route = createFileRoute("/crops_/$slug/nutrients")({
  loader: ({ params }) => {
    const crop = getCropBySlug(params.slug);
    if (!crop) throw notFound();
    const deficiencies = getDeficienciesForCrop(params.slug);
    return { crop, deficiencies };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.crop.name ?? "Crop";
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

  return (
    <>
      <PageHero
        eyebrow="Nutrient Management"
        title={`${crop.name} Nutrient Management`}
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
          {deficiencies.map((d: Deficiency, i: number) => (
            <a
              key={d.name}
              href={`#${slugify(d.name)}`}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${ACCENTS[i].ring} ${ACCENTS[i].chip} hover:scale-[1.03] transition-transform`}
            >
              <span className="font-mono opacity-80">{ACCENTS[i].symbol}</span>
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
              Common deficiencies in <span className="text-primary">{crop.name.toLowerCase()}</span> &amp; how to fix them
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Spot symptoms early, understand the impact on yield and quality, and apply the matched Signova
              product through foliar spray, soil or drip — all in one place.
            </p>
          </div>

          <div className="space-y-16">
            {deficiencies.map((d: Deficiency, i: number) => (
              <DeficiencyCard key={d.name} d={d} index={i} accent={ACCENTS[i]} />
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
                  {" "}{crop.name.toLowerCase()} crop within 24 hours.
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
  accent,
}: {
  d: Deficiency;
  index: number;
  accent: Accent;
}) {
  const reverse = index % 2 === 1;
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
              Deficiency 0{index + 1} / {String(4).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Content side */}
        <div className="p-8 md:p-12">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {d.name}
          </h3>
          <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-emerald-400" />

          {/* Symptoms / Affect — warning column */}
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
