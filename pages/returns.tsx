import Head from "next/head";

export default function ReturnsPage() {
  const LAST_UPDATED = "October 15, 2025";
  return (
    <>
      <Head>
        <title>Returns & Refunds — FirstR</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Returns & Refunds</h1>
            <p className="text-white/60 text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <section className="space-y-4 text-white/80 text-sm leading-relaxed">
            <p>
              FirstR sells digital educational content. Because access is delivered instantly,
              returns are generally not possible. That said, we want you to be happy with your purchase.
            </p>

            <h2 className="text-xl font-semibold text-white">Refund Window</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-white">7-day review period:</span> If you have not downloaded the files or
                accessed gated content beyond the sample preview, you may request a refund within 7 days of purchase.
              </li>
              <li>
                Once files are downloaded or substantial gated content is accessed, the purchase is final.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-white">Upgrades</h2>
            <p>
              If you bought Base and upgrade to Pro within 7 days, contact us—at our discretion we may credit your Base price
              toward Pro.
            </p>

            <h2 className="text-xl font-semibold text-white">Bundles / Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-medium text-white">Labs (monthly):</span> cancel anytime going forward; prior charges are non-refundable.</li>
              <li>Split-payments: by choosing a payment plan, you agree to complete all installments.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white">How to request</h2>
            <p>
              Email <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a> from your purchase email with order ID and reason.
              Refunds (when approved) go back to the original payment method.
            </p>

            <p className="text-white/60">
              Payments are processed by our commerce provider (e.g., Whop). Their terms may also apply.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}