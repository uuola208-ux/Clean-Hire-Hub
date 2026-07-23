import { Link, useLocation } from "wouter";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/jobs", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-secondary/10 p-2 rounded-lg group-hover:bg-secondary/20 transition-colors">
            <Sparkles className="h-6 w-6 text-secondary" />
          </div>
          <span className="font-serif text-2xl font-bold text-primary">TJ FreshSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                location === link.href ? "text-secondary font-semibold" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply" className="ml-4">
            <Button size="lg" className="rounded-full font-semibold shadow-sm hover:shadow-md transition-all">
              Apply Now
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg font-medium p-2 rounded-md transition-colors",
                location === link.href ? "bg-secondary/10 text-secondary" : "text-foreground/80 hover:bg-muted"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t">
            <Link href="/apply" className="w-full block" onClick={() => setMobileMenuOpen(false)}>
              <Button size="lg" className="w-full rounded-full font-semibold">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
