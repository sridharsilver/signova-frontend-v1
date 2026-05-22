import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { withTimeout } from "@/lib/utils";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof localStorage !== "undefined") {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;

      const cached = localStorage.getItem("signova_frontend_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.theme && typeof parsed.theme.darkMode === "boolean") {
          return parsed.theme.darkMode ? "dark" : "light";
        }
      }
    } catch {}
  }
  return "dark";
}

function lightenColor(hex: string, percent: number): string {
  try {
    let color = hex.replace("#", "");
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + Math.round(2.55 * percent);
    let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
    let b = (num & 0x0000ff) + Math.round(2.55 * percent);

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch {
    return hex;
  }
}

function darkenColor(hex: string, percent: number): string {
  try {
    let color = hex.replace("#", "");
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) - Math.round(2.55 * percent);
    let g = ((num >> 8) & 0x00ff) - Math.round(2.55 * percent);
    let b = (num & 0x0000ff) - Math.round(2.55 * percent);

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch {
    return hex;
  }
}

function isColorLight(hex: string): boolean {
  try {
    let color = hex.replace("#", "");
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp > 150;
  } catch {
    return false;
  }
}

function applyDynamicTheme(config: any) {
  if (typeof window === "undefined" || !config) return;

  const root = document.documentElement;

  // 1. Primary & Accent Colors
  const primary = config.primaryColor || "#84cc16";
  const secondary = config.secondaryColor || "#0c0a09";
  const lightenedPrimary = lightenColor(primary, 25);
  const darkenedPrimary = darkenColor(primary, 40);

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--leaf", primary);
  root.style.setProperty(
    "--lime",
    secondary && secondary !== "#0c0a09" ? secondary : lightenedPrimary,
  );

  // Set readable foreground color for primary background dynamically
  const isLight = isColorLight(primary);
  root.style.setProperty("--primary-foreground", isLight ? "#18181b" : "#ffffff");

  // Dynamic high-contrast text color based on active theme
  root.style.setProperty("--primary-text-light", darkenedPrimary);
  root.style.setProperty("--primary-text-dark", primary);

  // 2. Dynamic Gradients
  root.style.setProperty(
    "--gradient-lime",
    `linear-gradient(135deg, ${primary}, ${secondary && secondary !== "#0c0a09" ? secondary : lightenedPrimary})`,
  );

  root.style.setProperty(
    "--gradient-hero",
    `linear-gradient(135deg, ${primary} 0%, #171717 60%, #0a0a0a 100%)`,
  );

  // 3. Dynamic Shadows using brand color with hex opacity
  root.style.setProperty("--shadow-glow", `0 20px 60px -20px ${primary}60`);
  root.style.setProperty("--shadow-card", `0 10px 40px -15px ${primary}20`);

  // 4. Dynamic Font Family loader
  const font = config.fontFamily || "Inter";
  root.style.setProperty("--font-sans", `"${font}", sans-serif`);
  root.style.setProperty("--font-display", `"${font}", sans-serif`);

  // Inject Google Font link dynamically
  const fontId = `google-font-${font.replace(/\s+/g, "-").toLowerCase()}`;
  if (!document.getElementById(fontId)) {
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  // Dynamic database theme fetch and cache loading
  useEffect(() => {
    // 1. Initial cached load to eliminate FOUC (flash of unstyled content)
    const localSettings = localStorage.getItem("signova_frontend_settings");
    if (localSettings) {
      try {
        const parsed = JSON.parse(localSettings);
        if (parsed.theme) {
          applyDynamicTheme(parsed.theme);
          if (!localStorage.getItem("theme") && typeof parsed.theme.darkMode === "boolean") {
            setThemeState(parsed.theme.darkMode ? "dark" : "light");
          }
        }
      } catch (err) {
        console.warn("Failed to parse cached theme", err);
      }
    }

    // 2. Fetch fresh theme settings from Supabase
    async function fetchDatabaseTheme() {
      try {
        const { data, error } = await withTimeout(
          supabase.from("frontend_settings").select("*").eq("key", "theme").single(),
        );

        if (!error && data && data.value) {
          applyDynamicTheme(data.value);
          if (!localStorage.getItem("theme") && typeof data.value.darkMode === "boolean") {
            setThemeState(data.value.darkMode ? "dark" : "light");
          }

          // Update cache
          const localSettingsRaw = localStorage.getItem("signova_frontend_settings") || "{}";
          try {
            const currentCache = JSON.parse(localSettingsRaw);
            currentCache.theme = data.value;
            localStorage.setItem("signova_frontend_settings", JSON.stringify(currentCache));
          } catch {
            localStorage.setItem(
              "signova_frontend_settings",
              JSON.stringify({ theme: data.value }),
            );
          }
        }
      } catch (err) {
        console.warn("Failed to fetch brand theme from Supabase", err);
      }
    }

    fetchDatabaseTheme();
  }, []);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
