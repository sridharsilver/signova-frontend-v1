import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import logo from "@/assets/images/signova-logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { chatModalStore } from "@/lib/chat-modal";
import { useLanguage, LANGUAGES } from "@/hooks/use-language";

type SubLink = { to: string; label: string; desc?: string };
type NavItem = { label: string; to?: string; children?: SubLink[] };

const nav: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Company",
    children: [
      { to: "/about", label: "About Us", desc: "Our story, mission & vision" },
      { to: "/innovation", label: "R&D and Innovation", desc: "Science behind Signova" },
      { to: "/careers", label: "Careers", desc: "Join our growing team" },
    ],
  },
  {
    label: "Solutions",
    children: [
      { to: "/products", label: "Products", desc: "Micronutrients, bio & nano-tech" },
      { to: "/crops", label: "Crop Programs", desc: "Tailored crop nutrition" },
      { to: "/knowledge", label: "Knowledge Centre", desc: "Guides, blogs & research" },
      { to: "/ai-chat", label: "AI Crop Advisor", desc: "Multilingual expert crop help" },
    ],
  },
  {
    label: "Partner",
    children: [
      { to: "/distributor", label: "Become Distributor", desc: "Grow with Signova" },
      { to: "/contact", label: "Contact Us", desc: "Talk to our team" },
    ],
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const langSelectorRef = useRef<HTMLDivElement>(null);
  const mobileLangSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        langOpen &&
        (!langSelectorRef.current || !langSelectorRef.current.contains(e.target as Node)) &&
        (!mobileLangSelectorRef.current || !mobileLangSelectorRef.current.contains(e.target as Node))
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [langOpen]);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [path]);

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const handleLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const handleLangEnter = () => {
    if (langTimer.current) clearTimeout(langTimer.current);
    setLangOpen(true);
  };
  const handleLangLeave = () => {
    if (langTimer.current) clearTimeout(langTimer.current);
    langTimer.current = setTimeout(() => setLangOpen(false), 120);
  };

  const isChildActive = (item: NavItem) =>
    item.children?.some((c) => c.to === path) ?? false;

  const translateLabel = (label: string) => {
    switch (label) {
      case "Home": return t("navbar.home");
      case "Company": return t("navbar.company");
      case "Solutions": return t("navbar.solutions");
      case "Partner": return t("navbar.partner");
      default: return label;
    }
  };

  const translateSubLabel = (to: string, fallback: string) => {
    switch (to) {
      case "/about": return t("navbar.aboutUs");
      case "/innovation": return t("navbar.innovation");
      case "/careers": return t("navbar.careers");
      case "/products": return t("navbar.products");
      case "/crops": return t("navbar.crops");
      case "/knowledge": return t("navbar.knowledge");
      case "/ai-chat": return t("navbar.aiChat");
      case "/distributor": return t("navbar.becomeDistributor");
      case "/contact": return t("navbar.contactUs");
      default: return fallback;
    }
  };

  const translateSubDesc = (to: string, fallback: string) => {
    if (to === "/ai-chat") return t("navbar.aiChatDesc");
    switch (to) {
      case "/about": return t("about.values.missionTitle");
      case "/innovation": return t("home.innovation.eyebrow");
      case "/careers": return t("careers.hero.eyebrow");
      case "/products": return t("home.categories.chelated.title");
      case "/crops": return t("crops.hero.eyebrow");
      case "/knowledge": return t("home.knowledge.eyebrow");
      case "/distributor": return t("distributor.hero.eyebrow");
      case "/contact": return t("contact.hero.eyebrow");
      default: return fallback;
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4">
      {/* Mobile Menu Backdrop Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-charcoal/25 backdrop-blur-sm -z-10 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Language Menu Backdrop Overlay */}
      {langOpen && (
        <div
          className="fixed inset-0 bg-charcoal/20 backdrop-blur-[1px] -z-10 h-screen w-screen cursor-pointer"
          onClick={() => setLangOpen(false)}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between rounded-2xl px-5 py-3 glass shadow-card">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Signova" className="h-9 w-auto dark:invert dark:hue-rotate-180" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              if (!item.children) {
                const active = path === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to!}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-primary-text bg-secondary"
                        : "text-foreground/80 hover:text-primary-text hover:bg-secondary/60"
                    }`}
                  >
                    {translateLabel(item.label)}
                  </Link>
                );
              }

              const active = isChildActive(item);
              const isOpen = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleEnter(item.label)}
                  onMouseLeave={handleLeave}
                >
                  <button
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active || isOpen
                        ? "text-primary-text bg-secondary"
                        : "text-foreground/80 hover:text-primary-text hover:bg-secondary/60"
                    }`}
                  >
                    {translateLabel(item.label)}
                    <ChevronDown
                      className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-3 w-80 z-50">
                      <div className="bg-popover text-popover-foreground shadow-card rounded-2xl p-3 border border-border animate-fade-in">
                        {item.children.map((c) => {
                          const childActive = path === c.to;
                          return (
                            <Link
                              key={c.to}
                              to={c.to}
                              onClick={(e) => {
                                if (c.to === "/ai-chat") {
                                  e.preventDefault();
                                  chatModalStore.setOpen(true);
                                  setOpenMenu(null);
                                }
                              }}
                              className={`block rounded-xl px-3 py-2.5 transition ${
                                childActive
                                  ? "bg-secondary"
                                  : "hover:bg-secondary/70"
                              }`}
                            >
                              <div className="text-sm font-semibold text-foreground">
                                {translateSubLabel(c.to, c.label)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {translateSubDesc(c.to, c.desc || "")}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {/* Desktop Globe Language Dropdown Selector */}
            <div
              ref={langSelectorRef}
              className="relative"
              onMouseEnter={handleLangEnter}
              onMouseLeave={handleLangLeave}
            >
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-foreground/80 hover:text-primary-text hover:bg-secondary/60 transition-all duration-300 border border-border/30 hover:border-primary-text/20 shadow-sm cursor-pointer glass"
                aria-label="Select Language"
              >
                <Globe className="size-4 text-primary-text animate-pulse" />
                <span className="text-xs font-semibold leading-none flex items-center">{LANGUAGES.find(l => l.code === language)?.nativeName || "English"}</span>
                <ChevronDown className={`size-3 text-foreground/50 transition-transform duration-300 ${langOpen ? "rotate-180 text-primary-text" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full pt-3 w-52 z-50">
                  <div className="bg-popover/90 text-popover-foreground shadow-glow rounded-2xl p-2 border border-primary/10 glass animate-fade-in flex flex-col gap-1">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/20 mb-1">
                      Choose Language / भाषा चुनें
                    </div>
                    {LANGUAGES.map((lang) => {
                      const active = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm bg-gradient-to-r from-primary to-leaf"
                              : "hover:bg-secondary/70 text-foreground hover:translate-x-1"
                          }`}
                        >
                          <span>{lang.nativeName}</span>
                          {active && <span className="size-1.5 rounded-full bg-accent-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
            <Link
              to="/distributor"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-card"
            >
              {t("navbar.becomeDistributor")}
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-1">
            {/* Mobile Top Bar Language Selector Dropdown */}
            <div ref={mobileLangSelectorRef} className="relative">
              <button
                onClick={() => {
                  setLangOpen(!langOpen);
                  setOpen(false); // Close navigation menu when language panel opens
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground/80 hover:bg-secondary/60 border border-border/20 shadow-sm cursor-pointer glass"
                aria-label="Select Language"
              >
                <Globe className="size-4 text-primary-text animate-pulse" />
                <span className="text-xs font-bold leading-none flex items-center uppercase">{language}</span>
                <ChevronDown className={`size-3.5 text-foreground/50 transition-transform duration-300 ${langOpen ? "rotate-180 text-primary-text" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 z-50">
                  <div className="bg-popover/95 text-popover-foreground shadow-glow rounded-2xl p-2 border border-primary/10 glass animate-fade-in flex flex-col gap-1">
                    <div className="px-3.5 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/20 mb-1">
                      Choose Language / भाषा चुनें
                    </div>
                    {LANGUAGES.map((lang) => {
                      const active = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm bg-gradient-to-r from-primary to-leaf"
                              : "hover:bg-secondary/70 text-foreground hover:translate-x-1"
                          }`}
                        >
                          <span>{lang.nativeName}</span>
                          {active && <span className="size-1.5 rounded-full bg-accent-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-secondary"
              onClick={() => {
                setOpen((v) => !v);
                setLangOpen(false); // Close language panel when navigation menu opens
              }}
              aria-label="Menu"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-3 shadow-card animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {nav.map((item) => {
                if (!item.children) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to!}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
                    >
                      {translateLabel(item.label)}
                    </Link>
                  );
                }
                const isOpen = openMobileGroup === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setOpenMobileGroup(isOpen ? null : item.label)
                      }
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary"
                    >
                      {translateLabel(item.label)}
                      <ChevronDown
                        className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="ml-2 mt-1 mb-1 border-l border-border/60 pl-3 flex flex-col gap-0.5">
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            onClick={(e) => {
                              if (c.to === "/ai-chat") {
                                e.preventDefault();
                                chatModalStore.setOpen(true);
                                setOpen(false);
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-sm hover:bg-secondary"
                          >
                            {translateSubLabel(c.to, c.label)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                to="/distributor"
                className="mt-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center"
              >
                {t("navbar.becomeDistributor")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
