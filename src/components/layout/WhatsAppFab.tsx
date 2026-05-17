import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const [phone, setPhone] = useState("+91 98765 43210");

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

  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-lime-gradient grid place-items-center shadow-glow hover:scale-110 transition-transform animate-float"
      aria-label="WhatsApp"
    >
      <MessageCircle className="size-6 text-charcoal" />
    </a>
  );
}
