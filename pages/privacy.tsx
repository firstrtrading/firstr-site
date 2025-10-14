import Head from "next/head";

export default function PrivacyPage() {
  const LAST_UPDATED = "October 15, 2025";
  return (
    <>
      <Head>
        <title>Privacy Policy — FirstR</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-white/60 text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <section className="space-y-4 text-white/80 text-sm leading-relaxed">
            <p>
              This Policy explains how FirstR (“we”, “us”) collects, uses, and safeguards information
              when you access firstr.co and related Services.
            </p>

            <h2 className="text-xl font-semibold text-white">1) What We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-white">Account & Purchase Data:</span> email, name (if provided),
                product purchased, timestamps (via our commerce provider).
              </li>
              <li>
                <span className="font-medium text-white">Usage Data:</span> device type, pages viewed, approximate
                location, referrer—used for analytics and performance.
              </li>
              <li>
                <span className="font-medium text-white">Support:</span> messages you send us (e.g., email).
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-white">2) How We Use It</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide access to files and updates you purchased.</li>
              <li>Improve site performance and measure conversions.</li>
              <li>Prevent abuse and secure our Services.</li>
              <li>Communicate about your account, important updates, or new educational content.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white">3) Cookies & Analytics</h2>
            <p>
              We use cookies and analytics (only after your consent, if required) to understand usage
              and improve the experience. You can manage cookies via your browser settings.
            </p>

            <h2 className="text-xl font-semibold text-white">4) Sharing</h2>
            <p>
              We do not sell your personal information. We share limited data with service providers
              (e.g., hosting, commerce, analytics) under contracts that restrict their use to providing
              services for us. We may disclose information if required by law.
            </p>

            <h2 className="text-xl font-semibold text-white">5) Data Security</h2>
            <p>
              We apply reasonable technical and organizational measures to protect data.
              However, no method is 100% secure. You are responsible for safeguarding your
              account credentials.
            </p>

            <h2 className="text-xl font-semibold text-white">6) Your Choices</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Unsubscribe links in non-essential emails.</li>
              <li>Request access or deletion: <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a>.</li>
              <li>Control cookies in your browser settings.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white">7) Children</h2>
            <p>
              Our Services are not directed to children under 13. If you believe a minor provided
              personal data without consent, contact us to delete it.
            </p>

            <h2 className="text-xl font-semibold text-white">8) International</h2>
            <p>
              Data may be processed outside your country. By using the Services, you consent to
              such transfers as permitted by law.
            </p>

            <h2 className="text-xl font-semibold text-white">9) Changes</h2>
            <p>
              We may update this Policy. Material changes will be reflected by updating the “Last updated”
              date above.
            </p>

            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p>
              Email <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}