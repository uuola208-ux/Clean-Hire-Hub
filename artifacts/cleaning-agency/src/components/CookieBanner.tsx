import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { Link } from "wouter";

const COOKIE_KEY = "tjfreshspace_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't pop immediately on page load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-2xl shadow-2xl border border-primary-foreground/10 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="bg-secondary/20 p-3 rounded-full shrink-0">
          <Cookie className="h-6 w-6 text-secondary" />
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold mb-1">We use cookies</p>
          <p className="text-primary-foreground/70 leading-relaxed">
            We use essential cookies to keep the site running and optional analytics cookies to understand how visitors use it. No advertising or tracking cookies are used.{" "}
            <Link href="/privacy" className="underline hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <Button
            size="sm"
            variant="ghost"
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full"
            onClick={decline}
          >
            Essential only
          </Button>
          <Button
            size="sm"
            className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-5 shadow-md"
            onClick={accept}
          >
            Accept all
          </Button>
          <button
            onClick={decline}
            className="text-primary-foreground/50 hover:text-primary-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
