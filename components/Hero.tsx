"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { scramble } from "@/lib/scramble";
import { LANGS } from "@/lib/content";

const fill = (c: string) => ({ "--fill": c }) as React.CSSProperties;

/* I. Hero — the edited headline */
export default function Hero() {
  const { motion, introDone } = useMotion();
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const note = useRef<HTMLParagraphElement>(null);

  /* initial states + scroll-linked ring/quill */
  useGSAP(() => {
    if (!motion) return;
    gsap.set("h1 .strike", { strokeDashoffset: 1 });
    gsap.set(".mask > span", { yPercent: 110 });
    gsap.set(".hero-fade", { autoAlpha: 0, y: 20 });
    gsap.set("h1 .ins", { clipPath: "inset(0 100% 0 0)" });
    gsap.set("#ringWrap", { autoAlpha: 0, scale: 0.85, rotate: -40 });

    gsap.to("#ring", { rotate: 360, duration: 90, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
    gsap.to("#ringWrap", { yPercent: 25, rotate: 90, ease: "none", scrollTrigger: st });
    gsap.to("#heroQuill", { y: -120, rotate: -14, ease: "none", scrollTrigger: { ...st } });
  }, { dependencies: [motion], scope: root });

  /* entrance once the loader has lifted, then cycle "clarity" through languages */
  useGSAP(() => {
    if (!motion || !introDone) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let li = 0;
    const cycle = () => {
      timer = setInterval(() => {
        li = (li + 1) % LANGS.length;
        const [w, lang] = LANGS[li];
        if (word.current) scramble(word.current, w, 800);
        gsap.fromTo(note.current, { autoAlpha: 0, x: -8 }, {
          autoAlpha: 1, x: 0, duration: 0.5, delay: 0.4,
          onStart: () => { if (note.current) note.current.textContent = `— "clarity", in ${lang}`; },
        });
      }, 2600);
    };

    gsap.timeline({ defaults: { ease: "expo.out" } })
      .to(".mask > span", { yPercent: 0, duration: 1.4, stagger: 0.12 })
      .to("#ringWrap", { autoAlpha: innerWidth < 1024 ? 0.3 : 1, scale: 1, rotate: 0, duration: 2, ease: "power3.out" }, 0)
      .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5)
      .to("h1 .strike", { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 1)
      .to("h1 .ins", { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power2.inOut" }, 1.4)
      .add(cycle, 2.6);
    gsap.to("#scrollTick", { y: 24, repeat: -1, duration: 1.4, ease: "power1.inOut", yoyo: true });
    return () => clearInterval(timer);
  }, { dependencies: [motion, introDone], scope: root });

  return (
    <section ref={root} className="relative min-h-[100svh] flex items-center pt-32 sm:pt-36 pb-16 overflow-hidden">
      {/* rotating ring of "clarity" in many languages */}
      <div id="ringWrap" className="pointer-events-none absolute right-[-30vw] sm:right-[-14vw] lg:right-[-9vw] top-1/2 -translate-y-1/2 w-[110vw] sm:w-[70vw] lg:w-[42vw] aspect-square" aria-hidden="true">
        <svg id="ring" viewBox="0 0 500 500" className="w-full h-full">
          <path id="ringPath" d="M 250,250 m -205,0 a 205,205 0 1,1 410,0 a 205,205 0 1,1 -410,0" fill="none" />
          <text className="font-serif" fontSize="19" fill="#3B3F66" fontStyle="italic">
            <textPath href="#ringPath" textLength="1280" lengthAdjust="spacing">Clarity · Claridad · Clarté · Klarheit · Chiarezza · وضوح · Ясность · Clareza · 明晰 · Duidelijkheid · Netlik ·</textPath>
          </text>
          <circle cx="250" cy="250" r="180" fill="none" stroke="#C5A059" strokeWidth=".6" strokeDasharray="2 6" />
        </svg>
        <svg id="heroQuill" className="absolute inset-[22%] w-[56%] h-[56%]"><use href="#nm-quill" /></svg>
      </div>

      <div className="relative mx-auto max-w-[1400px] w-full px-5 sm:px-10">
        <p className="hero-fade eyebrow text-ink-soft flex items-center gap-3"><span className="h-px w-10 bg-red-pen" />A communications consultancy · New York</p>

        <h1 className="mt-6 font-serif font-medium tracking-tight leading-[.95] text-[3.3rem] sm:text-[5.5rem] lg:text-[clamp(5rem,7.2vw,8.2rem)]">
          <span className="mask"><span><span ref={word} className="bidi inline-block text-navy">Clarity</span></span></span>
          <span className="mask"><span>across <em className="font-normal text-navy-soft">cultural</em></span></span>
          <span className="mask"><span>&amp; global{" "}
            {/* editor's trace: the word that was cut, then the word that replaced it */}
            <span className="relative inline-block align-middle mx-1 text-[.26em] font-sans font-normal tracking-normal text-ink/40 whitespace-nowrap">
              differences
              <svg className="absolute left-[-6%] top-1/2 w-[112%] h-[.7em] -translate-y-1/2 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path className="strike draw" pathLength={1} d="M1 6 C 25 3, 60 8, 99 4" stroke="#B5543C" strokeWidth="2.4" fill="none" />
              </svg>
              <span className="absolute left-1/2 -bottom-[1.1em] -translate-x-1/2 font-hand text-red-pen text-[1.4em] leading-none">‸</span>
            </span>
            <span className="ins italic inline-block">divides.</span>
          </span></span>
        </h1>

        <p ref={note} className="hero-fade mt-4 font-hand text-2xl text-red-pen h-8">— &quot;clarity&quot;, in English</p>

        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-end">
          <p className="hero-fade lg:col-span-5 text-lg leading-relaxed text-ink-soft">
            Elevating mission-critical messaging, policy strategy, and executive communications across languages and complex global landscapes.
          </p>
          <div className="hero-fade lg:col-span-6 lg:col-start-7 flex flex-wrap gap-3">
            <a href="#services" className="ink-btn magnetic inline-flex items-center gap-3 rounded-full bg-navy text-paper px-7 py-4 text-sm hover:text-navy" style={fill("#C5A059")} data-cursor="Explore">Explore Services <span aria-hidden="true">↓</span></a>
            <a href="#letter" className="ink-btn magnetic inline-flex items-center gap-3 rounded-full ring-1 ring-ink/25 px-7 py-4 text-sm hover:text-paper" style={fill("#1C2342")}>Schedule a Call</a>
          </div>
        </div>
      </div>

      <p className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2 eyebrow text-ink-mute flex flex-col items-center gap-2">
        Scroll<span className="block h-8 w-px bg-ink/30 overflow-hidden"><span id="scrollTick" className="block h-3 w-px bg-red-pen" /></span>
      </p>
    </section>
  );
}
