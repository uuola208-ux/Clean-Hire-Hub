export default function Privacy() {
  return (
    <div className="min-h-screen bg-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-foreground/50 mb-10">Last updated: 1 July 2025</p>

        <div className="bg-white rounded-3xl border border-border shadow-sm p-8 md:p-12 space-y-10 prose prose-slate max-w-none">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Who We Are</h2>
            <p className="text-foreground/70 leading-relaxed">
              TJ FreshSpace Recruitment Ltd ("we", "us", "our") is a cleaning industry recruitment agency registered in England and Wales. Our registered office is 124 Business Park Road, London, W1 4XY. We are the data controller for personal data collected via this website and during the recruitment process.
            </p>
            <p className="text-foreground/70 leading-relaxed mt-3">
              Contact: <a href="mailto:privacy@tjfreshspace.co.uk" className="text-secondary hover:underline">privacy@tjfreshspace.co.uk</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. What Personal Data We Collect</h2>
            <p className="text-foreground/70 leading-relaxed mb-3">We collect the following categories of personal data when you use our services:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li><strong>Identity data:</strong> full name, date of birth, nationality, photograph (if provided on ID documents).</li>
              <li><strong>Contact data:</strong> email address, phone number, postal address.</li>
              <li><strong>Employment data:</strong> employment history, skills, availability, references.</li>
              <li><strong>Compliance data:</strong> National Insurance number, right-to-work documents, DBS certificate number and status, driving licence details.</li>
              <li><strong>Documents:</strong> CV, passport copy, proof of address, cleaning certificates.</li>
              <li><strong>Technical data:</strong> IP address, browser type, pages visited (via cookies).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. How We Use Your Data</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-foreground/70 border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="p-3 font-semibold text-primary border border-border">Purpose</th>
                    <th className="p-3 font-semibold text-primary border border-border">Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Processing your job application", "Legitimate interests / Pre-contractual steps"],
                    ["Verifying right to work in the UK", "Legal obligation (Immigration Act 2014)"],
                    ["Conducting DBS checks", "Legal obligation / Legitimate interests"],
                    ["Matching you with suitable roles", "Legitimate interests"],
                    ["Sending you role updates and opportunities", "Consent (withdrawable at any time)"],
                    ["Responding to your enquiries", "Legitimate interests"],
                    ["Maintaining statutory recruitment records", "Legal obligation"],
                  ].map(([purpose, basis], i) => (
                    <tr key={i} className="border border-border even:bg-muted/20">
                      <td className="p-3 border border-border">{purpose}</td>
                      <td className="p-3 border border-border">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Data Sharing</h2>
            <p className="text-foreground/70 leading-relaxed mb-3">We will only share your personal data with:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li><strong>Prospective employers</strong> — with your explicit consent, to facilitate job placements.</li>
              <li><strong>DBS checking services</strong> — where a role requires a criminal record check.</li>
              <li><strong>IT service providers</strong> — who host and maintain our systems (bound by data processing agreements).</li>
              <li><strong>Regulatory or legal authorities</strong> — where required by law (e.g. HMRC, Home Office).</li>
            </ul>
            <p className="text-foreground/70 leading-relaxed mt-3">We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Data Retention</h2>
            <p className="text-foreground/70 leading-relaxed">
              Unsuccessful applicant data is retained for <strong>12 months</strong> after the application closes, after which it is securely deleted. Data for placed candidates is retained for <strong>6 years</strong> from the end of the employment relationship to comply with statutory obligations. You may request earlier deletion (see Section 7).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Cookies</h2>
            <p className="text-foreground/70 leading-relaxed">
              We use essential cookies required for the website to function, and optional analytics cookies to understand how visitors use the site. You can manage your cookie preferences via the cookie banner on your first visit or by contacting us. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Your Rights Under UK GDPR</h2>
            <p className="text-foreground/70 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li><strong>Access</strong> the personal data we hold about you (Subject Access Request).</li>
              <li><strong>Rectify</strong> inaccurate or incomplete data.</li>
              <li><strong>Erase</strong> your data ("right to be forgotten") where there is no overriding legal basis to retain it.</li>
              <li><strong>Restrict</strong> processing while a dispute is being resolved.</li>
              <li><strong>Data portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong>Object</strong> to processing based on legitimate interests.</li>
              <li><strong>Withdraw consent</strong> at any time where processing is consent-based.</li>
            </ul>
            <p className="text-foreground/70 leading-relaxed mt-3">
              To exercise any right, email <a href="mailto:privacy@tjfreshspace.co.uk" className="text-secondary hover:underline">privacy@tjfreshspace.co.uk</a>. We will respond within 30 days. You also have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Information Commissioner's Office (ICO)</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Security</h2>
            <p className="text-foreground/70 leading-relaxed">
              We use industry-standard security measures including encrypted data transmission (TLS), access controls, and regular security reviews to protect your data. In the event of a data breach that poses a risk to your rights, we will notify you and the ICO within 72 hours as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">9. Changes to This Policy</h2>
            <p className="text-foreground/70 leading-relaxed">
              We may update this Privacy Policy from time to time. The "last updated" date at the top of the page will reflect any changes. Continued use of our services after updates constitutes acceptance of the revised policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
