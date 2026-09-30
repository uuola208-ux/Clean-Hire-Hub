import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, Shield, Clock, Quote, ChevronRight, Award, Handshake, Sparkles } from "lucide-react";
import heroImg from "@assets/generated_images/hero-cleaner.jpg";
import { useGetSiteSettings } from "@workspace/api-client-react";

const TESTIMONIALS = [
  {
    name: "Abena Mensah",
    role: "Domestic Cleaner – 2 years with TJ FreshSpace",
    text: "I was worried about finding stable work after moving to London. TJ FreshSpace matched me with a fantastic client within a week and I've been working consistently ever since. They genuinely care about us.",
    stars: 5,
  },
  {
    name: "Fatima Osei",
    role: "Commercial Cleaner – 3 years with TJ FreshSpace",
    text: "The support is unlike any agency I've worked with before. When I had an issue at a site, they resolved it the same day. I've also completed two cleaning certificates through their training programme — for free.",
    stars: 5,
  },
  {
    name: "Chinara Adeyemi",
    role: "Cleaning Supervisor – 4 years with TJ FreshSpace",
    text: "I started as a domestic cleaner and now I manage a team of 12 across central London. TJ FreshSpace saw potential in me and gave me the tools to grow. I can't recommend them highly enough.",
    stars: 5,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Application",
    desc: "Fill in our simple online form — it takes under 5 minutes. Tell us about yourself, your experience, and which roles interest you.",
    icon: <ChevronRight className="h-6 w-6 text-secondary" />,
  },
  {
    step: "02",
    title: "We Review & Match You",
    desc: "Our recruitment team personally reviews every application. We match you to roles that suit your skills, location, and availability.",
    icon: <Handshake className="h-6 w-6 text-secondary" />,
  },
  {
    step: "03",
    title: "Start Work & Get Paid",
    desc: "Once placed, you're supported every step of the way — from onboarding to ongoing pay queries. Weekly payments, no delays.",
    icon: <Award className="h-6 w-6 text-secondary" />,
  },
];

const TRUST_STATS = [
  { value: "500+", label: "Cleaners Placed in 2024" },
  { value: "4.9★", label: "Average Candidate Rating" },
  { value: "DBS", label: "Checked & Verified Roles" },
  { value: "48 hrs", label: "Average Placement Time" },
  { value: "£12.50+", label: "Minimum Hourly Rate" },
];

export default function Home() {
  const { data: settings } = useGetSiteSettings();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 z-0" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-2xl space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide">
              <Star className="h-4 w-4" /> Top UK Cleaning Agency
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-primary">
              {settings?.heroTitle || <>Build your career in <span className="text-secondary italic">professional</span> cleaning.</>}
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
              {settings?.heroSubtitle || "We connect reliable, hardworking cleaners with excellent employers across the UK. Enjoy flexible hours, competitive pay, and a supportive team that values your dedication."}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/apply">
                <Button size="lg" className="rounded-full text-base px-8 py-6 h-auto w-full sm:w-auto shadow-lg hover:shadow-xl transition-all bg-secondary hover:bg-secondary/90 text-white border-none">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" size="lg" className="rounded-full text-base px-8 py-6 h-auto w-full sm:w-auto border-primary/20 hover:bg-primary/5">
                  View Open Roles
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative animate-in slide-in-from-right-8 duration-1000">
            <div className="aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src={settings?.heroImageUrl || heroImg}
                alt="Professional cleaner smiling"
                className="object-cover w-full h-full"
                onError={(e) => {
                  const image = e.currentTarget;
                  image.onerror = null;
                  image.src = heroImg;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 max-w-[280px]">
              <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <p className="font-bold text-primary text-xl">500+</p>
                <p className="text-sm text-foreground/60 font-medium">Cleaners Placed This Year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-secondary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between gap-6 md:gap-2">
            {TRUST_STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs text-white/70 mt-0.5 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" /> Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-foreground/70 text-lg">From application to your first shift, we make the process as easy as possible.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-secondary/20 z-0" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-full bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl font-bold text-secondary font-serif">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{step.title}</h3>
                <p className="text-foreground/65 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href="/apply">
              <Button size="lg" className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white border-none shadow-md">
                Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Roles */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Find your perfect fit.</h2>
              <p className="text-foreground/70 text-lg">Whether you're looking for flexible domestic hours or a full-time commercial role, we have opportunities waiting for you.</p>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" className="group rounded-full">
                See all jobs <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Domestic Cleaner", pay: "£12.50–£14/hr", desc: "Flexible hours cleaning private homes in your local area.", icon: <Star className="h-6 w-6 text-secondary" /> },
              { title: "Commercial Cleaner", pay: "£13–£15/hr", desc: "Out-of-hours cleaning for offices, retail, and commercial spaces.", icon: <Shield className="h-6 w-6 text-secondary" /> },
              { title: "Housekeeping", pay: "£13.50–£16/hr", desc: "Hotel and hospitality roles requiring an eye for detail.", icon: <Clock className="h-6 w-6 text-secondary" /> }
            ].map((role, i) => (
              <div key={i} className="bg-white border border-border p-8 rounded-3xl hover:-translate-y-1 transition-all duration-300 group shadow-sm">
                <div className="bg-muted w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                  {role.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-1">{role.title}</h3>
                <p className="text-secondary font-semibold text-sm mb-3">{role.pay}</p>
                <p className="text-foreground/70 mb-8">{role.desc}</p>
                <Link href={`/apply?position=${role.title.toLowerCase().replace(' ', '-')}`}>
                  <span className="text-secondary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Apply for this role <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              <Quote className="h-4 w-4" /> Real Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Hear from our cleaners</h2>
            <p className="text-foreground/70 text-lg">Hundreds of professionals have built rewarding careers with TJ FreshSpace.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-secondary/20 mb-3" />
                <p className="text-foreground/75 leading-relaxed flex-1 italic mb-6">"{t.text}"</p>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-sm text-foreground/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 skew-x-12 translate-x-32" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why work with TJ FreshSpace?</h2>
            <p className="text-primary-foreground/70 text-lg">We don't just find you a job. We support you throughout your career with training, fair pay, and a team that has your back.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Competitive Pay", desc: "All roles pay at or above the Real Living Wage, with regular reviews." },
              { title: "Flexible Hours", desc: "Choose hours that work around your family and lifestyle." },
              { title: "Free Training", desc: "Access professional cleaning certificates and health & safety courses." },
              { title: "Ongoing Support", desc: "A dedicated manager to help you resolve any workplace issues promptly." }
            ].map((benefit, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="bg-secondary p-2 rounded-lg inline-block mb-4">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 bg-muted text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">Ready to start your journey?</h2>
          <p className="text-lg text-foreground/70 mb-10">
            Our application takes under 5 minutes. Our team reviews every submission personally and will be in touch within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" className="rounded-full text-base px-10 py-6 h-auto shadow-xl hover:scale-105 transition-transform bg-secondary hover:bg-secondary/90 text-white border-none">
                Start Application <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full text-base px-10 py-6 h-auto border-primary/20">
                Speak to the Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
