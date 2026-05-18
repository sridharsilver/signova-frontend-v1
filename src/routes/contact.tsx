import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHero } from "@/components/layout/PageShell";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Signova Group — Talk to an Expert" },
      { name: "description", content: "Reach Signova for product enquiries, dealer support, agronomy advice or partnerships. Call, email or visit our Hyderabad HQ." },
      { property: "og:title", content: "Contact Signova Group" },
      { property: "og:description", content: "Talk to an agronomist or partnership manager today." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useLanguage();
  const [contact, setContact] = useState({
    phone: "+91 98765 43210",
    email: "info@signovagroup.com",
    address: "Plot 42, Genome Valley, Hyderabad, Telangana",
    mapsEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=78.40%2C17.50%2C78.55%2C17.55&layer=mapnik",
  });

  useEffect(() => {
    async function fetchContactDetails() {
      try {
        const { data, error } = await supabase
          .from("frontend_settings")
          .select("*")
          .eq("key", "contact")
          .single();

        if (error) {
          const local = localStorage.getItem("signova_frontend_settings");
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed.contact) {
              setContact(prev => ({ ...prev, ...parsed.contact }));
            }
          }
        } else if (data && data.value) {
          setContact(prev => ({ ...prev, ...data.value }));
        }
      } catch (err) {
        console.warn("Failed to fetch contact details from Supabase", err);
      }
    }
    fetchContactDetails();
  }, []);

  const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}`;

  return (
    <>
      <PageHero
        eyebrow={t("contact.hero.eyebrow")}
        title={t("contact.hero.title")}
        subtitle={t("contact.hero.subtitle")}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-6 mb-16">
          {[
            { i: Phone, t: t("contact.info.phone"), v: contact.phone, s: "Mon–Sat, 9 AM – 7 PM" },
            { i: Mail, t: t("contact.info.email"), v: contact.email, s: "Response within 24 hrs" },
            { i: MapPin, t: t("contact.info.hq"), v: "Signova HQ", s: contact.address === "Plot 42, Genome Valley, Hyderabad, Telangana" ? t("footer.addressVal") : contact.address },
          ].map((c, i) => (
            <div key={i} className="bg-card rounded-3xl p-7 shadow-card hover:shadow-glow transition">
              <div className="size-12 rounded-2xl bg-lime-gradient grid place-items-center mb-5">
                <c.i className="size-5 text-charcoal" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{c.t}</div>
              <div className="font-bold text-lg">{c.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{c.s}</div>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <form className="bg-card rounded-3xl p-8 shadow-card space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h3 className="text-2xl font-bold">{t("contact.form.title")}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder={t("contact.form.name")} required />
              <input className="bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder={t("contact.form.phone")} required />
            </div>
            <input className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder={t("contact.form.email")} type="email" />
            <select className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf">
              <option>{t("navbar.solutions")}</option>
              <option>{t("navbar.becomeDistributor")}</option>
              <option>{t("navbar.aiChat")}</option>
              <option>{t("navbar.careers")}</option>
              <option>{t("contact.form.subject")}</option>
            </select>
            <textarea rows={5} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder={t("contact.form.message")} />
            <button className="w-full px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition cursor-pointer">
              {t("contact.form.submit")}
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-lime-gradient text-charcoal font-semibold cursor-pointer">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </form>

          <div className="rounded-3xl overflow-hidden shadow-card min-h-[400px]">
            <iframe
              title="Signova HQ"
              src={contact.mapsEmbed}
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
