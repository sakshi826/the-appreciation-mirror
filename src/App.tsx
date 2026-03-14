import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageSelector } from "./components/LanguageSelector";
import { AuthGuard } from "./components/AuthGuard";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const HandshakeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    const performHandshake = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        try {
          const res = await fetch("/api/auth/handshake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            const data = await res.json();
            sessionStorage.setItem("user_id", data.user_id);
            window.history.replaceState({}, "", window.location.pathname);
            setIsAuthResolved(true);
          } else {
            window.location.href = "/token";
          }
        } catch (err) {
          console.error("Handshake failed:", err);
          window.location.href = "/token";
        }
      } else if (sessionStorage.getItem("user_id")) {
        // Already authenticated
        setIsAuthResolved(true);
      } else {
        window.location.href = "/token";
      }
    };

    performHandshake();
  }, []);

  if (!isAuthResolved) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageSelector />
      <Toaster />
      <Sonner />
      <HandshakeWrapper>
        <BrowserRouter basename="/the-appreciation-mirror">
          <Routes>
            <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HandshakeWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
