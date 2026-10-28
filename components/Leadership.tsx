"use client";

import { useRef } from "react";
import Image from "next/image";
import portrait from "@/public/alex-van-nievelt.jpg";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { LEADER_CARDS } from "@/lib/content";

const NAME = "Maria Alexandra van Nievelt";

/* IV. Leadership */
export default function Leadership() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!motion) return;
    gsap.set("#philoLine", { strokeDashoffset: 1 });
    gsap.from("#leaderName .ch", { yPercent: 100, rotate: 8, autoAlpha: 0, stagger: 0.025, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: "#leaderName", start: "top 80%" } });
    gsap.fromTo("#portrait", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: "#portrait", start: "top 80%" } });
    gsap.from("#portrait > *", { scale: 1.3, duration: 2, ease: "expo.out", scrollTrigger: { trigger: "#portrait", start: "top 80%" } });
    gsap.from(".lead-p", { y: 30, autoAlpha: 0, stagger: 0.15, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".lead-p", start: "top 85%" } });
    gsap.from("#cards .card", {
      y: 60, x: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-14, 14), autoAlpha: 0,
      stagger: 0.07, duration: 1, ease: "back.out(1.4)", scrollTrigger: { trigger: "#cards", start: "top 85%" },
    });
    gsap.to("#philoLine", { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", scrollTrigger: { trigger: "#philoLine", start: "top 85%" } });
  }, { dependencies: [motion], scope: root });

  const lift = (e: React.MouseEvent<HTMLElement>, up: boolean) => {
    if (!motion) return;
    gsap.to(e.currentTarget, up ? { y: -6, rotate: gsap.utils.random(-4, 4), duration: 0.3 } : { y: 0, rotate: 0, duration: 0.4 });
  };

  return (
    <section ref={root} id="leadership" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10 grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-4">
          {/* frame matches the 200px source so the photo is never upscaled; with a larger image, widen it and drop `unoptimized` */}
          <div className="relative mx-auto w-[200px]">
            <span className="absolute -inset-3 rounded-t-full ring-1 ring-gold/50" aria-hidden="true" />
            <div id="portrait" className="relative aspect-square overflow-hidden rounded-t-full bg-gradient-to-b from-muse-sky/60 via-muse-mauve/60 to-navy-soft">
              <Image src={portrait} alt="Maria Alexandra van Nievelt" fill sizes="200px" unoptimized placeholder="blur" className="object-cover" />
            </div>
            <p className="absolute -right-16 -top-2 font-hand text-2xl text-red-pen rotate-6">Co-Founder</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          <p className="eyebrow text-red-pen">IV. — Leadership</p>
          <h2 id="leaderName" className="mt-4 font-serif text-5xl sm:text-7xl leading-[.98]" aria-label={NAME}>
            {NAME.split(" ").map((w, wi) => (
              <span key={wi} aria-hidden="true">
                {wi > 0 && " "}
                <span className="inline-block whitespace-nowrap">
                  {[...w].map((c, ci) => <span key={ci} className="ch inline-block">{c}</span>)}
                </span>
              </span>
            ))}
          </h2>
          <p className="mt-2 font-serif italic text-2xl text-navy-soft">&quot;Alex&quot;</p>
          <p className="lead-p mt-8 text-lg leading-relaxed text-ink-soft max-w-2xl">Alex brings an interdisciplinary career at the intersection of policy, technology and international affairs. A Senior Policy Manager at Amazon with expertise in trust &amp; safety, public interest law and international security, she has spent years translating complex, high-stakes issues into language decision-makers act on.</p>
          <p className="lead-p mt-4 text-lg leading-relaxed text-ink-soft max-w-2xl">Educated at Yale and Columbia SIPA, she brings cross-border operational insight to every engagement.</p>

          <div id="cards" className="mt-10 flex flex-wrap gap-3">
            {LEADER_CARDS.map(c => (
              <span
                key={c.v} onMouseEnter={e => lift(e, true)} onMouseLeave={e => lift(e, false)}
                className={`card rounded-sm px-4 py-3 shadow-sm ${c.dark ? "bg-navy text-paper" : "bg-paper-soft ring-1 ring-ink/10"}`}
              >
                <span className={`block eyebrow ${c.dark ? "text-gold-light" : "text-ink-mute"}`}>{c.k}</span>
                <span className="font-serif text-xl">{c.v}</span>
              </span>
            ))}
          </div>

          <p className="mt-12 font-serif text-3xl sm:text-4xl leading-snug max-w-2xl">
            The power of the written word,{" "}
            <span className="relative inline-block italic text-navy">guided by insight from across borders.
              <svg className="absolute left-0 -bottom-2 w-full h-3 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                <path id="philoLine" className="draw" pathLength={1} d="M0 7 C 30 2, 70 2, 100 6" stroke="#C5A059" strokeWidth="2.5" fill="none" />
              </svg>
            </span>
          </p>
          <p className="mt-3 eyebrow text-ink-mute">— The Ninth Muse philosophy</p>
        </div>
      </div>
    </section>
  );
}
