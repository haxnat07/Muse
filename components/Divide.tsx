"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { rnd } from "@/lib/scramble";

const FROM = "hear.", TO = "understand.";

/* The divide (pinned): "what they hear" bridges into "what they understand" */
export default function Divide() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!motion || !word.current) return;
    const el = word.current;
    const morph = (p: number) => {
      if (p <= 0) { el.textContent = FROM; return; }
      if (p >= 1) { el.textContent = TO; return; }
      const t = [...TO], shown = Math.floor(p * t.length);
      el.textContent = t.map((c, i) => (i < shown ? c : rnd())).join("");
    };
    el.textContent = FROM;
    const proxy = { p: 0 };
    gsap.set("#crack", { strokeDashoffset: 1 });
    gsap.set("#dvCap", { autoAlpha: 0, y: 20 });
    gsap.set(el, { color: "#B5543C" });
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", pin: true, scrub: 0.6 } })
      .to("#crack", { strokeDashoffset: 0, duration: 0.25 })
      .to("#dvA", { y: -30, x: -20, duration: 0.25 }, 0)
      .to("#dvB", { y: 30, x: 20, duration: 0.25 }, 0)
      .to("#dvA, #dvB", { x: 0, y: 0, duration: 0.35 }, 0.3)
      .to("#crack", { strokeDashoffset: -1, duration: 0.3 }, 0.3)
      .to("#bridge", { strokeDashoffset: 0, duration: 0.35 }, 0.4)
      .to(proxy, { p: 1, duration: 0.3, onUpdate: () => morph(proxy.p) }, 0.45)
      .to(el, { color: "#C5A059", duration: 0.1 }, 0.7)
      .to("#dvCap", { autoAlpha: 1, y: 0, duration: 0.15 }, 0.8);
    return () => { el.textContent = TO; };
  }, { dependencies: [motion], scope: root });

  return (
    <section ref={root} id="divide" className="relative h-[100svh] flex items-center overflow-hidden bg-paper-deep/50 border-y border-ink/10">
      <div className="mx-auto max-w-[1400px] w-full px-5 sm:px-10">
        <p className="eyebrow text-ink-mute mb-8">The problem, in two lines</p>
        <p id="dvA" className="font-serif text-[2.6rem] sm:text-7xl lg:text-[7rem] leading-none">What you <em className="text-navy-soft">mean.</em></p>
        <div className="relative h-16 sm:h-24 my-4" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 60" preserveAspectRatio="none">
            <path id="crack" className="draw" pathLength={1} d="M0 30 L80 22 L130 40 L210 18 L270 44 L350 20 L420 38 L500 14 L570 46 L640 22 L720 40 L790 16 L860 42 L930 24 L1000 34" fill="none" stroke="#B5543C" strokeWidth="1.5" />
            <path id="bridge" className="draw" pathLength={1} d="M0 30 L1000 30" fill="none" stroke="#C5A059" strokeWidth="2" style={{ strokeDashoffset: 1 }} />
          </svg>
        </div>
        <p id="dvB" className="font-serif text-[2.6rem] sm:text-7xl lg:text-[7rem] leading-none text-right">What they <em ref={word} className="text-gold bidi">{TO}</em></p>
        <p id="dvCap" className="mt-10 font-hand text-3xl text-red-pen text-right">That distance is our work.</p>
      </div>
    </section>
  );
}
