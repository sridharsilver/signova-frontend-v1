import { Outlet, Link, createRootRoute, useLocation } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { AiChatFab } from "@/components/layout/AiChatFab";
import { ThemeProvider } from "@/hooks/use-theme";
import { useChatModal } from "@/lib/chat-modal";
import { AiChat } from "./ai-chat";

import { LanguageProvider } from "@/hooks/use-language";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useLocation();
  const isChatPage = location.pathname === "/ai-chat";
  const [isOpen, setIsOpen] = useChatModal();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          {!isChatPage && <WhatsAppFab />}
          {!isChatPage && <AiChatFab />}

          {/* Global Floating AI Crop Advisor Dialog Overlay */}
          {isOpen && !isChatPage && (
            <AiChat isModal={true} onClose={() => setIsOpen(false)} />
          )}
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

