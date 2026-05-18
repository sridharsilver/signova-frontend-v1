import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppFab() {
  const [phone, setPhone] = useState("+91 98765 43210");
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    async function fetchPhone() {
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
            if (parsed.contact && parsed.contact.phone) {
              setPhone(parsed.contact.phone);
            }
          }
        } else if (data && data.value && data.value.phone) {
          setPhone(data.value.phone);
        }
      } catch (err) {
        console.warn("Failed to fetch WhatsApp phone for Fab", err);
      }
    }
    fetchPhone();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowFab(true);
      } else {
        setShowFab(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount in case the page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}`;

  return (
    <AnimatePresence>
      {showFab && (
        <motion.a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, scale: 0.5, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: -20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-6 z-40 size-14 rounded-full bg-lime-gradient grid place-items-center shadow-glow hover:scale-110 active:scale-95 transition-transform animate-float"
          aria-label="WhatsApp"
        >
          <MessageCircle className="size-6 text-charcoal" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
