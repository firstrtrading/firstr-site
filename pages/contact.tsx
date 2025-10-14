import Head from "next/head";

export default function Contact() {
  return (
    <>
      <Head>
        <title>FirstR — Contact</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl font-bold">Contact</h1>
          <div className="prose prose-invert mt-8">
            <p>Email: <a href="mailto:support@firstr.co">support@firstr.co</a></p>
            <p>Discord (for Labs): invite link will be provided inside Whop after purchase.</p>
          </div>
        </div>
      </main>
    </>
  );
}