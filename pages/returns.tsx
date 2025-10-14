import Head from "next/head";

export default function Returns() {
  return (
    <>
      <Head>
        <title>FirstR — Refunds & Returns</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl font-bold">Refunds & Returns</h1>
          <div className="prose prose-invert mt-8">
            <h2>Finish-the-Sprint Guarantee</h2>
            <p>
              Complete all 7 modules and submit your written rules plus one filled
              journal page within 7 days. If you don’t feel more confident about
              your process, email us for a refund.
            </p>
            <ul>
              <li>Digital download activity may be used to validate eligibility.</li>
              <li>Refund requests: <a href="mailto:support@firstr.co">support@firstr.co</a>.</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}