"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { EMAIL, MENU_LINKS } from "@/lib/content";

const fill = (c: string) => ({ "--fill": c }) as React.CSSProperties;

export default function SiteHeader() {
  const { motion, getLenis } = useMotion();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    closeBtn.current?.focus();
    if (motion) {
      gsap.fromTo(menu.current, { clipPath: "circle(0% at 95% 4%)" }, { clipPath: "circle(150% at 95% 4%)", duration: 0.9, ease: "power3.inOut" });
      gsap.from(".menu-link", { y: 50, opacity: 0, stagger: 0.06, duration: 0.7, delay: 0.3, ease: "power3.out" });
    }
  }, [open, motion, getLenis]);

  const close = () => {
    if (closing.current) return;
    const done = () => { closing.current = false; setOpen(false); getLenis()?.start(); };
    if (!motion) return done();
    closing.current = true;
    gsap.to(menu.current, { clipPath: "circle(0% at 95% 4%)", duration: 0.6, ease: "power3.inOut", onComplete: done });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <header id="siteHeader" className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-10 h-24 sm:h-28 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="Ninth Muse home" data-cursor-hover>
            <svg id="headLogo" className="h-16 w-16 sm:h-20 sm:w-20 text-navy-soft rounded-full bg-paper-soft/90 ring-1 ring-ink/10"><use href="#nm-logo" /></svg>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a id="writeBtn" href="#letter" className="ink-btn magnetic hidden sm:inline-flex rounded-full bg-navy text-paper px-5 py-2.5 text-sm hover:text-navy" style={fill("#C5A059")}>Write to us</a>
            <button
              onClick={() => setOpen(true)}
              className="ink-btn magnetic inline-flex items-center gap-3 rounded-full bg-paper-soft/80 backdrop-blur ring-1 ring-ink/15 pl-5 pr-2 py-2 text-sm hover:text-paper"
              style={fill("#1C2342")} aria-expanded={open} aria-controls="menu"
            >
              Contents
              <span className="grid place-items-center h-7 w-7 rounded-full bg-navy text-paper text-xs font-serif italic">ix</span>
            </button>
          </div>
        </div>
      </header>

      <div ref={menu} id="menu" className={`fixed inset-0 z-[80] bg-navy text-paper ${open ? "" : "hidden"}`} role="dialog" aria-modal="true" aria-label="Contents">
        <div className="mx-auto max-w-[1400px] h-full px-5 sm:px-10 flex flex-col">
          <div className="h-24 sm:h-28 flex items-center justify-between">
            <span className="eyebrow text-gold-light">Contents</span>
            <button ref={closeBtn} onClick={close} className="rounded-full ring-1 ring-paper/30 px-5 py-2 text-sm hover:bg-paper hover:text-navy transition">Close</button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-1 sm:gap-2 max-w-4xl w-full">
            {MENU_LINKS.map(l => (
              <a key={l.num} href={l.href} onClick={close} className="menu-link group flex items-baseline gap-4 py-2">
                <span className="font-serif italic text-gold-light w-10">{l.num}</span>
                <span className="font-serif text-4xl sm:text-6xl group-hover:italic group-hover:text-muse-sky transition">{l.label}</span>
                <span className="flex-1 border-b border-dotted border-paper/30 mb-3 hidden sm:block" />
                <span className="eyebrow text-paper/50 hidden sm:block">{l.page}</span>
              </a>
            ))}
          </nav>
          <p className="py-8 text-sm text-paper/50">New York · {EMAIL}</p>
        </div>
      </div>
    </>
  );
}
