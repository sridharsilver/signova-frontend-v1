import { useChatModal } from "@/lib/chat-modal";
import { Sparkles, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

export function AiChatFab() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useChatModal();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("frontend_settings")
          .select("*")
          .eq("key", "theme")
          .single();

        if (error) {
          const local = localStorage.getItem("signova_frontend_settings");
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed.theme && parsed.theme.showAiChat !== undefined) {
              setIsVisible(parsed.theme.showAiChat !== false);
            }
          }
        } else if (data && data.value && data.value.showAiChat !== undefined) {
          setIsVisible(data.value.showAiChat !== false);
        }
      } catch (err) {
        console.warn("Failed to fetch AI Chat visibility configurations", err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    // Show a subtle welcoming hint after 3 seconds, then hide it after 9 seconds
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 9000);

    // Show tooltip repeatedly every 60 seconds (every minute) for 6 seconds
    const interval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 60000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  useEffect(() => {
    const checkConstraints = () => {
      setDragConstraints({
        left: -window.innerWidth + 80,
        right: 10,
        top: -window.innerHeight + 80,
        bottom: 10
      });
    };
    checkConstraints();
    window.addEventListener("resize", checkConstraints);
    return () => window.removeEventListener("resize", checkConstraints);
  }, []);

  const [initialX] = useState(() => {
    try {
      const saved = sessionStorage.getItem("signova_fab_drag_x");
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [initialY] = useState(() => {
    try {
      const saved = sessionStorage.getItem("signova_fab_drag_y");
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  const dragX = useMotionValue(initialX);
  const dragY = useMotionValue(initialY);

  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      // Transitioned from open to closed!
      animate(dragX, 0, { type: "spring", stiffness: 200, damping: 25 });
      animate(dragY, 0, { type: "spring", stiffness: 200, damping: 25 });
      try {
        sessionStorage.setItem("signova_fab_drag_x", "0");
        sessionStorage.setItem("signova_fab_drag_y", "0");
      } catch (e) {}
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, dragX, dragY]);

  const handleDragEnd = () => {
    try {
      sessionStorage.setItem("signova_fab_drag_x", dragX.get().toString());
      sessionStorage.setItem("signova_fab_drag_y", dragY.get().toString());
    } catch (e) {}
  };

  if (!isVisible) return null;

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.15}
      dragMomentum={false}
      style={{ x: dragX, y: dragY }}
      onDragEnd={handleDragEnd}
      className="fixed bottom-6 right-6 z-[99] flex items-center gap-3 touch-none select-none cursor-grab active:cursor-grabbing"
    >
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

      <div className="relative">
        {/* Pulsing Backlight Ring when closed */}
        {!isOpen && (
          <motion.div 
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }} 
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute -inset-1.5 rounded-full bg-lime/25 z-[-1] pointer-events-none blur-[1px]" 
          />
        )}

        {/* Small Red Notification Alert Dot */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 z-20 flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-red-500 border border-background shadow-xs" />
          </span>
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`size-14 rounded-full text-white grid place-items-center shadow-glow border border-lime/30 transition-all cursor-pointer ${
            isOpen 
              ? "bg-white/15 dark:bg-black/35 backdrop-blur-md border-white/15 text-foreground hover:bg-white/20 hover:dark:bg-black/45" 
              : "bg-hero"
          }`}
          aria-label="AI Crop Advisor"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "open" : "closed"}
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center"
            >
              {isOpen ? (
                <X className="size-6 text-foreground" />
              ) : (
                <Sparkles className="size-6 text-lime fill-lime/10" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
