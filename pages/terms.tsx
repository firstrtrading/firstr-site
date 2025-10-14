import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head><title>Terms — FirstR</title></Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-bold">Terms</h1>
          <p className="mt-4 text-white/70 text-sm">
            Educational content only. No investment advice or trade alerts.
          </p>
          <p className="mt-4 text-white/70 text-sm">
            Digital products are delivered via Whop. See Returns for eligibility.
          </p>
        </div>
      </main>
    </>
  );
}