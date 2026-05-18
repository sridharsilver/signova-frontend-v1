import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/images/signova-logo.png";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { t } = useLanguage();
  const [contact, setContact] = useState({
    phone: "+91 98765 43210",
    email: "info@signovagroup.com",
    address: "Hyderabad, India",
    socials: {
      facebook: "https://facebook.com/signovagroup",
      twitter: "https://twitter.com/signovagroup",
      linkedin: "https://linkedin.com/company/signovagroup",
      instagram: "https://instagram.com/signovagroup"
    }
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
              setContact(prev => ({
                ...prev,
                ...parsed.contact,
                socials: { ...prev.socials, ...parsed.contact.socials }
              }));
            }
          }
        } else if (data && data.value) {
          setContact(prev => ({
            ...prev,
            ...data.value,
            socials: { ...prev.socials, ...data.value.socials }
          }));
        }
      } catch (err) {
        console.warn("Failed to fetch contact details for Footer", err);
      }
    }
    fetchContactDetails();
  }, []);

  return (
    <footer className="relative bg-charcoal text-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-lime-gradient opacity-10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Signova"
                className="h-10 w-auto"
                style={{ filter: "invert(1) hue-rotate(180deg)" }}
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-6">
              {t("footer.desc")}
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, link: contact.socials.facebook },
                { Icon: Instagram, link: contact.socials.instagram },
                { Icon: Linkedin, link: contact.socials.linkedin },
                { Icon: Twitter, link: contact.socials.twitter }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 grid place-items-center rounded-xl glass-dark hover:bg-lime-gradient hover:text-charcoal transition"
                >
                  <item.Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-lime">{t("footer.company")}</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-lime transition">{t("navbar.aboutUs")}</Link></li>
              <li><Link to="/innovation" className="hover:text-lime transition">{t("navbar.innovation")}</Link></li>
              <li><Link to="/careers" className="hover:text-lime transition">{t("navbar.careers")}</Link></li>
              <li><Link to="/contact" className="hover:text-lime transition">{t("navbar.contactUs")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-lime">{t("footer.solutions")}</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/products" className="hover:text-lime transition">{t("home.categories.chelated.title")}</Link></li>
              <li><Link to="/products" className="hover:text-lime transition">{t("home.categories.bio.title")}</Link></li>
              <li><Link to="/products" className="hover:text-lime transition">{t("home.categories.nano.title")}</Link></li>
              <li><Link to="/products" className="hover:text-lime transition">{t("home.categories.protectors.title")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-lime">{t("footer.newsletter")}</h4>
            <p className="text-sm text-white/70 mb-3">{t("footer.newsletterDesc")}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
              />
              <button className="px-4 py-2.5 rounded-lg bg-lime-gradient text-charcoal text-sm font-semibold hover:opacity-90 cursor-pointer">
                {t("footer.subscribe")}
              </button>
            </form>
            <div className="mt-6 space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2"><Mail className="size-3.5" /> {contact.email}</div>
              <div className="flex items-center gap-2"><Phone className="size-3.5" /> {contact.phone}</div>
              <div className="flex items-center gap-2"><MapPin className="size-3.5" /> {contact.address === "Hyderabad, India" ? t("footer.addressVal") : contact.address}</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Signova Group of Companies. {t("footer.allRightsReserved")}</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-lime">Privacy</a>
            <a href="#" className="hover:text-lime">Terms</a>
            <a href="#" className="hover:text-lime">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
