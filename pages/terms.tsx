import Head from "next/head";

export default function TermsPage() {
  const LAST_UPDATED = "October 15, 2025";
  return (
    <>
      <Head>
        <title>Terms & Conditions — FirstR</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Terms & Conditions</h1>
            <p className="text-white/60 text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <section className="space-y-4 text-white/80 text-sm leading-relaxed">
            <p>
              Welcome to FirstR (“we”, “us”, “our”). By accessing or using firstr.co and any related
              materials, files, or communities (the “Services”), you agree to these Terms.
              If you do not agree, do not use the Services.
            </p>

            <h2 className="text-xl font-semibold text-white">1) Educational Use Only</h2>
            <p>
              FirstR provides educational content about trading process and risk management.
              We do not provide investment advice, trade alerts, broker services, or portfolio
              management. Nothing in our materials is a recommendation to buy or sell any security,
              currency, or instrument. Use a paper (simulated) account while learning.
            </p>

            <h2 className="text-xl font-semibold text-white">2) No Results Promised</h2>
            <p>
              Trading involves risk, including the possible loss of all capital. Past performance
              is not indicative of future results. Your outcomes depend on your own skills, decisions,
              and market conditions. We make no earnings claims or guarantees.
            </p>

            <h2 className="text-xl font-semibold text-white">3) Eligibility</h2>
            <p>
              You must be at least 18, or use the Services only with a parent/guardian’s permission.
              You are responsible for complying with your local laws.
            </p>

            <h2 className="text-xl font-semibold text-white">4) License & IP</h2>
            <p>
              Upon purchase, you receive a personal, non-transferable, non-commercial license
              to access the files. You may not resell, share, re-upload, or redistribute our content.
              “FirstR” and associated marks are our property.
            </p>

            <h2 className="text-xl font-semibold text-white">5) Accounts & Access</h2>
            <p>
              Keep your login secure. We may suspend or terminate access for abuse, sharing accounts,
              piracy, or violation of these Terms.
            </p>

            <h2 className="text-xl font-semibold text-white">6) Payments</h2>
            <p>
              Payments are processed by our commerce provider (e.g., Whop). Taxes may apply.
              See our <a className="underline" href="/returns">Returns & Refunds</a> for policy details.
            </p>

            <h2 className="text-xl font-semibold text-white">7) Disclaimers (Including CFTC 4.41)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Hypothetical or simulated performance has limitations; no representation is made
                that any account will or is likely to achieve profits or losses similar to those shown.
              </li>
              <li>
                Simulated results do not represent actual trading and may under- or over-compensate
                for market factors (e.g., liquidity).
              </li>
              <li>
                All information is for education only and provided “as is” without warranties.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-white">8) Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for indirect, incidental,
              special, or consequential damages arising from your use of the Services. Your sole
              remedy is to stop using the Services.
            </p>

            <h2 className="text-xl font-semibold text-white">9) Third-Party Links</h2>
            <p>
              We may link to third-party sites or tools. We do not control or endorse them and are
              not responsible for their content or policies.
            </p>

            <h2 className="text-xl font-semibold text-white">10) Changes</h2>
            <p>
              We may update these Terms at any time by posting a new version on this page.
              Continued use means you accept the changes.
            </p>

            <h2 className="text-xl font-semibold text-white">11) Contact</h2>
            <p>
              Questions? Email <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a>.
              This page is for general information only and is not legal advice.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}