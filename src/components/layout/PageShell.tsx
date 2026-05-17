import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";
import heroFarm from "@/assets/images/hero-farm.jpg";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative text-white overflow-hidden min-h-[300px] flex items-center">
      {/* Farm Background Image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroFarm} alt="Signova Agriculture Farm" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-900/80 to-transparent" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-30 z-10" />
      <div className="absolute -top-40 -left-20 size-[500px] rounded-full bg-lime-gradient opacity-15 blur-3xl z-10" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24 z-20 w-full">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.2em] text-lime mb-6 animate-fade-in">
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] max-w-4xl animate-fade-up">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl animate-fade-up [animation-delay:120ms]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
