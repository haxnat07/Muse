"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { EMAIL } from "@/lib/content";

export default function Footer() {
  const { motion } = useMotion();
  const mark = useRef<HTMLParagraphElement>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setYear(new Date().getFullYear()));
    return () => cancelAnimationFrame(id);
  }, []);

  /* outline wordmark fills with ink as it scrolls into view */
  useGSAP(() => {
    if (motion === false) { gsap.set(mark.current, { backgroundPosition: "0 0" }); return; }
    if (!motion) return;
    gsap.to(mark.current, { backgroundPosition: "0% 0", ease: "none", scrollTrigger: { trigger: mark.current, start: "top bottom", end: "bottom bottom", scrub: true } });
  }, { dependencies: [motion] });

  return (
    <footer className="relative z-[2] bg-paper pt-20 pb-8 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="grid sm:grid-cols-3 gap-8 text-sm text-ink-soft">
          <div><p className="eyebrow text-red-pen">¹ Studio</p><p className="mt-3">New York, NY · Est. <abbr title="2020" className="no-underline">MMXX</abbr><br />Working with clients worldwide</p></div>
          <div>
            <p className="eyebrow text-red-pen">² Correspondence</p>
            <p className="mt-3">
              <a className="underline decoration-gold underline-offset-4" href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
              <a className="underline decoration-gold underline-offset-4" href="https://www.linkedin.com/company/ninth-muse/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <div><p className="eyebrow text-red-pen">³ Etymology</p><p className="mt-3">Calliope (Gk. <em>kalliópē</em>): &quot;beautiful-voiced.&quot; The ninth muse.</p></div>
        </div>
        <p ref={mark} className="wordmark mt-16 font-serif italic leading-[.8] text-[17vw] whitespace-nowrap select-none" aria-hidden="true">Ninth Muse</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-mute border-t border-ink/10 pt-6">
          <p>© {year} Ninth Muse. All rights reserved.</p>
          <p>Set in Cormorant &amp; Plus Jakarta · Edited by hand</p>
        </div>
      </div>
    </footer>
  );
}
