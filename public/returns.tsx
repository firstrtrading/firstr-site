import Head from "next/head";

export default function Returns() {
  return (
    <>
      <Head><title>Returns — FirstR</title></Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-bold">Returns</h1>
          <p className="mt-4 text-white/70 text-sm">
            Refunds within 7 days if files weren’t downloaded.
            If you complete all 7 modules and submit your written rules + one filled journal page and still don’t feel more confident, contact us for a refund per the Finish-the-Sprint Guarantee.
          </p>
          <p className="mt-4 text-white/70 text-sm">
            Support: <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a>
          </p>
        </div>
      </main>
    </>
  );
}