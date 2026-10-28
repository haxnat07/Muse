"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";

type Sheet = {
  id?: string; num: string; folio: string; title: string;
  cut: string; insert: string; rest: string; nowrap: boolean; strike: string;
  bullets: string[]; note: string; tilt: string; noteTilt: string;
};

const SHEETS: Sheet[] = [
  {
    id: "editorial", num: "I.", folio: "Folio 01", title: "Global Policy & Mission Proposals",
    cut: "extremely important", insert: "mission-critical", nowrap: true, strike: "M0 6 C 30 3, 70 8, 100 4",
    rest: "proposals read the way they deserve — for international organizations, NGOs and policy institutions persuading very different readers at once.",
    bullets: ["Policy briefs & position papers", "Proposal review & restructuring", "Stakeholder & donor messaging"],
    note: "lead with the ask ↗", tilt: "lg:-rotate-[1.2deg]", noteTilt: "rotate-[-4deg]",
  },
  {
    num: "II.", folio: "Folio 02", title: "Culturally Attuned Communications",
    cut: "Translating words.", insert: "Translating intent.", nowrap: true, strike: "M0 5 C 30 8, 70 3, 100 6",
    rest: "Bridging language barriers on the most sensitive terrain — minority rights, gender equality, women's rights — with precision and respect.",
    bullets: ["Cross-cultural message adaptation", "Sensitive-topic framing", "Multilingual tone alignment"],
    note: "read it as they would ✓", tilt: "lg:rotate-[1.4deg] lg:translate-y-6", noteTilt: "rotate-[3deg]",
  },
  {
    num: "III.", folio: "Folio 03", title: "Executive & Professional Coaching",
    cut: "“I am a hard-working team player.”", insert: "Your record, made unmistakable.", nowrap: false, strike: "M0 6 C 35 2, 65 9, 100 5",
    rest: "High-stakes cover letters, career positioning and leadership voice for rising professionals.",
    bullets: ["Cover letters & applications", "Career narrative & positioning", "Executive presence in writing"],
    note: "show, don't claim", tilt: "lg:-rotate-[.8deg]", noteTilt: "rotate-[-2deg]",
  },
];

const PIN_RATIO = 0.6;

function redline(scope: Element, scrollTrigger: ScrollTrigger.Vars) {
  gsap.timeline({ scrollTrigger })
    .to(scope.querySelectorAll(".strike"), { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" })
    .from(scope.querySelectorAll(".ins"), { autoAlpha: 0, y: 8, rotate: -3, duration: 0.5 }, "+=.05")
    .from(scope.querySelectorAll(".note"), { autoAlpha: 0, scale: 0.8, duration: 0.5, ease: "back.out(2)" }, "-=.1");
}

/* III. Services — manuscript pages (horizontal scroll on desktop) */
export default function Services() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!motion) return;
    gsap.set(".strike", { strokeDashoffset: 1 });
    const sheets = gsap.utils.toArray<HTMLElement>(".sheet");
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      // the track moves faster than the wheel: ~60% of its width in scroll distance
      const h = gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + dist() * PIN_RATIO, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      sheets.forEach((s, i) => {
        gsap.from(s, { y: 120, rotate: i % 2 ? 8 : -8, ease: "none", scrollTrigger: { trigger: s, containerAnimation: h, start: "left right", end: "left 45%", scrub: true } });
        redline(s, { trigger: s, containerAnimation: h, start: "left 55%" });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      sheets.forEach(s => {
        gsap.from(s, { y: 60, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 85%" } });
        redline(s, { trigger: s, start: "top 65%" });
      });
    });
    return () => mm.revert();
  }, { dependencies: [motion], scope: root });

  return (
    <section ref={root} id="services" className="relative lg:h-[100svh] lg:overflow-hidden bg-navy text-paper">
      <div ref={track} className="flex flex-col lg:flex-row lg:h-full lg:w-max lg:items-center gap-10 lg:gap-16 px-5 sm:px-10 lg:pl-[8vw] lg:pr-[12vw] py-24 lg:py-0">
        <div className="lg:w-[34vw] shrink-0">
          <p className="eyebrow text-gold-light">II. — Strategic Communications</p>
          <h2 className="mt-4 font-serif text-5xl sm:text-7xl leading-[.98]">Three <em className="text-muse-sky">manuscripts.</em></h2>
          <p className="mt-6 text-paper/70 max-w-sm text-lg">Each discipline starts the same way: a draft, a red pen, and a question — <span className="font-hand text-2xl text-gold-light">who is reading this?</span></p>
          <div className="mt-10 hidden lg:flex items-center gap-6">
            <p className="eyebrow text-paper/40 flex items-center gap-3">Keep scrolling <span className="h-px w-16 bg-paper/40" />→</p>
            <a href="#leadership" className="eyebrow text-gold-light/80 hover:text-gold-light underline decoration-gold/40 underline-offset-4 transition">or skip ahead ↓</a>
          </div>
        </div>

        {SHEETS.map(s => (
          <article
            key={s.num} id={s.id} data-cursor="Read"
            className={`sheet relative shrink-0 w-full lg:w-[min(46vw,620px)] lg:h-[74vh] rounded-sm bg-paper-soft text-ink ruled margin-line shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] p-8 sm:p-12 ${s.tilt}`}
          >
            <div className="flex justify-between items-start"><span className="font-serif italic text-7xl text-gold/80 leading-none">{s.num}</span><span className="eyebrow text-ink-mute">{s.folio}</span></div>
            <h3 className="mt-6 font-serif text-4xl sm:text-5xl leading-tight">{s.title}</h3>
            <p className="mt-5 text-lg leading-8 text-ink-soft">
              {s.num === "I." && "We make "}
              <span className={`relative inline-block text-ink/45 ${s.nowrap ? "whitespace-nowrap" : ""}`}>
                {s.cut}
                <svg className="absolute left-0 top-1/2 w-full h-3 -translate-y-1/2 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path className="strike draw" pathLength={1} d={s.strike} stroke="#B5543C" strokeWidth="2" fill="none" />
                </svg>
              </span>{" "}
              <span className="ins font-hand text-2xl text-red-pen">{s.insert}</span>{" "}
              {s.rest}
            </p>
            <ul className="mt-6 space-y-2 text-ink-soft">{s.bullets.map(b => <li key={b}>— {b}</li>)}</ul>
            <p className={`note block mt-6 text-right lg:mt-0 lg:absolute lg:right-6 lg:bottom-6 font-hand text-2xl text-red-pen ${s.noteTilt}`}>{s.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
