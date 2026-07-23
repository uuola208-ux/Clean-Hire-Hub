import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, HeartHandshake } from "lucide-react";
import aboutImg from "@assets/generated_images/about-team.jpg";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-10 pb-24">
      {/* Header */}
      <section className="container mx-auto px-4 mb-20 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-in fade-in slide-in-from-bottom-4">
          Raising the standard of <span className="text-secondary italic">recruitment</span>.
        </h1>
        <p className="text-lg text-foreground/70 animate-in fade-in slide-in-from-bottom-6 delay-100 fill-mode-both">
          At TJ FreshSpace, we believe that exceptional cleaning services start with exceptional people. We're on a mission to professionalize the industry by treating our cleaners with the respect they deserve.
        </p>
      </section>

      {/* Image & Story */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] animate-in fade-in slide-in-from-left-8 delay-200 fill-mode-both">
            <img 
              src={aboutImg} 
              alt="TJ FreshSpace Team" 
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2074&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 delay-300 fill-mode-both">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-4 text-primary">Our Story</h2>
              <p className="text-foreground/70 leading-relaxed">
                Founded in 2018 in London, TJ FreshSpace started with a simple observation: cleaning agencies were focusing too much on clients and not enough on the cleaners themselves.
              </p>
              <br />
              <p className="text-foreground/70 leading-relaxed">
                We flipped the model. By prioritizing fair wages, robust training, and genuine support, we found that our staff stayed longer, worked happier, and ultimately delivered a far superior service to our clients. Today, we place hundreds of professionals every month in roles they love.
              </p>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="font-bold text-lg mb-4 text-primary">The TJ FreshSpace Promise</h3>
              <ul className="space-y-3">
                {[
                  "Never pay minimum wage when we can negotiate Living Wage.",
                  "Zero zero-hour contracts unless specifically requested by you.",
                  "Full transparency on job requirements and expectations."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-secondary/10 p-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">The principles that guide how we treat our candidates, our clients, and each other.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif text-primary">People First</h3>
              <p className="text-foreground/70">
                We see the person behind the CV. Your well-being, safety, and career progression are our top priorities.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif text-primary">Excellence</h3>
              <p className="text-foreground/70">
                We believe cleaning is a skilled profession. We provide the training and tools needed to excel and take pride in your work.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif text-primary">Integrity</h3>
              <p className="text-foreground/70">
                Honest communication, reliable payments, and transparent contracts. We do what we say we're going to do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-24 text-center">
        <div className="bg-primary text-primary-foreground p-12 md:p-20 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Become part of the story.</h2>
            <p className="text-primary-foreground/70 text-lg mb-10">
              Join a community of respected professionals and find a role that works for you.
            </p>
            <Link href="/jobs">
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 text-base px-8 py-6 h-auto shadow-lg">
                View Available Roles <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
