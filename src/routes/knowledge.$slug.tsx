import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { Clock, ArrowLeft } from "lucide-react";
import heroFarm from "@/assets/images/hero-farm.jpg";
import lab from "@/assets/images/lab.jpg";
import leaves from "@/assets/images/leaves.jpg";
import farmer from "@/assets/images/farmer.jpg";

type Article = {
  slug: string;
  tag: string;
  title: string;
  img: string;
  time: string;
  excerpt: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "zinc-deficiency-paddy-yield",
    tag: "Nutrition",
    title: "Why zinc deficiency silently caps your paddy yield",
    img: leaves,
    time: "5 min read",
    excerpt: "Zinc is the most widespread micronutrient deficiency in Indian paddy soils — and the easiest to fix.",
    body: [
      "Across India's rice belt, zinc deficiency quietly trims 15–40% of potential yield long before farmers spot any visible symptom. The plant simply slows down: tillers thin out, panicles shorten, and grain filling stalls.",
      "Soil tests across Punjab, Haryana, UP and Bihar show that more than 50% of paddy fields are zinc deficient. Continuous flooding, heavy phosphate use and intensive cropping have stripped soils of available Zn.",
      "A foliar spray of chelated Zn-EDTA (0.5%) at tillering and panicle initiation reverses deficiency within 7–10 days. Pair with soil-applied zinc sulphate at transplanting for season-long protection.",
      "Farmers using a structured zinc program report 8–12 quintals/acre yield uplift and noticeably better grain lustre at the mandi.",
    ],
  },
  {
    slug: "chilli-micronutrient-plan",
    tag: "Guide",
    title: "A 7-step micronutrient plan for chilli farmers",
    img: heroFarm,
    time: "8 min read",
    excerpt: "From nursery to harvest — a week-by-week nutrient calendar built for Andhra and Telangana chilli growers.",
    body: [
      "Chilli is one of the most micronutrient-hungry crops in Indian agriculture. Boron, calcium and zinc deficiencies cause flower drop, fruit cracking and blossom-end rot — three of the biggest yield killers.",
      "Step 1 (Nursery): Drench with humic acid + Zn-EDTA to build strong root architecture.",
      "Step 2 (Transplant +15 days): Foliar spray of Agrimax F-4 at 2 g/L to deliver a balanced micronutrient mix.",
      "Step 3 (Vegetative): Apply boron + calcium nitrate to prevent flower abortion.",
      "Step 4 (Flowering): Switch to a bloom-stage NPK 13-40-13 with chelated micros.",
      "Step 5 (Fruit set): Boron foliar spray every 12 days reduces cracking by up to 60%.",
      "Step 6 (Fruit development): Potassium-rich foliar (0-0-50) improves colour and pungency.",
      "Step 7 (Pre-harvest): A final calcium spray locks in shelf life for the long journey to Guntur market.",
    ],
  },
  {
    slug: "nano-urea-smaller-bigger-harvest",
    tag: "Innovation",
    title: "Nano urea: smaller particle, bigger harvest",
    img: lab,
    time: "6 min read",
    excerpt: "How nano-scale nitrogen is replacing 50 kg bags with 500 ml bottles — and what it means for your soil.",
    body: [
      "Conventional urea loses 30–50% of its nitrogen to volatilisation, leaching and denitrification. Nano urea — particles smaller than 100 nanometres — is absorbed directly through leaf stomata, achieving 80%+ utilisation.",
      "One 500 ml bottle of nano urea (4% N) replaces a full 45 kg bag of conventional urea. That's a 50× reduction in transport, packaging and storage footprint.",
      "Field trials across 11,000 locations show comparable or superior yields in wheat, paddy and maize — with measurable improvements in grain protein content.",
      "Best practice: apply two foliar sprays of 4 ml/L, one at active tillering and another at panicle/flag-leaf stage. Always pair with a baseline soil application of organic carbon to protect long-term fertility.",
    ],
  },
  {
    slug: "iron-chlorosis-citrus",
    tag: "Crop Care",
    title: "Identifying iron chlorosis in citrus orchards",
    img: leaves,
    time: "4 min read",
    excerpt: "Yellow leaves with green veins? Your orange and lemon trees are screaming for iron.",
    body: [
      "Iron chlorosis shows up first on the youngest leaves: the leaf blade turns pale yellow while the veins stay sharply green. In severe cases the entire canopy bleaches and fruit size collapses.",
      "The cause is rarely a lack of iron in the soil — it's a lack of available iron. High pH, free lime and waterlogging all lock iron into forms the root cannot absorb.",
      "The fastest fix is a foliar spray of Fe-EDDHA (0.1%) — the only chelate stable above pH 7.5. Two sprays, 15 days apart, restore green colour within a fortnight.",
      "For a long-term solution, apply Fe-EDDHA to the root zone via drip at flowering, and improve drainage to break the waterlogging cycle that triggers chlorosis in the first place.",
    ],
  },
  {
    slug: "vidarbha-cotton-lint-quality",
    tag: "Story",
    title: "How a Vidarbha farmer doubled cotton lint quality",
    img: farmer,
    time: "7 min read",
    excerpt: "Ramrao Patil's 8-acre cotton plot in Yavatmal went from staple-length 26 mm to 32 mm in two seasons. Here's how.",
    body: [
      "When Ramrao first met our agronomist in 2023, his cotton was fetching ₹6,200/quintal — well below the premium grades clearing ₹7,500. The problem wasn't yield; it was lint quality.",
      "Soil analysis revealed acute boron and potassium deficiency, plus low organic carbon (0.34%). The fibre was breaking short because the boll wasn't getting the K it needed during fibre elongation.",
      "We introduced a three-stage program: humic acid + Zn at sowing, boron + Ca at squaring, and weekly K-foliar from boll formation through opening.",
      "By season 2, his staple length tested at 32.1 mm and micronaire at 4.2 — premium export grade. Procurement agents now visit his farm directly. His net realisation jumped 38% on the same 8 acres.",
    ],
  },
  {
    slug: "edta-vs-dtpa-chelate",
    tag: "Science",
    title: "EDTA vs DTPA: choosing the right chelate",
    img: lab,
    time: "9 min read",
    excerpt: "The chelate matters as much as the metal. A quick guide to picking the right one for your soil pH.",
    body: [
      "A chelate is a molecular cage that protects a micronutrient ion from getting locked up in the soil. But different chelates work in different pH windows — using the wrong one wastes money.",
      "EDTA is the workhorse: cheap, effective from pH 4 to 6.5. Ideal for acidic red soils of South India and most foliar applications where pH is buffered by the spray solution.",
      "DTPA holds metals stable up to pH 7.5 — the sweet spot for the slightly alkaline alluvial soils of the Indo-Gangetic plain. Costs more, but pays back in higher availability.",
      "EDDHA is the only chelate that remains stable above pH 8.0. Reserve it for calcareous soils where free lime would otherwise destroy any other chelate within hours.",
      "Rule of thumb: test your soil pH first, then pick the chelate. A perfectly formulated foliar spray with the wrong chelate can deliver less than 20% of its nutrient to the plant.",
    ],
  },
];

