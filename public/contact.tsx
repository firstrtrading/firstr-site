import Head from "next/head";

export default function Contact() {
  return (
    <>
      <Head><title>Contact — FirstR</title></Head>
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-bold">Contact</h1>
          <p className="mt-4 text-white/70 text-sm">
            Fastest: <a className="underline" href="mailto:support@firstr.co">support@firstr.co</a>
          </p>
          <p className="mt-2 text-white/70 text-sm">
            For order issues, include your Whop email and which product (Base / Pro / Labs).
          </p>
        </div>
      </main>
    </>
  );
}