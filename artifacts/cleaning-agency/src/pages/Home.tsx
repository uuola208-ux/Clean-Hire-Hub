import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, Shield, Clock } from "lucide-react";
import heroImg from "@assets/generated_images/hero-cleaner.jpg";

export default function Home() {
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
              Build your career in <span className="text-secondary italic">professional</span> cleaning.
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
              We connect reliable, hardworking cleaners with excellent employers across the UK. Enjoy flexible hours, competitive pay, and a supportive team that values your dedication.
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
                src={heroImg} 
                alt="Professional cleaner smiling" 
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent mix-blend-multiply" />
            </div>
            {/* Floating badge */}
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

      {/* Featured Roles */}
      <section className="py-24 bg-background">
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
              { title: "Domestic Cleaner", desc: "Flexible hours cleaning private homes in your local area.", icon: <Star className="h-6 w-6 text-secondary" /> },
              { title: "Commercial Cleaner", desc: "Out-of-hours cleaning for offices, retail, and commercial spaces.", icon: <Shield className="h-6 w-6 text-secondary" /> },
              { title: "Housekeeping", desc: "Hotel and hospitality roles requiring an eye for detail.", icon: <Clock className="h-6 w-6 text-secondary" /> }
            ].map((role, i) => (
              <div key={i} className="bg-white border border-border p-8 rounded-3xl hover-elevate transition-all duration-300 group">
                <div className="bg-muted w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                  {role.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">{role.title}</h3>
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
              { title: "Competitive Pay", desc: "We ensure all our roles pay at or above the Real Living Wage." },
              { title: "Flexible Hours", desc: "Choose hours that work around your family and lifestyle." },
              { title: "Training Provided", desc: "Access to professional cleaning certificates and health & safety courses." },
              { title: "Ongoing Support", desc: "A dedicated manager to help you resolve any workplace issues." }
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
            Our application process is simple and straightforward. It takes less than 5 minutes to submit your details.
          </p>
          <Link href="/apply">
            <Button size="lg" className="rounded-full text-base px-10 py-6 h-auto shadow-xl hover:scale-105 transition-transform bg-secondary hover:bg-secondary/90 text-white border-none">
              Start Application <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
