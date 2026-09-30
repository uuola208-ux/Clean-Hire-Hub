export default function Terms() {
  return (
    <div className="min-h-screen bg-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-foreground/50 mb-10">Last updated: 1 July 2025</p>

        <div className="bg-white rounded-3xl border border-border shadow-sm p-8 md:p-12 space-y-10 prose prose-slate max-w-none">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Agreement to Terms</h2>
            <p className="text-foreground/70 leading-relaxed">
              By accessing this website and submitting an application to TJ FreshSpace Recruitment Ltd ("the Company"), you agree to be bound by these Terms of Service. If you do not agree, please do not use this website or submit your details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Our Recruitment Services</h2>
            <p className="text-foreground/70 leading-relaxed mb-3">TJ FreshSpace provides free-to-use recruitment services for candidates seeking cleaning and housekeeping employment. We act as an employment business, introducing candidates to client employers on a temporary or permanent basis.</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li>We do not guarantee employment or placement upon application.</li>
              <li>Placement is subject to suitability assessment, right-to-work verification, and DBS checks where required.</li>
              <li>We reserve the right to decline applications at our discretion without providing reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Candidate Responsibilities</h2>
            <p className="text-foreground/70 leading-relaxed mb-3">As a candidate, you agree to:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li>Provide accurate, truthful, and complete information on your application.</li>
              <li>Notify us immediately if any circumstances change (e.g., right-to-work status, convictions).</li>
              <li>Not misrepresent your qualifications, experience, or identity.</li>
              <li>Maintain professional conduct with clients and the company at all times.</li>
              <li>Comply with the policies and procedures of any client employer to whom you are introduced.</li>
            </ul>
            <p className="text-foreground/70 leading-relaxed mt-3">Providing false information may result in immediate termination of any placement and potential legal action.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Right to Work</h2>
            <p className="text-foreground/70 leading-relaxed">
              We are legally required to verify your right to work in the UK before making any placement. You must provide original documents evidencing your right to work. We will not place any candidate who cannot demonstrate a legal right to work in the UK.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. DBS Checks</h2>
            <p className="text-foreground/70 leading-relaxed">
              Certain roles (e.g., domestic cleaning in vulnerable households) require a Disclosure and Barring Service (DBS) check. By applying for such roles, you consent to the Company initiating a DBS check on your behalf. The cost is borne by the Company. A criminal record does not necessarily disqualify you — we assess each case individually.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Pay & Engagement Terms</h2>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li>All rates of pay are as stated in your assignment confirmation and comply with National Minimum Wage legislation.</li>
              <li>Payment is made weekly, in arrears, via BACS bank transfer.</li>
              <li>You are responsible for providing accurate timesheets or shift confirmation records.</li>
              <li>Holiday pay accrues at 12.07% of earnings and is paid upon request or at the end of an assignment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Intellectual Property</h2>
            <p className="text-foreground/70 leading-relaxed">
              All content on this website — including text, images, logos, and design — is the property of TJ FreshSpace Recruitment Ltd and is protected by copyright law. You may not reproduce, distribute, or use any content without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Limitation of Liability</h2>
            <p className="text-foreground/70 leading-relaxed">
              The Company shall not be liable for: loss of earnings arising from a failed placement, any acts or omissions of a client employer, or indirect or consequential losses arising from use of this website. Our total liability in any circumstance shall not exceed £500.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">9. Governing Law</h2>
            <p className="text-foreground/70 leading-relaxed">
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">10. Contact</h2>
            <p className="text-foreground/70 leading-relaxed">
              For questions about these Terms, contact us at: <a href="mailto:legal@tjfreshspace.co.uk" className="text-secondary hover:underline">legal@tjfreshspace.co.uk</a> or write to TJ FreshSpace Recruitment Ltd, 124 Business Park Road, London, W1 4XY.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
