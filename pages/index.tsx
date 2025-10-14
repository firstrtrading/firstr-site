import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head"; // ← add this line

export default function Landing() {
    // ===== Replace with your real links =====
    const JOIN_BASE_URL = "https://whop.com/firstr/firstr-base";
    const JOIN_PRO_URL = "https://whop.com/firstr/firstr-pro";
    const LABS_URL = "https://whop.com/firstr/firstr-labs";
    // Links used in CTAs
    const OVERVIEW_URL = "#overview";                  // anchor for the hero video
    const SAMPLE_DAY1_URL = "/samples/FirstR_Day1.pdf"; // drop file in /public/samples
    const SAMPLE_TOOL_URL = "/samples/Sizing_Tool.csv"; // drop file in /public/samples
    const SHOW_PROGRESS_WALL = false;
    // ========================================

    // Consent banner
    const [consent, setConsent] = useState(false);
    useEffect(() => {
        try { setConsent(localStorage.getItem("consent") === "granted"); } catch { }
    }, []);
    const grantConsent = () => { try { localStorage.setItem("consent", "granted"); } catch { } setConsent(true); };

    // Capture UTM/affiliate and prefetch join URLs
    useEffect(() => {
        if (typeof window === "undefined") return;
        const q = new URLSearchParams(window.location.search);
        const params: Record<string, string> = {} as any;
        ["utm_source", "utm_medium", "utm_campaign", "aff"].forEach(k => { const v = q.get(k); if (v) params[k] = v; });
        if (Object.keys(params).length) {
            try { localStorage.setItem("utm_params", JSON.stringify(params)); } catch { }
        }
        // Prefetch join pages
        [JOIN_BASE_URL, JOIN_PRO_URL, LABS_URL].forEach(href => {
            const link = document.createElement("link");
            link.rel = "prefetch"; link.href = href; link.as = "document"; document.head.appendChild(link);
        });
    }, []);

    const appendUTM = useCallback((url: string) => {
        try {
            const s = localStorage.getItem("utm_params");
            if (!s) return url;
            const u = new URL(url, window.location.origin);
            const params = JSON.parse(s);
            Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
            return u.toString();
        } catch { return url; }
    }, []);

    const joinBaseHref = useMemo(() => appendUTM(JOIN_BASE_URL), [appendUTM]);
    const joinProHref = useMemo(() => appendUTM(JOIN_PRO_URL), [appendUTM]);
    const labsHref = useMemo(() => appendUTM(LABS_URL), [appendUTM]);

    // Cohort seats (live counter with fallback)
    const [seatsLeft, setSeatsLeft] = useState(150);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch("/api/seats", { cache: "no-store" });
                if (!res.ok) return; const data = await res.json();
                if (mounted && typeof data.seats === "number") setSeatsLeft(Math.max(0, data.seats));
            } catch {/* ignore network errors */ }
        })();
        return () => { mounted = false; };
    }, []);

    // Prefers reduced motion?
    const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hero parallax (subtle)
    const heroRef = useRef<HTMLElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null); // ← ADD THIS
    const [parallax, setParallax] = useState({ x: 0, y: 0 });
    function onHeroMouseMove(e: React.MouseEvent) {
        if (prefersReduced) return;
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width; // -0.5 .. 0.5
        const dy = (e.clientY - cy) / rect.height;
        setParallax({ x: dx * 6, y: dy * 6 }); // max 6px
    }

    // One‑time CTA shine
    const [shineOnce, setShineOnce] = useState(true);
    useEffect(() => { const t = setTimeout(() => setShineOnce(false), 1200); return () => clearTimeout(t); }, []);

    // Toast when sample downloads
    const [toast, setToast] = useState("");
    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2100); }

    // Confetti microburst on join
    const [confetti, setConfetti] = useState(false);
    function triggerConfetti() { if (prefersReduced) return; setConfetti(true); setTimeout(() => setConfetti(false), 700); }

    // Ripple helper (adds a radial pulse at click point)
    function ripple(e: React.MouseEvent) {
        const t = e.currentTarget as HTMLElement;
        if (!t) return;
        const rect = t.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        t.style.setProperty("--rx", `${x}px`); t.style.setProperty("--ry", `${y}px`);
        t.classList.remove("do-ripple"); void t.offsetWidth; t.classList.add("do-ripple");
    }

    // ← ADD THIS directly below ripple()
    function onWatchVideo(e: React.MouseEvent) {
        ripple(e);
        e.preventDefault();               // stop the anchor jump
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;                // start from the beginning
        v.play().catch(() => { });         // ignore autoplay blocks
    }

    // Smooth anchor scrolling (header offset aware)
    const headerRef = useRef<HTMLElement | null>(null);
    function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
        const href = e.currentTarget.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return; // external link
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = headerRef.current?.offsetHeight || 72;
        const y = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    }

    // Scroll spy (highlight active nav)
    const [activeId, setActiveId] = useState<string>("inside");
    useEffect(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>(".anchor[id]"));
        const obs = new IntersectionObserver((entries) => {
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible[0]) setActiveId((visible[0].target as HTMLElement).id);
        }, { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] });
        sections.forEach(sec => obs.observe(sec));
        return () => obs.disconnect();
    }, []);

    // Back to top button
    const [showTop, setShowTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.4);
        window.addEventListener('scroll', onScroll); onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ====== Quiz (recommend Base vs Pro) ======
    const [quizIdx, setQuizIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]); // 1 yes, 0 no
    const quiz = [
        { q: "Do you already journal trades?" },
        { q: "Do you understand position sizing (risk %) already?" },
        { q: "Do you want extra drills/templates?" },
        { q: "Will you complete the sprint in 7 days?" },
    ];
    const quizDone = quizIdx >= quiz.length;
    const quizYes = answers.reduce((a, b) => a + b, 0);
    const quizReco = quizDone ? (quizYes >= 2 ? "Pro" : "Base") : null;

    // === Lightweight runtime tests (run with ?runTests=1) ===
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!window.location.search.includes("runTests=1")) return;
        console.group("Landing smoke tests");
        console.assert(typeof showToast === "function", "showToast exists");
        console.assert(typeof triggerConfetti === "function", "triggerConfetti exists");
        console.assert(typeof handleAnchorClick === "function", "handleAnchorClick exists");
        console.assert(!!document.querySelector('#pricing'), '#pricing exists');
        // Extra tests
        try {
            const navs = Array.from(document.querySelectorAll('nav a'));
            console.assert(navs.length >= 4, 'nav links present');
            const hasStray = navs.some((a: any) => String((a as HTMLElement).className).includes("'"));
            console.assert(!hasStray, 'no stray quotes in className');
            console.assert(!document.querySelector('.scroll-progress'), 'no scroll progress bar');
            console.assert(!document.querySelector('.cursor-glow'), 'no cursor glow element');
        } catch (e) { console.warn('nav test skipped', e); }
        try {
            const btn = document.querySelector('[data-test="faq-btn-0"]') as HTMLButtonElement | null;
            if (btn) {
                const before = btn.getAttribute('aria-expanded');
                btn.click();
                const after = btn.getAttribute('aria-expanded');
                console.assert(before !== after, 'FAQ toggles on click');
                btn.click();
            } else { console.warn('FAQ toggle test skipped'); }
        } catch (e) { console.warn('FAQ test error', e); }
        try {
            const ld = document.querySelector('script[type="application/ld+json"]');
            console.assert(!!ld, 'JSON-LD present');
        } catch { }
        console.groupEnd();
    }, []);
    // =======================================================

    // Variants
    const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } } as const;
    const stagger = { show: { transition: { staggerChildren: 0.08 } } } as const;

    const qaVariants = {
        enter: { opacity: 0, y: 16, scale: 0.98 },
        center: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 20 } },
        exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.2 } },
    } as const;


    return (
          <>
            <Head>
                <title>FirstR — 7-Day Trading Starter Sprint</title>
                <meta name="description" content="FirstR: a risk-first, 7-day starter sprint. Learn markets, orders, risk, backtesting, journalling — finish with a written trading plan." />
                <meta property="og:title" content="FirstR — 7-Day Trading Starter Sprint" />
                <meta property="og:description" content="Risk-first. Plan-first. Finish with a written plan and a journal." />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/1R_White.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
                <link rel="icon" href="/1R_Black.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
            </Head>

        <main className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30 selection:text-white">
            {/* NAV */}
            <header ref={headerRef} className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-neutral-950/70">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src="/1R_Glow.svg"
                                alt="FirstR logo"
                                className="h-10 w-10 md:h-12 md:w-12 shrink-0"
                            />
                            <span className="font-semibold tracking-normal text-base md:text-lg -ml-1 md:-ml-1.5">
                                FirstR
                            </span>
                        </div>
                    <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
                        <a href="#inside" onClick={handleAnchorClick} className={`navlink hover:text-white ${activeId === "inside" ? "active" : ""}`}>What's inside</a>
                        <a href="#curriculum" onClick={handleAnchorClick} className={`navlink hover:text-white ${activeId === "curriculum" ? "active" : ""}`}>Curriculum</a>
                        <a href="#pricing" onClick={handleAnchorClick} className={`navlink hover:text-white ${activeId === "pricing" ? "active" : ""}`}>Pricing</a>
                        <a href="#faq" onClick={handleAnchorClick} className={`navlink hover:text-white ${activeId === "faq" ? "active" : ""}`}>FAQ</a>
                    </nav>
                        <div className="flex items-center gap-2">
                            <a
                                href={joinBaseHref}
                                onClick={ripple}
                                className="rounded-xl px-4 py-2 text-sm bg-white/10 hover:bg-white/20"
                            >
                                Join Base
                            </a>
                            <a
                                href={joinProHref}
                                onClick={(e) => { ripple(e); triggerConfetti(); }}
                                className={`rounded-xl px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 ${shineOnce ? "animate-shine" : ""}`}
                            >
                                Join Pro
                            </a>
                        </div>
                </div>
            </header>

            {/* HERO */}
            <section ref={heroRef} onMouseMove={onHeroMouseMove} className="relative overflow-hidden border-b border-white/10">
                <motion.div aria-hidden className="absolute inset-0" style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}>
                    <div className="absolute inset-0 bg-[radial-gradient(80rem_40rem_at_50%_-10%,rgba(59,130,246,0.25),transparent)] animate-drift" />
                </motion.div>
                <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
                                <motion.p variants={fadeUp} className="mb-3 text-xs uppercase tracking-widest text-blue-300/80">Process first • Build your own plan</motion.p>
                                <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold leading-tight"><AnimatedHeadline text="The FirstR Sprint — 7-Day Trading Starter" /></motion.h1>
                            <motion.p variants={fadeUp} className="mt-4 text-white/70 md:text-lg max-w-prose">Learn the core mechanics, write your rules, backtest, and journal. Finish with a real, written plan and a repeatable routine.</motion.p>
                                <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                                    <a href={joinProHref} onClick={(e) => { ripple(e); triggerConfetti(); }} className="btn-primary">Join Pro</a>
                                    <a href={joinBaseHref} onClick={ripple} className="btn-ghost">Join Base</a>
                                    <a href={OVERVIEW_URL} onClick={onWatchVideo} className="btn-ghost">
                                        Watch 60s overview
                                    </a>
                                </motion.div>
                                <motion.div variants={fadeUp} className="mt-2 flex items-center gap-2 text-xs text-white/70">
                                    <span className="inline-flex items-center gap-1.5">
                                        <img
                                            src="/tick_glow.svg"     // or "/tick_glow.png"
                                            alt=""                   // decorative
                                            className="h-5 w-5 -mt-px select-none pointer-events-none"
                                        />
                                        Finish-the-Sprint Guarantee{" "}
                                        <a href="#refund-policy" onClick={handleAnchorClick} className="underline text-white/80">
                                            (policy)
                                        </a>
                                    </span>
                                </motion.div>
                                <motion.div variants={fadeUp} className="mt-4 text-xs text-white/60">Trusted worldwide • 7-day starter sprint</motion.div>
                        </motion.div>
                            <div className="md:pl-6">
                                {/* anchor for the Watch 60s overview link */}
                                <motion.div
                                    id="overview"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="group perspective"
                                >
                                    <div className="aspect-[16/9] w-full rounded-2xl border border-white/10 bg-neutral-900/80 overflow-hidden transform-gpu transition will-change-transform group-hover:[transform:rotateX(2deg)_rotateY(-2deg)]">
                                        <video
                                            ref={videoRef}
                                            src="/video/FirstR-overview.mp4"
                                            poster="/video/FirstR-poster.jpg"
                                            controls
                                            playsInline
                                            preload="metadata"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                    </div>
                </div>
            </section>

            {/* METRICS STRIP */}
            <section className="border-b border-white/10 bg-neutral-900/40">
                <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <MetricCard label="Days" value={7} />
                    <MetricCard label="Tools" value={3} />
                    <MetricCard label="Outcome" valueText="1 written plan" />
                    <MetricCard label="Cohort seats" value={seatsLeft} />
                </div>
            </section>

            {/* TRUST */}


            {/* WHAT'S INSIDE */}
            <section id="inside" className="anchor border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <h2 className="text-2xl md:text-3xl font-bold">What's inside the sprint</h2>
                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "7 short lessons",
                                    body: "Markets, orders, risk, frameworks, backtesting, journalling, execution.",
                                    icon: "/seven_badge.svg", alt: "Seven short lessons"
                                },
                                {
                                    title: "Risk tools",
                                    body: "Position size, expectancy & drawdown spreadsheets (CSV/Sheets).",
                                    icon: "/risk-tools.svg", alt: "Risk tools icon"
                                },
                                {
                                    title: "Templates",
                                    body: "Trade journal, weekly review, execution checklist, personal rules doc.",
                                    icon: "/templates.svg", alt: "Templates icon"
                                },
                            ].map((c, i) => (
                                <motion.div /* ... */ className="card" key={i}>
                                    {c.icon ? (
                                        <img src={c.icon} alt={c.alt ?? ""} className="h-10 w-10 mb-4 object-contain rounded-xl" />
                                    ) : (
                                        <div className="icon" />
                                    )}
                                    <h3 className="font-semibold">{c.title}</h3>
                                    <p className="text-white/70 text-sm mt-2">{c.body}</p>
                                </motion.div>
                            ))}

                    </div>
                    <ul className="mt-8 text-white/70 text-sm list-disc list-inside space-y-1">
                            <li>Frameworks, tools & templates • No trade alerts</li>
                        <li>Finish with a written plan and a filled journal sample</li>
                            <li>Minors: purchase with parent/guardian permission.</li>
                    </ul>
                </div>
            </section>

            {/* CURRICULUM PREVIEW + SAMPLES (with modal previews) */}
            <section id="curriculum" className="anchor border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <h2 className="text-2xl md:text-3xl font-bold">Curriculum preview</h2>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        <ul className="space-y-3 text-sm text-white/80">
                            {[
                                { t: "Day 1 — Markets & instruments", p: "Spot vs derivatives, liquidity, spread & slippage. Paper account setup." },
                                { t: "Day 2 — Order types & costs", p: "Market/limit/stop orders, fees, and slippage testing." },
                                { t: "Day 3 — Risk & position sizing", p: "Risk per trade, R multiples, and the sizing formula." },
                                { t: "Day 4 — Strategy frameworks (no signals)", p: "Breakout / trend pullback / mean reversion. Codify one." },
                                { t: "Day 5 — Backtesting basics", p: "Bar-by-bar replay, sample selection, compute expectancy." },
                                { t: "Day 6 — Journalling & psychology", p: "Rule adherence, emotion scoring, weekly review loop." },
                                { t: "Day 7 — Execution loop & review", p: "Pre, during, post routine + continuous improvement." },
                            ].map((d, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <SVGDot />
                                    <button onClick={() => openPreview(d.t, d.p)} className="text-left hover:underline">{d.t}</button>
                                </li>
                            ))}
                        </ul>
                        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 relative overflow-hidden sample-sweep">
                            <h3 className="font-semibold">Try before you buy</h3>
                            <p className="text-white/70 text-sm mt-2">Download Day‑1 as a sample and a mini position‑sizing tool to see the quality.</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <a href={SAMPLE_DAY1_URL} onClick={(e) => { ripple(e); showToast("Day‑1 sample opened"); }} className="btn-ghost text-sm">Download Day‑1 PDF</a>
                                <a href={SAMPLE_TOOL_URL} onClick={(e) => { ripple(e); showToast("Sizing CSV opened"); }} className="btn-ghost text-sm">Download sizing CSV</a>
                            </div>
                            <p className="text-xs text-white/50 mt-3">No email wall required. We win on quality.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* GUARANTEE */}
            <section className="border-b border-white/10 bg-gradient-to-r from-neutral-900 to-blue-950">
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <h2 className="text-xl md:text-2xl font-bold relative inline-block">Finish‑the‑Sprint Guarantee<motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-blue-400 to-cyan-300" /></h2>
                    <p className="text-white/70 mt-2 max-w-3xl text-sm md:text-base">Complete all 7 modules and submit your written rules + one filled journal page within 7 days. If you don’t feel more confident about your process, we’ll refund you. No profits promised — just progress.</p>
                </div>
            </section>

                {/* --- Student progress wall (hidden for launch) --- */}
                {false && (
                    <section className="border-b border-white/10">
                        <div className="mx-auto max-w-6xl px-4 py-16">
                            <h2 className="text-2xl md:text-3xl font-bold">Student progress wall</h2>
                            <p className="text-white/70 text-sm mt-2">
                                Real outputs submitted by learners: rules pages, journal screenshots, and backtest tables.
                            </p>
                            <div className="mt-6 grid md:grid-cols-4 gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                                        className="progress-card min-w-[70%] md:min-w-0 snap-start">
                                        Upload real screenshot
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}


            {/* HOW IT WORKS / APPLY */}
                <section className="anchor border-b border-white/10">
                    <div className="mx-auto max-w-6xl px-4 py-16">
                        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>

                        <div className="mt-8 grid md:grid-cols-3 gap-6">
                            {[
                                { n: "01", t: "Choose plan", d: "Pick Base or Pro and checkout (instant access)." },
                                { n: "02", t: "Sprint", d: "Complete one module a day and log paper trades." },
                                { n: "03", t: "Review", d: "Submit journal & rules for feedback inside Discord Labs." },
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50"
                                >
                                    <div className="text-blue-300 font-mono text-sm">{s.n}</div>
                                    <div className="font-semibold mt-2">{s.t}</div>
                                    <p className="text-white/70 text-sm mt-1">{s.d}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href={joinBaseHref} onClick={ripple} className="btn-ghost">Join Base</a>
                            <a href={joinProHref} onClick={(e) => { ripple(e); triggerConfetti(); }} className="btn-primary">Join Pro</a>
                        </div>
                    </div>
                </section>


                {/* QUIZ: Choose for me */}
                <section className="border-b border-white/10">
                    <div className="mx-auto max-w-6xl px-4 py-16">
                        <h2 className="text-2xl md:text-3xl font-bold">Not sure? Let us choose for you</h2>

                        {!quizDone ? (
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={quizIdx}
                                    variants={qaVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="mt-6 rounded-2xl border border-white/10 p-6 bg-neutral-900/60"
                                >
                                    <p className="text-white/80">{quiz[quizIdx].q}</p>

                                    <div className="mt-4 flex gap-3">
                                        <button
                                            className="btn-primary"
                                            onClick={() => { setAnswers(a => [...a, 1]); setQuizIdx(i => i + 1); }}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            className="btn-ghost"
                                            onClick={() => { setAnswers(a => [...a, 0]); setQuizIdx(i => i + 1); }}
                                        >
                                            No
                                        </button>
                                    </div>

                                    <div className="mt-3 text-xs text-white/50">
                                        Question {quizIdx + 1} of {quiz.length}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-white/10 p-6 bg-neutral-900/60"
                            >
                                <p className="text-white/80">
                                    Recommendation: <span className="font-semibold">{quizReco}</span>
                                </p>
                                <div className="mt-4 flex gap-3">
                                    {quizReco === "Pro" ? (
                                        <a href={joinProHref} onClick={(e) => { ripple(e); triggerConfetti(); }} className="btn-primary">Join Pro</a>
                                    ) : (
                                        <a href={joinBaseHref} onClick={ripple} className="btn-ghost">Join Base</a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>


            {/* PRICING + Labs upsell */}
            <section id="pricing" className="anchor border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-16" id="join">
                    <h2 className="text-2xl md:text-3xl font-bold">Pricing</h2>
                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-white/10 p-6 bg-neutral-900/60">
                            <h3 className="text-lg font-semibold">Base</h3>
                            <div className="mt-2 text-3xl font-extrabold">$29</div>
                            <ul className="mt-4 text-sm text-white/70 space-y-2">
                                <li>7 lessons (PDF/MD)</li>
                                <li>Risk tools (CSV)</li>
                                <li>Journal + checklists</li>
                            </ul>
                            <a href={joinBaseHref} onClick={ripple} className="mt-6 inline-block btn-ghost">Join Base</a>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 14 }} className="rounded-2xl border border-blue-400/50 p-6 bg-gradient-to-br from-blue-950 to-neutral-900 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]">
                            <h3 className="text-lg font-semibold flex items-center gap-2">Pro <span className="badge-shimmer text-xs text-blue-300/80 font-normal">Best value</span></h3>
                            <div className="mt-2 text-3xl font-extrabold">$59</div>
                            <ul className="mt-4 text-sm text-white/70 space-y-2">
                                <li>Everything in Base</li>
                                <li>Extra drills & templates</li>
                                <li>Landing copy + email kit</li>
                            </ul>
                            <a href={joinProHref} onClick={(e) => { ripple(e); triggerConfetti(); }} className="mt-6 inline-block btn-primary">Join Pro</a>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-emerald-400/40 p-6 bg-gradient-to-br from-emerald-950 to-neutral-900">
                            <h3 className="text-lg font-semibold">Labs</h3>
                            <div className="mt-2 text-3xl font-extrabold">$5<span className="text-base font-semibold">/mo</span></div>
                            <ul className="mt-4 text-sm text-white/70 space-y-2">
                                <li>Weekly drills & prompts</li>
                                <li>New worksheets each month</li>
                                <li>Discord Labs access</li>
                            </ul>
                            <a href={labsHref} onClick={ripple} className="mt-6 inline-block btn-ghost">Join Labs</a>
                        </motion.div>
                    </div>
                    <p className="mt-4 text-xs text-white/60">Order bump: Add the Pro template pack for +$9 at checkout.</p>
                </div>
            </section>

            {/* FAQ (animated accordion) */}
            <section id="faq" className="anchor border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <h2 className="text-2xl md:text-3xl font-bold">FAQ</h2>
                    <div className="mt-6 space-y-4">
                        {[
                            { q: "Is this financial advice?", a: "No. Education only. No signals. Use paper trading while learning." },
                                { q: "Refunds?", a: "Course refunds available within 7 days if files were not downloaded." },
                            { q: "Can beginners join?", a: "Yes. The sprint is designed to get you to a written plan and working journal in 7 days." },
                                { q: "Do you call trades for me?", a: "No. We don’t send trade alerts. You learn a simple workflow and build your own rules." },
                        ].map((f, i) => (<FAQItem key={i} index={i} q={f.q} a={f.a} />))}
                    </div>
                </div>
            </section>

            {/* REFUND POLICY anchor */}
            <section id="refund-policy" className="anchor border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-white/70">
                    <h3 className="text-lg font-semibold">Refund policy (Finish‑the‑Sprint)</h3>
                    <p className="mt-2">Complete all 7 modules and submit your written rules + one filled journal page within 7 days. If you don’t feel more confident about your process, contact support for a full refund. Digital file download activity may be used to validate eligibility.</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 text-xs text-white/50">
                    <div className="mx-auto max-w-6xl px-4 space-y-4">
                        <div className="flex items-center gap-1">
                            <img src="/1R_White.svg" alt="FirstR" className="h-7 w-7" />
                            <span className="font-semibold text-white -ml-0.5">FirstR</span>
                        </div>
                        <p>© {new Date().getFullYear()} FirstR. Educational content. No trade alerts. Past performance ≠ future results.</p>
                    <div className="flex flex-wrap gap-4">
                        <a className="hover:text-white" href="#">Terms</a>
                        <a className="hover:text-white" href="#">Privacy</a>
                        <a className="hover:text-white" href="#">Returns</a>
                        <a className="hover:text-white" href="#">Contact</a>
                    </div>
                </div>

                    {/* MOBILE STICKY BAR */}
                    <div className="md:hidden fixed bottom-3 left-0 right-0 px-4">
                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur px-4 py-3 flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <img src="/1R_White.svg" alt="FirstR" className="h-4 w-4 shrink-0" />
                                <div>
                                    <div className="text-xs text-white/60">Next cohort • seats left</div>
                                    <div className="text-sm font-semibold">{seatsLeft} seats</div>
                                </div>
                            </div>
                            <a
                                href={joinProHref}
                                onClick={(e) => { ripple(e); triggerConfetti(); }}
                                className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm"
                            >
                                Join Pro
                            </a>
                        </motion.div>
                    </div>

                {/* DESKTOP STICKY CTA */}
                <AnimatePresence>
                    {!prefersReduced && (
                        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: showTop ? 0 : 80, opacity: showTop ? 1 : 0 }} transition={{ duration: 0.4 }} className="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur px-6 py-3 flex items-center gap-4">
                                <span className="text-sm">Next cohort: <strong>{seatsLeft}</strong> seats left</span>
                                <a href={joinProHref} onClick={(e) => { ripple(e); triggerConfetti(); }} className="btn-primary">Join Pro</a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back to top */}
                <AnimatePresence>
                    {showTop && (
                        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })} className="fixed right-4 bottom-4 z-40 rounded-full border border-white/20 bg-neutral-900/80 px-3 py-2 text-white/80 hover:text-white">
                            ↑ Top
                        </motion.button>
                    )}
                </AnimatePresence>
            </footer>

            {/* Consent banner (basic) */}
            <AnimatePresence>
                {!consent && (
                    <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="fixed bottom-0 left-0 right-0 z-[70] bg-neutral-900/95 border-t border-white/10">
                        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3 text-sm">
                            <span className="text-white/70">We use analytics and pixels to improve performance and measure conversions. Manage via your browser settings.</span>
                            <button className="btn-primary" onClick={grantConsent}>I agree</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.25 }} className="fixed bottom-5 right-5 z-50 rounded-xl border border-white/10 bg-neutral-900/90 px-4 py-3 text-sm">
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confetti */}
            <AnimatePresence>
                {confetti && !prefersReduced && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
                        {Array.from({ length: 12 }).map((_, i) => (<span key={i} className="confetti" style={{ left: `${8 + i * 7}%`, animationDelay: `${i * 40}ms` }} />))}
                    </motion.div>
                )}
            </AnimatePresence>

                {/* JSON-LD: Course */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Course",
                            name: "FirstR Sprint",
                            description:
                                "A 7-day beginner trading education sprint: markets, orders, risk, frameworks, backtesting, journalling, execution.",
                            provider: { "@type": "Organization", name: "FirstR" },
                        }),
                    }}
                />

                {/* Preview modal */}
                <PreviewModal />
            </main>
        </>
    ); // closes return


            // Local modal state via DOM custom event to avoid prop drilling
            function openPreview(title: string, body: string) {
  if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent("preview:open", { detail: { title, body } })
                );
  }
}
}


