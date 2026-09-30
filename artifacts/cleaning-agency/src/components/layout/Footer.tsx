import { Link } from "wouter";
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function Footer() {
  const { data: settings } = useGetSiteSettings();
  const phoneHref = settings?.phone?.replace(/[^+\d]/g, "") || "";
  const socialLinks = [
    { url: settings?.facebookUrl, label: "Facebook", icon: <Facebook className="h-5 w-5" /> },
    { url: settings?.instagramUrl, label: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    { url: settings?.linkedinUrl, label: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
  ].filter((item) => Boolean(item.url));

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-secondary" />
              <span className="font-serif text-2xl font-bold">{settings?.companyName || "TJ FreshSpace"}</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Connecting dedicated cleaning professionals with outstanding opportunities across the UK. Excellence in every shine.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map(({ url, label, icon }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  {icon}
                </a>
              ))}
            </div>
            <div className="pt-2">
              <span className="text-xs text-primary-foreground/40 uppercase tracking-widest font-medium">Registered in England & Wales</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/jobs", label: "Careers" },
                { href: "/apply", label: "Apply Now" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-white">Popular Roles</h3>
            <ul className="space-y-3">
              {["Domestic Cleaner", "Commercial Cleaner", "Office Cleaner", "Housekeeping", "Cleaning Supervisor"].map((role) => (
                <li key={role}>
                  <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                    {role}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{settings?.address || "London, United Kingdom"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a href={phoneHref ? `tel:${phoneHref}` : undefined} className="hover:text-secondary transition-colors">{settings?.phone || "Phone number to be added"}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a href={settings?.contactEmail ? `mailto:${settings.contactEmail}` : undefined} className="hover:text-secondary transition-colors">{settings?.contactEmail || "Email to be added"}</a>
              </li>
            </ul>
            <div className="text-xs text-primary-foreground/50">
              <p>{settings?.officeHours || "Office hours to be added"}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            &copy; {new Date().getFullYear()} {settings?.companyName || "TJ FreshSpace"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
