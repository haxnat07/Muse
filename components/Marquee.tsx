"use client";

import { Fragment, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { MARQUEE } from "@/lib/content";

/* Velocity marquee: speeds up and skews with scroll velocity, reverses with direction */
export default function Marquee() {
  const { motion } = useMotion();
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!motion) return;
    const mq = gsap.to(track.current, { xPercent: -50, repeat: -1, duration: 40, ease: "none" });
    mq.totalTime(mq.duration() * 500);
    const skewTo = gsap.quickTo(track.current, "skewX", { duration: 0.5, ease: "power3" });
    let dir = 1, target = 1;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: s => {
        const v = s.getVelocity();
        dir = v < 0 ? -1 : 1;
        target = dir * (1 + Math.min(6, Math.abs(v) / 250));
        skewTo(gsap.utils.clamp(-10, 10, -v / 250));
      },
    });
    const tick = () => {
      target += (dir - target) * 0.05;
      mq.timeScale(mq.timeScale() + (target - mq.timeScale()) * 0.12);
      if (Math.abs(target - dir) < 0.05) skewTo(0);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, { dependencies: [motion] });

  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="relative overflow-hidden py-6 border-b border-ink/10" aria-hidden="true">
      <div ref={track} className="flex w-max gap-10 font-serif italic text-3xl sm:text-5xl text-ink/80 whitespace-nowrap will-change-transform">
        {items.map((t, i) => (
          <Fragment key={i}><span>{t}</span><span className="text-red-pen not-italic">¶</span></Fragment>
        ))}
      </div>
    </div>
  );
}