export const Route = createFileRoute("/knowledge/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData?.article
      ? {
          meta: [
            { title: `${loaderData.article.title} — Signova Knowledge Centre` },
            { name: "description", content: loaderData.article.excerpt },
            { property: "og:title", content: loaderData.article.title },
            { property: "og:description", content: loaderData.article.excerpt },
            { property: "og:image", content: loaderData.article.img },
          ],
        }
      : {},
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl mb-3">Article not found</h1>
        <Link to="/knowledge" className="text-primary font-semibold underline">
          Back to Knowledge Centre
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <p className="text-destructive mb-3">{error.message}</p>
        <Link to="/knowledge" className="text-primary font-semibold underline">
          Back to Knowledge Centre
        </Link>
      </div>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <article className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-8"
        >
          <ArrowLeft className="size-4" />
          Knowledge Centre
        </Link>

        <div className="flex items-center gap-3 text-xs uppercase tracking-wider mb-4">
          <span className="text-leaf font-semibold">{article.tag}</span>
          <span className="text-muted-foreground inline-flex items-center gap-1">
            <Clock className="size-3" />
            {article.time}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-card mb-12">
          <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground/90 leading-relaxed">
          {article.body.map((para: string, i: number) => (
            <p key={i} className="text-base md:text-lg">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/70 text-sm font-semibold transition"
          >
            <ArrowLeft className="size-4" />
            More articles
          </Link>
        </div>
      </div>
    </article>
  );
}