// ===== Components =====
function AnimatedHeadline({ text }: { text: string }) {
    const letters = Array.from(text);
    return (
        <motion.span variants={{ show: { transition: { staggerChildren: 0.02 } } }} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {letters.map((ch, i) => (
                <motion.span key={i} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} style={{ display: "inline-block" }}>
                    {ch === " " ? " " : ch}
                </motion.span>
            ))}
        </motion.span>
    );
}

function MetricCard({ label, value, valueText }: { label: string, value?: number, valueText?: string }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (value == null) return;
        let raf: number; let start: number | undefined; const dur = 1200;
        function step(ts: number) { if (!start) start = ts; const p = Math.min((ts - start) / dur, 1); setDisplay(Math.round((value) * p)); if (p < 1) raf = requestAnimationFrame(step); }
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { raf = requestAnimationFrame(step); obs.disconnect(); } }, { threshold: 0.6 });
        if (ref.current) obs.observe(ref.current);
        return () => { cancelAnimationFrame(raf); obs.disconnect(); };
    }, [value]);
    return (
        <div ref={ref} className="rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold">{valueText ?? display}</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function SVGDot() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1">
            <motion.circle cx="7" cy="7" r="5" stroke="currentColor" className="text-blue-400" strokeWidth="2" strokeDasharray="35" strokeDashoffset="35" whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} />
        </svg>
    );
}

