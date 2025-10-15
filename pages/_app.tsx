// pages/_app.tsx
import "../styles/globals.css";           // <-- IMPORTANT: your Tailwind/global CSS
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}