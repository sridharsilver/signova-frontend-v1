import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

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
    <section className="relative bg-hero text-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute -top-40 -left-20 size-[500px] rounded-full bg-lime-gradient opacity-20 blur-3xl" />
      <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-lime opacity-10 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.2em] text-lime mb-6 animate-fade-in">
            {eyebrow}
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] max-w-4xl animate-fade-up">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl animate-fade-up [animation-delay:120ms]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
