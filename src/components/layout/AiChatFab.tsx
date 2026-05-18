import { useChatModal } from "@/lib/chat-modal";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function AiChatFab() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useChatModal();

  useEffect(() => {
    // Show a subtle welcoming hint after 3 seconds, then hide it after 8 seconds
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Dynamic Hint Tooltip */}
      <div 
        className={`bg-charcoal text-white text-xs font-semibold py-2 px-3.5 rounded-2xl glass-dark border border-white/10 shadow-lg pointer-events-none transition-all duration-500 whitespace-nowrap ${
          showTooltip && !isOpen
            ? "opacity-100 translate-x-0 scale-100" 
            : "opacity-0 translate-x-4 scale-95"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-lime animate-pulse" />
          Ask Signova AI Crop Advisor
        </span>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`size-14 rounded-full text-white grid place-items-center shadow-glow border border-lime/30 hover:scale-110 active:scale-95 transition-all animate-float [animation-delay:1.5s] ${
          isOpen ? "bg-charcoal border-white/20" : "bg-hero"
        }`}
        aria-label="AI Crop Advisor"
      >
        <Sparkles className="size-6 text-lime animate-pulse" />
      </button>
    </div>
  );
}
