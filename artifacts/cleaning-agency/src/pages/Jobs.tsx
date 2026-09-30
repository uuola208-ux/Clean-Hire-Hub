import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, MapPin, PoundSterling, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import jobsBgImg from "@assets/generated_images/jobs-bg.jpg";
import { useState } from "react";

const JOBS = [
  {
    id: "domestic-cleaner",
    title: "Domestic Cleaner",
    type: "Full-time / Part-time",
    location: "Various Locations",
    pay: "£12.50 – £14.00 / hr",
    description: "Provide high-quality cleaning services in private homes. You'll manage your own schedule and build relationships with regular clients. Perfect for those seeking flexible hours during the day.",
    requirements: ["Eye for detail", "Reliable and punctual", "Basic English communication", "Friendly and trustworthy"],
  },
  {
    id: "commercial-cleaner",
    title: "Commercial Cleaner",
    type: "Part-time (Evenings)",
    location: "City Centre & Business Parks",
    pay: "£13.00 – £15.00 / hr",
    description: "Maintain a pristine environment in offices, retail spaces, and corporate buildings. Usually out-of-hours work (early morning or evening), ideal as a second income or for night owls.",
    requirements: ["Ability to work independently", "Knowledge of commercial cleaning products", "Keyholding experience (preferred)", "Reliable timekeeping"],
  },
  {
    id: "office-cleaner",
    title: "Office Cleaner",
    type: "Part-time",
    location: "Corporate Offices",
    pay: "£12.50 – £13.50 / hr",
    description: "Ensure modern office spaces are clean, safe, and welcoming for employees. Duties include desk cleaning, kitchen maintenance, restroom upkeep, and waste management.",
    requirements: ["Professional demeanour", "Understanding of health & safety", "Consistent availability", "Good attention to detail"],
  },
  {
    id: "housekeeping",
    title: "Housekeeping",
    type: "Full-time",
    location: "Hotels & Hospitality",
    pay: "£13.50 – £16.00 / hr",
    description: "Join luxury hotel and hospitality teams to deliver 5-star cleanliness. Requires high standards of presentation and the ability to work efficiently in a fast-paced environment.",
    requirements: ["Previous housekeeping experience", "High physical stamina", "Team player mindset", "Flexible shift availability"],
  },
  {
    id: "supervisor",
    title: "Cleaning Supervisor",
    type: "Full-time",
    location: "Regional",
    pay: "£28,000 – £32,000 / yr",
    description: "Lead and manage teams of cleaners across multiple commercial sites. You'll be responsible for quality control, staff training, scheduling, rotas, and client liaison.",
    requirements: ["2+ years cleaning experience", "Leadership & people skills", "Valid UK driving licence", "Strong organisational skills"],
  },
];

const FAQS = [
  {
    q: "Do I need previous cleaning experience to apply?",
    a: "No — many of our roles, especially domestic and office cleaning, are open to people with no formal cleaning experience. We look for reliability, a strong work ethic, and a positive attitude. Full training is provided.",
  },
  {
    q: "How long does the application process take?",
    a: "Once we receive your application, our recruitment team aims to respond within 48 hours. If shortlisted, we'll conduct a brief phone interview followed by right-to-work verification. Most candidates are placed within 1–2 weeks.",
  },
  {
    q: "Will I need a DBS check?",
    a: "Some roles — particularly domestic cleaning in private homes or work with vulnerable adults — require a DBS (Disclosure and Barring Service) check. We cover the cost of all DBS checks and will let you know if your role requires one.",
  },
  {
    q: "How and when will I be paid?",
    a: "All workers are paid weekly, in arrears, directly to your bank account via BACS transfer. Pay day is every Friday for hours worked the previous week.",
  },
  {
    q: "Can I work part-time or choose my own hours?",
    a: "Absolutely. Many of our roles offer flexible scheduling. When you apply, simply tell us your preferred hours and days and we'll do our best to match you with suitable placements.",
  },
  {
    q: "What documents do I need to provide?",
    a: "You'll need proof of identity (passport or photo ID), proof of your right to work in the UK, and proof of address. Some roles may also require your National Insurance number and a DBS certificate. You can upload these during your application or bring them to your first meeting with us.",
  },
];

export default function Jobs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${jobsBgImg})` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Available Roles</h1>
            <p className="text-lg text-primary-foreground/80">
              Browse our current opportunities and find the position that matches your skills, schedule, and career goals.
            </p>
            <div className="flex gap-4 mt-8 text-sm text-primary-foreground/70">
              <span className="bg-white/10 px-3 py-1 rounded-full">{JOBS.length} roles open</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">UK-wide placements</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">Weekly pay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {JOBS.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-2xl p-6 md:p-8 hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-primary mb-3">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-secondary" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> {job.location}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-secondary"><PoundSterling className="h-4 w-4" /> {job.pay}</span>
                  </div>
                </div>
                <Link href={`/apply?position=${job.id}`}>
                  <Button className="w-full md:w-auto rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-md shrink-0">
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
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary/50 shrink-0" /> {req}
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

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-primary mb-3">Frequently Asked Questions</h2>
            <p className="text-foreground/60">Everything you need to know before applying.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left gap-4 hover:bg-muted/20 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-primary">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-5 w-5 text-secondary shrink-0" />
                    : <ChevronDown className="h-5 w-5 text-foreground/40 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-foreground/70 text-sm leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
