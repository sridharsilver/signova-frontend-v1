import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageShell";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

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
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's grow something together"
        subtitle="Reach our team for product info, agronomy advice or partnership opportunities."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-6 mb-16">
          {[
            { i: Phone, t: "Call", v: "+91 98765 43210", s: "Mon–Sat, 9 AM – 7 PM" },
            { i: Mail, t: "Email", v: "info@signovagroup.com", s: "Response within 24 hrs" },
            { i: MapPin, t: "Visit", v: "Hyderabad HQ", s: "Plot 42, Genome Valley, TS" },
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
            <h3 className="text-2xl font-bold">Send us a message</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder="Name" required />
              <input className="bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder="Phone" required />
            </div>
            <input className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder="Email" type="email" />
            <select className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf">
              <option>Product enquiry</option>
              <option>Dealer / Distributor</option>
              <option>Agronomy advice</option>
              <option>Career</option>
              <option>Other</option>
            </select>
            <textarea rows={5} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf" placeholder="How can we help?" />
            <button className="w-full px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Send Message
            </button>
            <a href="https://wa.me/919876543210" className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-lime-gradient text-charcoal font-semibold">
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </form>

          <div className="rounded-3xl overflow-hidden shadow-card min-h-[400px]">
            <iframe
              title="Signova HQ"
              src="https://www.openstreetmap.org/export/embed.html?bbox=78.40%2C17.50%2C78.55%2C17.55&layer=mapnik"
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
