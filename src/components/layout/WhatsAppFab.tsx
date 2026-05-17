import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-lime-gradient grid place-items-center shadow-glow hover:scale-110 transition-transform animate-float"
      aria-label="WhatsApp"
    >
      <MessageCircle className="size-6 text-charcoal" />
    </a>
  );
}
