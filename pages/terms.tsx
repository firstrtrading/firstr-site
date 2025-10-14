import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>FirstR — Terms</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-4 text-white/70 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert mt-8">
            <h2>1. Overview</h2>
            <p>FirstR provides educational materials and templates to help you build a personal trading process.</p>

            <h2>2. Education, not advice</h2>
            <p>We do not provide financial advice or trade alerts. Any examples are for education only.</p>

            <h2>3. Eligibility</h2>
            <p>You’re responsible for complying with your local laws and platform rules.</p>

            <h2>4. Payments</h2>
            <p>Digital products are delivered immediately after purchase via your Whop account.</p>

            <h2>5. Prohibited use</h2>
            <p>No redistribution, reselling, or sharing of files outside your household/team.</p>

            <h2>6. Changes</h2>
            <p>We may update these terms. Continued use means you accept the new version.</p>

            <h2>7. Contact</h2>
            <p>Questions? Email <a href="mailto:support@firstr.co">support@firstr.co</a>.</p>
          </div>
        </div>
      </main>
    </>
  );
}