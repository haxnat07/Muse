"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { scramble } from "@/lib/scramble";
import { AUDIENCES } from "@/lib/content";

function ServeRow({ i, title, body }: { i: number; title: string; body: string }) {
  const { motion, fine } = useMotion();
  const [open, setOpen] = useState(false);
  const word = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const flick = () => {
    if (busy.current || !motion || !word.current) return;
    busy.current = true;
    scramble(word.current, title, 700).then(() => { busy.current = false; });
  };

  return (
    <div
      className={`serve border-b border-ink/20 ${open ? "open" : ""}`} data-cursor="Open"
      onMouseEnter={() => { if (fine) { setOpen(true); flick(); } }}
      onMouseLeave={() => { if (fine) setOpen(false); }}
    >
      <button className="serve-head w-full flex items-center gap-4 sm:gap-8 py-7 sm:py-9 text-left" aria-expanded={open} onClick={() => { setOpen(o => !o); flick(); }}>
        <span className="font-serif italic text-gold text-xl w-10">{String(i + 1).padStart(2, "0")}</span>
        <span ref={word} className="flex-1 font-serif text-3xl sm:text-6xl bidi">{title}</span>
        <span className="plus grid place-items-center h-11 w-11 shrink-0 rounded-full ring-1 ring-ink/25 text-xl transition-all duration-500">+</span>
      </button>
      <div className="serve-body">
        <div className="overflow-hidden"><p className="pb-8 pl-14 sm:pl-[4.5rem] max-w-2xl text-lg text-ink-soft">{body}</p></div>
      </div>
    </div>
  );
}

/* Who we serve — accordion rows that "decode" on open */
export default function WhoWeServe() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!motion) return;
    gsap.from(".serve", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".serve", start: "top 85%" } });
  }, { dependencies: [motion], scope: root });

  return (
    <section ref={root} className="relative pb-28 lg:pb-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/20 pb-6">
          <h2 className="font-serif text-4xl sm:text-6xl">Who we write <em className="text-navy-soft">alongside.</em></h2>
          <p className="font-hand text-2xl text-red-pen">hover — or tap — to read</p>
        </div>
        {AUDIENCES.map((a, i) => <ServeRow key={a.title} i={i} {...a} />)}
      </div>
    </section>
  );
}
