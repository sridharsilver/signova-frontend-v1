import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────────────────────
   Types — mirror backend MenuManagement.tsx exactly
───────────────────────────────────────────────────────── */
export type MenuSubLink = {
  id: string;
  to: string;
  label: string;
  desc: string;
  visible: boolean;
};

export type MenuGroup = {
  id: string;
  label: string;
  to?: string;          // set → direct link (no dropdown)
  visible: boolean;
  children?: MenuSubLink[];
};

export type MenuCta = {
  label: string;
  to: string;
  visible: boolean;
};

export type MenuSettings = {
  groups: MenuGroup[];
  cta: MenuCta;
};

/* ─────────────────────────────────────────────────────────
   Defaults — matches the original hardcoded Navbar nav array
───────────────────────────────────────────────────────── */
export const DEFAULT_MENU: MenuSettings = {
  groups: [
    { id: "home", label: "Home", to: "/", visible: true },
    {
      id: "company",
      label: "Company",
      visible: true,
      children: [
        { id: "about",      to: "/about",      label: "About Us",          desc: "Our story, mission & vision",     visible: true },
        { id: "innovation", to: "/innovation", label: "R&D and Innovation", desc: "Science behind Signova",         visible: true },
        { id: "careers",    to: "/careers",    label: "Careers",           desc: "Join our growing team",           visible: true },
      ],
    },
    {
      id: "solutions",
      label: "Solutions",
      visible: true,
      children: [
        { id: "products",  to: "/products",  label: "Products",         desc: "Micronutrients, bio & nano-tech", visible: true },
        { id: "crops",     to: "/crops",     label: "Crop Programs",    desc: "Tailored crop nutrition",         visible: true },
        { id: "knowledge", to: "/knowledge", label: "Knowledge Centre", desc: "Guides, blogs & research",        visible: true },
        { id: "ai-chat",   to: "/ai-chat",   label: "AI Crop Advisor",  desc: "Multilingual expert crop help",   visible: true },
      ],
    },
    {
      id: "partner",
      label: "Partner",
      visible: true,
      children: [
        { id: "distributor", to: "/distributor", label: "Become Distributor", desc: "Grow with Signova", visible: true },
        { id: "contact",     to: "/contact",     label: "Contact Us",         desc: "Talk to our team",  visible: true },
      ],
    },
  ],
  cta: { label: "Become a Distributor", to: "/distributor", visible: true },
};

/* ─────────────────────────────────────────────────────────
   Read cached menu from localStorage (prevents FOUC)
───────────────────────────────────────────────────────── */
function getInitialMenu(): MenuSettings {
  if (typeof window === "undefined") return DEFAULT_MENU;
  try {
    const raw = localStorage.getItem("signova_frontend_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.menu?.groups?.length) return parsed.menu as MenuSettings;
    }
  } catch {}
  return DEFAULT_MENU;
}

/* ─────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────── */
export function useMenu() {
  const [menu, setMenu] = useState<MenuSettings>(getInitialMenu);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data, error } = await supabase
          .from("frontend_settings")
          .select("*")
          .eq("key", "menu")
          .single();

        if (!error && data?.value?.groups) {
          const fetched = data.value as MenuSettings;
          setMenu(fetched);

          // Write back to localStorage cache for next visit
          try {
            const raw = localStorage.getItem("signova_frontend_settings") || "{}";
            const cached = JSON.parse(raw);
            cached.menu = fetched;
            localStorage.setItem("signova_frontend_settings", JSON.stringify(cached));
          } catch {}
        }
      } catch (err) {
        console.warn("useMenu: failed to fetch menu from Supabase, using cache/defaults.", err);
      }
    }
    fetchMenu();
  }, []);

  // Filter to only visible groups and visible sub-links
  const visibleGroups = menu.groups
    .filter((g) => g.visible !== false)
    .map((g) => ({
      ...g,
      children: g.children?.filter((c) => c.visible !== false),
    }));

  return {
    groups: visibleGroups,
    cta: menu.cta,
  };
}
