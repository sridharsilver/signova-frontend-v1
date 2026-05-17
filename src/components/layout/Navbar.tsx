import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/images/signova-logo.png";
import { ThemeToggle } from "./ThemeToggle";

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

  const isChildActive = (item: NavItem) =>
    item.children?.some((c) => c.to === path) ?? false;

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4">
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
                        ? "text-primary bg-secondary"
                        : "text-foreground/80 hover:text-primary hover:bg-secondary/60"
                    }`}
                  >
                    {item.label}
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
                        ? "text-primary bg-secondary"
                        : "text-foreground/80 hover:text-primary hover:bg-secondary/60"
                    }`}
                  >
                    {item.label}
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
                              className={`block rounded-xl px-3 py-2.5 transition ${
                                childActive
                                  ? "bg-secondary"
                                  : "hover:bg-secondary/70"
                              }`}
                            >
                              <div className="text-sm font-semibold text-foreground">
                                {c.label}
                              </div>
                              {c.desc && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {c.desc}
                                </div>
                              )}
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
            <ThemeToggle />
            <Link
              to="/distributor"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-card"
            >
              Become Distributor
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-secondary"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-3 shadow-card animate-fade-in">
            <div className="flex flex-col gap-1">
              {nav.map((item) => {
                if (!item.children) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to!}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
                    >
                      {item.label}
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
                      {item.label}
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
                            className="px-3 py-2 rounded-lg text-sm hover:bg-secondary"
                          >
                            {c.label}
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
                Become Distributor
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
