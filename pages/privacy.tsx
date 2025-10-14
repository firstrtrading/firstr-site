import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>FirstR — Privacy</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-white/70 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert mt-8">
            <h2>What we collect</h2>
            <p>Basic order details from Whop (so we can deliver your files) and any messages you send us.</p>

            <h2>Cookies & analytics</h2>
            <p>We may use basic analytics to understand site performance. You can manage cookies in your browser.</p>

            <h2>Data sharing</h2>
            <p>We don’t sell your data. We only share with service providers needed to run the product (e.g., Whop).</p>

            <h2>Your rights</h2>
            <p>Request access or deletion anytime: <a href="mailto:support@firstr.co">support@firstr.co</a>.</p>
          </div>
        </div>
      </main>
    </>
  );
}