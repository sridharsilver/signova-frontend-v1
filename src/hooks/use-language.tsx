import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations } from "@/lib/translations";

export type LanguageKey = "en" | "hi" | "te" | "gu" | "mr" | "ta" | "kn";

export interface LanguageConfig {
  code: LanguageKey;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
];

type LanguageContextType = {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): LanguageKey {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("signova_chat_lang") as LanguageKey;
    if (saved && ["en", "hi", "te", "gu", "mr", "ta", "kn"].includes(saved)) {
      return saved;
    }
  } catch {}
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageKey>(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem("signova_chat_lang", language);
      document.documentElement.setAttribute("lang", language);
    } catch {}
  }, [language]);

  // Handle local storage change in another tab / window or from chatbot
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "signova_chat_lang" && e.newValue) {
        const val = e.newValue as LanguageKey;
        if (["en", "hi", "te", "gu", "mr", "ta", "kn"].includes(val)) {
          setLanguageState(val);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setLanguage = (lang: LanguageKey) => {
    setLanguageState(lang);
    // Custom event to immediately notify chat or other components in the same window
    window.dispatchEvent(new Event("signova_language_changed"));
  };

  const t = (key: string, fallback?: string): string => {
    try {
      // 1. Split path like 'home.hero.title'
      const parts = key.split(".");
      
      // 2. Fetch value from current language translations dictionary
      const langDict = translations[language] || translations.en;
      let val = parts.reduce((acc, part) => acc && acc[part], langDict as any);
      
      // 3. Fallback to English master dictionary if not found in current language
      if (val === undefined || val === null) {
        const engDict = translations.en;
        val = parts.reduce((acc, part) => acc && acc[part], engDict as any);
      }

      if (val !== undefined && val !== null && typeof val === "string") {
        return val;
      }
    } catch (e) {
      console.warn(`Translation error for key "${key}":`, e);
    }

    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