// Smooth, accessible FAQ accordion with animations
function FAQItem({ q, a, index }: { q: string, a: string, index: number }) {
    const [open, setOpen] = useState(false);
    const panelId = `faq-panel-${index}`;
    return (
        <div className={`rounded-xl border p-4 ${open ? "border-blue-400/40 bg-neutral-900/70" : "border-white/10 bg-neutral-900/50"}`}>
            <button type="button" data-test={`faq-btn-${index}`} className="w-full flex items-center justify-between gap-3 text-left group" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
                <span className="font-medium pr-6 group-hover:text-white">{q}</span>
                <motion.svg initial={false} animate={{ rotate: open ? 90 : 0, opacity: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="h-4 w-4 text-white/70 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </motion.svg>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div id={panelId} key="content" initial="collapsed" animate="open" exit="collapsed" variants={{ open: { height: "auto", opacity: 1 }, collapsed: { height: 0, opacity: 0 } }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="pt-2 text-white/70 text-sm">{a}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Lightweight preview modal using a window event
function PreviewModal() {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState<{ title: string, body: string }>({ title: "", body: "" });
    useEffect(() => {
        function onOpen(e: any) { setContent(e.detail); setOpen(true); }
        function onEsc(ev: KeyboardEvent) { if (ev.key === 'Escape') setOpen(false); }
        window.addEventListener('preview:open', onOpen as any);
        window.addEventListener('keydown', onEsc);
        return () => { window.removeEventListener('preview:open', onOpen as any); window.removeEventListener('keydown', onEsc); };
    }, []);
    return (
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 210, damping: 22 }} className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-950 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg font-semibold">{content.title}</h3>
                            <button className="btn-ghost text-xs" onClick={() => setOpen(false)}>Close</button>
                        </div>
                        <p className="mt-3 text-white/70 text-sm">{content.body}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
