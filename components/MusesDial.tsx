"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { MUSES } from "@/lib/content";

/* 72 tick marks around the dial, every 8th one long */
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180, long = i % 8 === 0;
  const r1 = 99, r2 = long ? 93 : 96;
  const f = (n: number) => +n.toFixed(3);
  return { x1: f(100 + r1 * Math.sin(a)), y1: f(100 - r1 * Math.cos(a)), x2: f(100 + r2 * Math.sin(a)), y2: f(100 - r2 * Math.cos(a)), long };
});

/* II. The Nine Muses dial (pinned on desktop) */
export default function MusesDial() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);
  const rot = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [picked, setPicked] = useState<number | null>(null); // static (reduced-motion) mode only
  const intro = useRef<gsap.core.Tween | null>(null);
  const shown = motion === false ? (picked ?? 8) : active;

  const setMuse = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    if (motion) gsap.fromTo(["#dNum", "#dName", "#dDom"], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, overwrite: true });
  }, [active, motion]);

  const syncFromRotation = () => {
    const r = gsap.getProperty(rot.current, "rotate") as number;
    setMuse(Math.max(0, Math.min(8, Math.round(-r / 40))));
  };

  /* No pin: the dial plays I → IX once as it enters view, then hands control to the reader. */
  const { contextSafe } = useGSAP(() => {
    if (motion === false) { gsap.set(rot.current, { rotate: -320 }); return; }
    if (!motion) return;
    intro.current = gsap.to(rot.current, {
      rotate: -320, duration: 2.6, ease: "power2.inOut", onUpdate: syncFromRotation,
      scrollTrigger: { trigger: "#dial", start: "top 70%", once: true },
    });
    gsap.to("#ticks", { rotate: 90, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
  }, { dependencies: [motion], scope: root });

  /* clicking a muse turns it to the pointer; the intro spin is cancelled if it's still running */
  const goTo = (i: number) => {
    if (!motion) { gsap.set(rot.current, { rotate: -i * 40 }); setPicked(i); return; }
    intro.current?.scrollTrigger?.kill();
    intro.current?.kill();
    contextSafe(() => {
      gsap.to(rot.current, { rotate: -i * 40, duration: 0.9, ease: "power3.inOut", overwrite: true, onUpdate: syncFromRotation });
    })();
  };

  const [num, name, dom] = MUSES[shown];

  return (
    <section ref={root} id="about" className="relative min-h-[100svh] flex items-center overflow-hidden">
      <div className="mx-auto max-w-[1400px] w-full px-5 sm:px-10 py-20 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <p className="eyebrow text-red-pen">I. — The Ninth</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-6xl leading-[1.02]">Nine muses.<br />We answer to <em className="text-gold">one.</em></h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft max-w-md">In Hesiod&apos;s list, the ninth Muse is Calliope — the muse of eloquence, said to give kings and counsellors words that settle disputes. Ninth Muse is a New York consultancy built on the same idea: when a message has to cross borders, languages and convictions, precision is not a luxury.</p>
          <p className="mt-4 text-ink-soft max-w-md">We work with international organizations, policy professionals and rising leaders on how they write, speak and persuade on sensitive global issues.</p>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
          <div className="relative">
            <span className="absolute left-1/2 -top-5 -translate-x-1/2 text-gold text-xl" aria-hidden="true">▼</span>
            <div id="dial" className="dial relative rounded-full">
              <svg id="ticks" className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" aria-hidden="true">
                {TICKS.map((t, i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#1C2342" strokeOpacity={t.long ? 0.5 : 0.2} strokeWidth=".4" />
                ))}
              </svg>
              <div ref={rot} className="absolute inset-0">
                {MUSES.map((m, i) => (
                  <button
                    key={m[1]} type="button" onClick={() => goTo(i)}
                    aria-pressed={i === shown} aria-label={`${m[1]}, muse of ${m[2].toLowerCase()}`}
                    className={`muse-item text-center text-ink/45 hover:text-navy px-2 py-1 rounded-full ${i === shown ? "active" : ""}`}
                    style={{ "--a": `${i * 40}deg` } as React.CSSProperties}
                  >
                    <span className="block font-serif italic text-xs sm:text-sm transition-transform">{m[0]}</span>
                    <span className="block font-serif text-base sm:text-xl transition-transform">{m[1]}</span>
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-[24%] rounded-full bg-paper-soft shadow-[0_30px_60px_-30px_rgba(28,35,66,.35)] ring-1 ring-ink/10 grid place-items-center text-center p-4">
                <div>
                  <p id="dNum" className="font-serif italic text-gold text-4xl sm:text-6xl leading-none">{num}</p>
                  <p id="dName" className="mt-2 font-serif text-2xl sm:text-4xl">{name}</p>
                  <p id="dDom" className="mt-1 text-xs sm:text-sm text-ink-mute">{dom}</p>
                  <p className="mt-2 font-hand text-xl sm:text-2xl text-red-pen transition-opacity" style={{ opacity: shown === 8 ? 1 : 0 }}>our namesake ✓</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center font-hand text-2xl text-red-pen">tap any muse to meet her</p>
          </div>
        </div>
      </div>
    </section>
  );
}
