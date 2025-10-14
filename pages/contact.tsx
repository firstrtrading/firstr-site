import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact — FirstR</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Contact</h1>
            <p className="text-white/60 text-sm">We usually reply within 1–2 business days.</p>
          </header>

          <section className="space-y-4 text-white/80 text-sm leading-relaxed">
            <p>
              • Email: <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a><br />
              • Discord: (coming soon)
            </p>

            <p className="text-white/60">
              Please include your order email and any relevant details so we can help faster.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}