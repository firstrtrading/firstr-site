export default function NotFound() {
    return (
      <main className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-3">Page not found</h1>
          <p className="text-white/70 mb-6">That link might be old or moved.</p>
          <a href="/" className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
            Go home
          </a>
        </div>
      </main>
    );
  }