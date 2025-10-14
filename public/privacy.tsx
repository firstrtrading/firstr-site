import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head><title>Privacy — FirstR</title></Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-bold">Privacy</h1>
          <p className="mt-4 text-white/70 text-sm">
            Minimal analytics to improve performance and measure conversions.
            Manage cookies via your browser. We don’t sell personal data.
          </p>
          <p className="mt-4 text-white/70 text-sm">
            Contact: <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a>
          </p>
        </div>
      </main>
    </>
  );
}