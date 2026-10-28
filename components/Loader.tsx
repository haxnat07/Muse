"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { NUMERALS } from "@/lib/content";

/* Intro: counting to the ninth */
export default function Loader() {
  const { motion, finishIntro } = useMotion();
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (motion === null) return;
    const done = () => { setGone(true); finishIntro(); };
    if (!motion) { done(); return; }

    gsap.set(".draw", { strokeDashoffset: 1 });
    const tl = gsap.timeline();
    tl.to("#ldQuill", { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0)
      .to("#ldShaft", { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.3)
      .to("#ldQuill", { attr: { "fill-opacity": 1 }, duration: 0.5 }, 1);
    NUMERALS.forEach((n, i) => tl.call(() => { if (num.current) num.current.textContent = n; }, undefined, i * 0.13));
    tl.to(num.current, { color: "#C5A059", scale: 1.15, duration: 0.3 }, 1.15)
      .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 1.6)
      .add(done, 2.15);
    const failsafe = setTimeout(done, 4500);
    return () => clearTimeout(failsafe);
  }, { dependencies: [motion], scope: root });

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90] bg-paper flex flex-col items-center justify-center gap-6">
      <svg viewBox="0 0 200 200" className="h-28 w-28" aria-hidden="true">
        <path id="ldQuill" className="draw" pathLength={1} d="M74 146 C 84 112, 104 82, 146 56 C 138 92, 118 120, 84 138 Z" fill="url(#quillBands)" fillOpacity="0" stroke="#3B3F66" strokeWidth="1.2" />
        <path id="ldShaft" className="draw" pathLength={1} d="M70 152 L 140 64" stroke="#9EC5E8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </svg>
      <p ref={num} className="font-serif text-6xl text-navy tabular-nums">I</p>
      <p className="eyebrow text-ink-mute">Summoning the ninth muse</p>
    </div>
  );
}
