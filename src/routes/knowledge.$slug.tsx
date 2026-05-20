import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { Clock, ArrowLeft } from "lucide-react";
import heroFarm from "@/assets/images/hero-farm.jpg";
import lab from "@/assets/images/lab.jpg";
import leaves from "@/assets/images/leaves.jpg";
import farmer from "@/assets/images/farmer.jpg";
import { useLanguage } from "@/hooks/use-language";

type Article = {
  slug: string;
  tag: string;
  title: string;
  img: string;
  time: string;
  excerpt: string;
  body: string[];
};

export const getLocalizedArticles = (lang: string): Article[] => {
  const isHi = lang === "hi";
  const isTe = lang === "te";
  const isTa = lang === "ta";
  const isKn = lang === "kn";
  const isMr = lang === "mr";
  const isGu = lang === "gu";

  return [
    {
      slug: "zinc-deficiency-paddy-yield",
      tag: isTe ? "పోషకాలు" : isHi ? "पोषण" : isTa ? "ஊட்டச்சத்து" : isKn ? "ಪೋಷಕಾಂಶ" : isMr ? "पोषण" : isGu ? "પોષણ" : "Nutrition",
      title: isTe 
        ? "వరి దిగుబడిని దెబ్బతీసే జింక్ లోపం" 
        : isHi 
        ? "धान की उपज में जिंक की कमी से होने वाला नुकसान"
        : isTa
        ? "நெல் மகசூலில் துத்தநாகக் குறைபாடு ஏன் ஏற்படுகிறது"
        : isKn
        ? "ಭತ್ತದ ಇಳುವರಿಯಲ್ಲಿ ಸತು ಕೊರತೆ ಮತ್ತು ಪರಿಹಾರ"
        : isMr
        ? "भाताच्या उत्पादनात जस्ताची कमतरता का होते"
        : isGu
        ? "ડાંગરના પાકમાં ઝીંકની ઉણપ અને તેની અસરો"
        : "Why zinc deficiency silently caps your paddy yield",
      img: leaves,
      time: isTe ? "5 నిమిషాల చదువు" : isHi ? "5 मिनट का पठन" : "5 min read",
      excerpt: isTe
        ? "భారతదేశంలోని వరి పండించే నేలల్లో జింక్ లోపం అతిపెద్ద సమస్య — మరియు దీనిని చాలా సులభంగా నివారించవచ్చు."
        : isHi
        ? "भारतीय धान की मिट्टी में जिंक की सबसे व्यापक सूक्ष्म पोषक तत्व कमी है — और इसे ठीक करना सबसे आसान है।"
        : "Zinc is the most widespread micronutrient deficiency in Indian paddy soils — and the easiest to fix.",
      body: isTe ? [
        "భారతదేశ వరి బెల్ట్ అంతటా, జింక్ లోపం వల్ల పంటకు ఎలాంటి స్పష్టమైన లక్షణాలు కనిపించకముందే దిగుబడి 15-40% వరకు తగ్గిపోతుంది. మొక్క పెరుగుదల మందగిస్తుంది: పిలకలు రావడం తగ్గుతుంది, వెన్నులు చిన్నగా ఉంటాయి మరియు గింజ కట్టడం ఆగిపోతుంది.",
        "నేల పరీక్షల్లో 50% పైగా వరి పొలాల్లో జింక్ లోపం ఉన్నట్లు తేలింది. నిరంతరం నీరు నిలవడం, ఎక్కువ ఫాస్ఫేట్ వాడకం మరియు సాంద్ర వ్యవసాయం వల్ల నేలలో జింక్ కరిగిపోతోంది.",
        "పిలక దశలో మరియు వెన్ను దశలో చేలేటెడ్ జింక్-EDTA (0.5%) పిచికారీ చేయడం వల్ల 7-10 రోజుల్లో లోపం నయమవుతుంది. నాటు వేసే సమయంలో నేలలో జింక్ సల్ఫేట్ వేయడం వల్ల దీర్ఘకాలిక రక్షణ లభిస్తుంది.",
        "సక్రమంగా జింక్ వాడిన రైతులు ఎకరాకు 8-12 క్వింటాళ్ల వరకు అదనపు దిగుబడి మరియు మార్కెట్లో గింజకు మంచి నాణ్యత, మెరుపు పొందుతున్నారు."
      ] : isHi ? [
        "पूरे भारत के धान क्षेत्र में, जिंक की कमी से होने वाला नुकसान दिखने से बहुत पहले ही फसल की उपज में १५ से ४०% तक की भारी कमी हो जाती है। पौधा बस धीमा हो जाता है: कल्ले पतले हो जाते हैं, बालियाँ छोटी रह जाती हैं और दाने भरना रुक जाता है।",
        "पंजाब, हरियाणा, उत्तर प्रदेश और बिहार के मृदा परीक्षण बताते हैं कि ५०% से अधिक धान के खेत जिंक की कमी से प्रभावित हैं। लगातार पानी भरना, फॉस्फेट उर्वरकों का भारी उपयोग और सघन खेती से मिट्टी का जिंक समाप्त हो गया है।",
        "कल्ले निकलते समय और बाली बनते समय चिलेटेड जिंक-ईडीटीए (Zn-EDTA 12%) का छिड़काव करने से फसल में कमी ७ से १० दिनों में ठीक हो जाती है। रोपाई के समय मिट्टी में जिंक सल्फेट डालने से फसल की सुरक्षा लंबे समय तक बनी रहती है।",
        "एक संरचित जिंक पोषण कार्यक्रम अपनाने वाले किसान प्रति एकड़ ८ से १२ क्विंटल की अतिरिक्त पैदावार और मंडी में अनाज की बेहतर चमक रिपोर्ट करते हैं।"
      ] : [
        "Across India's rice belt, zinc deficiency quietly trims 15–40% of potential yield long before farmers spot any visible symptom. The plant simply slows down: tillers thin out, panicles shorten, and grain filling stalls.",
        "Soil tests across Punjab, Haryana, UP and Bihar show that more than 50% of paddy fields are zinc deficient. Continuous flooding, heavy phosphate use and intensive cropping have stripped soils of available Zn.",
        "A foliar spray of chelated Zn-EDTA (0.5%) at tillering and panicle initiation reverses deficiency within 7–10 days. Pair with soil-applied zinc sulphate at transplanting for season-long protection.",
        "Farmers using a structured zinc program report 8–12 quintals/acre yield uplift and noticeably better grain lustre at the mandi."
      ],
    },
    {
      slug: "chilli-micronutrient-plan",
      tag: isTe ? "గైడ్" : isHi ? "मार्गदर्शिका" : "Guide",
      title: isTe
        ? "మిర్చి రైతుల కోసం 7-దశల సూక్ష్మపోషకాల ప్రణాళిక"
        : isHi
        ? "मिर्च के किसानों के लिए ७-चरणीय सूक्ष्म पोषक तत्व योजना"
        : "A 7-step micronutrient plan for chilli farmers",
      img: heroFarm,
      time: "8 min read",
      excerpt: isTe
        ? "నారుమడి నుండి కోత వరకు — ఆంధ్ర మరియు తెలంగాణ మిర్చి రైతులకు ఉపయోగపడే వీక్లీ న్యూట్రియంట్ క్యాలెండర్."
        : isHi
        ? "नर्सरी से लेकर कटाई तक — आंध्र और तेलंगाना के मिर्च उत्पादकों के लिए तैयार की गई साप्ताहिक पोषण तालिका।"
        : "From nursery to harvest — a week-by-week nutrient calendar built for Andhra and Telangana chilli growers.",
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
      tag: isTe ? "ఆవిష్కరణ" : isHi ? "नवाचार" : "Innovation",
      title: isTe
        ? "నానో యూరియా: చిన్న పరిమాణం, పెద్ద పంట"
        : isHi
        ? "नैनो यूरिया: छोटा कण, बड़ी फसल"
        : "Nano urea: smaller particle, bigger harvest",
      img: lab,
      time: "6 min read",
      excerpt: isTe
        ? "నానో-నత్రజని సాంకేతికతతో 50 కిలోల బస్తాల స్థానంలో 500 మిలీ సీసా ఎలా వాడుకోవచ్చు."
        : isHi
        ? "कैसे नैनो-पैमाने का नाइट्रोजन ५० किलोग्राम के बैग को ५०० मिलीलीटर की बोतलों से बदल रहा है।"
        : "How nano-scale nitrogen is replacing 50 kg bags with 500 ml bottles — and what it means for your soil.",
      body: [
        "Conventional urea loses 30–50% of its nitrogen to volatilisation, leaching and denitrification. Nano urea — particles smaller than 100 nanometres — is absorbed directly through leaf stomata, achieving 80%+ utilisation.",
        "One 500 ml bottle of nano urea (4% N) replaces a full 45 kg bag of conventional urea. That's a 50× reduction in transport, packaging and storage footprint.",
        "Field trials across 11,000 locations show comparable or superior yields in wheat, paddy and maize — with measurable improvements in grain protein content.",
        "Best practice: apply two foliar sprays of 4 ml/L, one at active tillering and another at panicle/flag-leaf stage. Always pair with a baseline soil application of organic carbon to protect long-term fertility.",
      ],
    },
  ];
};

export const Route = createFileRoute("/knowledge/$slug")({
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const slug = loaderData?.slug;
    if (!slug) return {};

    let lang = "en";
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("signova_chat_lang");
        if (saved && ["en", "hi", "te", "gu", "mr", "ta", "kn"].includes(saved)) {
          lang = saved;
        }
      } catch {}
    }

    const article = getLocalizedArticles(lang).find((a) => a.slug === slug);
    if (!article) {
      return {
        meta: [
          { title: "Article Not Found — Signova Knowledge Centre" },
        ],
      };
    }

    return {
      meta: [
        { title: `${article.title} — Signova Knowledge Centre` },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt },
        { property: "og:image", content: article.img },
      ],
    };
  },
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
  const { slug } = Route.useLoaderData();
  const { t, language } = useLanguage();
  
  const article = getLocalizedArticles(language).find((a) => a.slug === slug);
  
  if (!article) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl mb-3">{t("knowledge.catalog.backToList")}</h1>
          <Link to="/knowledge" className="text-primary font-semibold underline">
            Back to Knowledge Centre
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-8 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          {t("knowledge.catalog.backToList")}
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/70 text-sm font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            {t("knowledge.catalog.backToList")}
          </Link>
        </div>
      </div>
    </article>
  );
}
