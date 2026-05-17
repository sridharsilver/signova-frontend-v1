import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/images/signova-logo.png";

export function Footer() {
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
              Pioneering science-driven crop nutrition and micronutrient solutions for sustainable Indian agriculture.
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
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-lime">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-lime transition">About Us</Link></li>
              <li><Link to="/innovation" className="hover:text-lime transition">R&D</Link></li>
              <li><Link to="/careers" className="hover:text-lime transition">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-lime transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-lime">Products</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/products" className="hover:text-lime transition">Chelated Micronutrients</Link></li>
              <li><Link to="/products" className="hover:text-lime transition">Bio Stimulants</Link></li>
              <li><Link to="/products" className="hover:text-lime transition">Nano Technology</Link></li>
              <li><Link to="/products" className="hover:text-lime transition">Crop Protectors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-lime">Newsletter</h4>
            <p className="text-sm text-white/70 mb-3">Crop tips & updates monthly.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
              />
              <button className="px-4 py-2.5 rounded-lg bg-lime-gradient text-charcoal text-sm font-semibold hover:opacity-90">
                Join
              </button>
            </form>
            <div className="mt-6 space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2"><Mail className="size-3.5" /> {contact.email}</div>
              <div className="flex items-center gap-2"><Phone className="size-3.5" /> {contact.phone}</div>
              <div className="flex items-center gap-2"><MapPin className="size-3.5" /> {contact.address}</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Signova Group of Companies. All rights reserved.</div>
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
