import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, MapPin, PoundSterling, ArrowRight } from "lucide-react";
import jobsBgImg from "@assets/generated_images/jobs-bg.jpg";

const JOBS = [
  {
    id: "domestic-cleaner",
    title: "Domestic Cleaner",
    type: "Full-time / Part-time",
    location: "Various Locations",
    pay: "£12.50 - £14.00 / hr",
    description: "Provide high-quality cleaning services in private homes. You'll manage your own schedule and build relationships with regular clients. Perfect for those seeking flexible hours during the day.",
    requirements: ["Eye for detail", "Reliable and punctual", "Basic English communication"]
  },
  {
    id: "commercial-cleaner",
    title: "Commercial Cleaner",
    type: "Part-time (Evenings)",
    location: "City Centre & Business Parks",
    pay: "£13.00 - £15.00 / hr",
    description: "Maintain a pristine environment in offices, retail spaces, and corporate buildings. Usually out-of-hours work (early morning or evening), ideal as a second income or for night owls.",
    requirements: ["Ability to work independently", "Knowledge of commercial cleaning products", "Keyholding experience (preferred)"]
  },
  {
    id: "office-cleaner",
    title: "Office Cleaner",
    type: "Part-time",
    location: "Corporate Offices",
    pay: "£12.50 - £13.50 / hr",
    description: "Ensure modern office spaces are clean, safe, and welcoming for employees. Duties include desk cleaning, kitchen maintenance, and waste management.",
    requirements: ["Professional demeanor", "Understanding of health & safety", "Consistent availability"]
  },
  {
    id: "housekeeping",
    title: "Housekeeping",
    type: "Full-time",
    location: "Hotels & Hospitality",
    pay: "£13.50 - £16.00 / hr",
    description: "Join luxury hotel and hospitality teams to deliver 5-star cleanliness. Requires high standards of presentation and the ability to work efficiently in a fast-paced environment.",
    requirements: ["Previous housekeeping experience", "High physical stamina", "Team player mindset"]
  },
  {
    id: "supervisor",
    title: "Cleaning Supervisor",
    type: "Full-time",
    location: "Regional",
    pay: "£28,000 - £32,000 / yr",
    description: "Lead and manage teams of cleaners across multiple commercial sites. You'll be responsible for quality control, staff training, scheduling, and client liaison.",
    requirements: ["2+ years cleaning experience", "Leadership skills", "Valid driving licence"]
  }
];

export default function Jobs() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url(${jobsBgImg})` }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Available Roles</h1>
            <p className="text-lg text-primary-foreground/80">
              Browse our current opportunities and find the position that matches your skills, schedule, and career goals.
            </p>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {JOBS.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-6 md:p-8 hover-elevate transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-primary mb-3">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-secondary" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> {job.location}</span>
                    <span className="flex items-center gap-1.5 font-medium text-primary"><PoundSterling className="h-4 w-4 text-secondary" /> {job.pay}</span>
                  </div>
                </div>
                <Link href={`/apply?position=${job.id}`}>
                  <Button className="w-full md:w-auto rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-md">
                    Apply for this role
                  </Button>
                </Link>
              </div>

              <div className="prose prose-sm max-w-none text-foreground/80 mb-6">
                <p>{job.description}</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Key Requirements
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-foreground/70 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center bg-secondary/10 rounded-3xl p-10 border border-secondary/20">
          <h3 className="text-2xl font-bold font-serif text-primary mb-4">Don't see the right fit?</h3>
          <p className="text-foreground/70 mb-8 max-w-lg mx-auto">
            We're always looking for great people. Submit a general application and we'll contact you when a suitable role opens up.
          </p>
          <Link href="/apply">
            <Button variant="outline" size="lg" className="rounded-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors">
              Submit General Application <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
