import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { withTimeout } from "@/lib/utils";

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
  enabledLanguages: LanguageKey[];
  showLanguageSelector: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): LanguageKey {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("signova_chat_lang") as LanguageKey;
    if (saved && ["en", "hi", "te", "gu", "mr", "ta", "kn"].includes(saved)) {
      return saved;
    }
    // Fallback to cached defaultLanguage
    const localSettings = localStorage.getItem("signova_frontend_settings");
    if (localSettings) {
      const parsed = JSON.parse(localSettings);
      if (parsed.languages && parsed.languages.defaultLanguage) {
        const defaultLang = parsed.languages.defaultLanguage as LanguageKey;
        if (["en", "hi", "te", "gu", "mr", "ta", "kn"].includes(defaultLang)) {
          return defaultLang;
        }
      }
    }
  } catch {}
  return "en";
}

function getInitialEnabledLanguages(): LanguageKey[] {
  if (typeof window === "undefined") return ["en", "hi", "te", "gu", "mr", "ta", "kn"];
  try {
    const localSettings = localStorage.getItem("signova_frontend_settings");
    if (localSettings) {
      const parsed = JSON.parse(localSettings);
      if (parsed.languages && Array.isArray(parsed.languages.enabledLanguages)) {
        return parsed.languages.enabledLanguages as LanguageKey[];
      }
    }
  } catch {}
  return ["en", "hi", "te", "gu", "mr", "ta", "kn"];
}

function getInitialShowSelector(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const localSettings = localStorage.getItem("signova_frontend_settings");
    if (localSettings) {
      const parsed = JSON.parse(localSettings);
      if (parsed.languages && typeof parsed.languages.showLanguageSelector === "boolean") {
        return parsed.languages.showLanguageSelector;
      }
    }
  } catch {}
  return true;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageKey>(getInitialLanguage);
  const [enabledLanguages, setEnabledLanguages] = useState<LanguageKey[]>(
    getInitialEnabledLanguages,
  );
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(getInitialShowSelector);

  useEffect(() => {
    try {
      localStorage.setItem("signova_chat_lang", language);
      document.documentElement.setAttribute("lang", language);
    } catch {}
  }, [language]);

  // Fetch languages settings from database
  useEffect(() => {
    async function fetchLanguagesConfig() {
      try {
        const { data, error } = await withTimeout(
          supabase.from("frontend_settings").select("*").eq("key", "languages").single(),
        );

        if (!error && data && data.value) {
          const config = data.value;
          if (config.enabledLanguages) {
            setEnabledLanguages(config.enabledLanguages);
          }
          if (typeof config.showLanguageSelector === "boolean") {
            setShowLanguageSelector(config.showLanguageSelector);
          }
          // If the current language is not in the list of enabled languages, switch to default
          if (config.enabledLanguages && !config.enabledLanguages.includes(language)) {
            const defaultLang = config.defaultLanguage || "en";
            setLanguageState(defaultLang);
          } else if (!localStorage.getItem("signova_chat_lang") && config.defaultLanguage) {
            setLanguageState(config.defaultLanguage);
          }

          // Sync to cache
          const localSettingsRaw = localStorage.getItem("signova_frontend_settings") || "{}";
          try {
            const currentCache = JSON.parse(localSettingsRaw);
            currentCache.languages = config;
            localStorage.setItem("signova_frontend_settings", JSON.stringify(currentCache));
          } catch {
            localStorage.setItem(
              "signova_frontend_settings",
              JSON.stringify({ languages: config }),
            );
          }
        }
      } catch (err) {
        console.warn("Failed to fetch languages settings from Supabase", err);
      }
    }
    fetchLanguagesConfig();
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
      const parts = key.split(".");
      const langDict = translations[language] || translations.en;
      let val = parts.reduce((acc, part) => acc && acc[part], langDict as any);

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
    <LanguageContext.Provider
      value={{ language, setLanguage, t, enabledLanguages, showLanguageSelector }}
    >
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
