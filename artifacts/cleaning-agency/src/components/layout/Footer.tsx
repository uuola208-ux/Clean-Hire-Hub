import { Link } from "wouter";
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-secondary" />
              <span className="font-serif text-2xl font-bold">TJ FreshSpace</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Connecting dedicated cleaning professionals with outstanding opportunities across the UK. Excellence in every shine.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/apply" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Apply Now</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-white">Popular Roles</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Domestic Cleaner</Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Commercial Cleaner</Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Office Cleaner</Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Housekeeping</Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">Supervisor</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span>124 Business Park Road<br />London, W1 4XY<br />United Kingdom</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span>020 7946 0000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>hello@brightclean.co.uk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            &copy; {new Date().getFullYear()} TJ FreshSpace Recruitment. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link href="/admin" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
