"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { EMAIL, SERVICES } from "@/lib/content";

const fill = (c: string) => ({ "--fill": c }) as React.CSSProperties;
const PREFILL = "ninth:prefill-letter";
const NBSP = " ";

type Prefill = { message: string; service: string };

/** Lets other sections (the red pen) hand a draft to the letter form. Only fills an empty message. */
export const prefillLetter = (detail: Prefill) => window.dispatchEvent(new CustomEvent<Prefill>(PREFILL, { detail }));

/* VI. Contact — write a letter */
export default function Letter() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const env = useRef<HTMLDivElement>(null);
  const msg = useRef<HTMLTextAreaElement>(null);
  const svc = useRef<HTMLSelectElement>(null);
  const [today, setToday] = useState("");
  const [sig, setSig] = useState(NBSP);
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // dates can't be rendered during prerender; fill in on the client
    const id = requestAnimationFrame(() =>
      setToday(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })));
    const onPrefill = (e: Event) => {
      const { message, service } = (e as CustomEvent<Prefill>).detail;
      if (msg.current && !msg.current.value.trim()) msg.current.value = message;
      if (svc.current) svc.current.value = service;
    };
    window.addEventListener(PREFILL, onPrefill);
    return () => { cancelAnimationFrame(id); window.removeEventListener(PREFILL, onPrefill); };
  }, []);

  useGSAP(() => {
    if (!motion) return;
    gsap.from(form.current, { y: 80, rotate: 3, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
  }, { dependencies: [motion], scope: root });

  /* envelope arrives once the letter has folded away */
  useEffect(() => {
    if (!sent || !motion) return;
    gsap.timeline()
      .from(env.current, { y: 80, autoAlpha: 0, scale: 0.9, duration: 0.7, ease: "back.out(1.6)" })
      .from("#seal", { scale: 0, rotation: -120, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(2.2)" }, "-=.2")
      .from("#received", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=.2");
  }, [sent, motion]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const ok = !!(get("name") && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(get("email")) && get("message"));
    setError(!ok);
    if (!ok) return;
    // TODO production: fetch('https://formspree.io/f/XXXX', { method: 'POST', body: d, headers: { Accept: 'application/json' } });
    if (!motion) { setSent(true); return; }
    gsap.to(form.current, {
      rotateX: 80, scaleY: 0.25, y: 80, autoAlpha: 0, transformOrigin: "50% 0%", duration: 0.8, ease: "power2.in",
      onComplete: () => setSent(true),
    });
  };

  const again = () => {
    form.current?.reset();
    setSig(NBSP); setError(false); setSent(false);
    if (motion) gsap.fromTo(form.current, { autoAlpha: 0, y: 30, rotateX: 0, scaleY: 1 }, { autoAlpha: 1, y: 0, duration: 0.6, clearProps: "transform" });
  };

  return (
    <section ref={root} id="letter" className="relative py-24 lg:py-36 bg-paper-deep/60 border-t border-ink/10 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-red-pen">VI. — Correspondence</p>
          <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-[1]">Have a message that <em className="text-gold">cannot</em> be misread?</h2>
          <p className="mt-6 text-ink-soft text-lg">Write to us. Every enquiry is read personally and held in strict confidence — whether it&apos;s a proposal review or a first conversation.</p>
          <p className="mt-6 text-sm text-ink-mute">Or simply: <a href={`mailto:${EMAIL}`} className="underline decoration-gold underline-offset-4">{EMAIL}</a></p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 [perspective:1400px]">
          <form
            ref={form} onSubmit={onSubmit} noValidate
            className={`${sent ? "hidden" : ""} relative bg-paper-soft ruled margin-line shadow-[0_40px_80px_-40px_rgba(28,35,66,.45)] ring-1 ring-ink/5 rounded-sm px-6 sm:px-14 py-10 sm:py-14 font-serif text-xl sm:text-[1.45rem] leading-[2.6] text-ink`}
          >
            <p className="flex justify-between items-baseline"><span className="italic">Dear Ninth Muse,</span><span className="text-sm font-sans text-ink-mute">{today}</span></p>
            <p className="mt-2">
              My name is <label className="sr-only" htmlFor="fName">Your name</label>
              <input id="fName" name="name" required className="blank w-[11ch]" placeholder="your name" autoComplete="name" onChange={e => setSig(e.target.value.trim() || NBSP)} />,
              and I&apos;m writing on behalf of <label className="sr-only" htmlFor="fOrg">Organization</label>
              <input id="fOrg" name="organization" className="blank w-[13ch]" placeholder="organization" autoComplete="organization" />.
              I&apos;d like your help with{" "}
              <label className="sr-only" htmlFor="fSvc">Service</label>
              <select id="fSvc" ref={svc} name="service" className="blank">
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>.
            </p>
            <label className="sr-only" htmlFor="fMsg">Your message</label>
            <textarea id="fMsg" ref={msg} name="message" required rows={3} className="lined blank not-italic! w-full mt-2 resize-none text-xl!" placeholder="In brief, the message is…" />
            <p className="mt-2">You can reach me at <label className="sr-only" htmlFor="fMail">Email</label>
              <input id="fMail" name="email" type="email" required className="blank w-[18ch]" placeholder="email address" autoComplete="email" />.
            </p>
            <p className="mt-4 italic">Sincerely,</p>
            <p className="font-hand text-4xl text-navy h-12">{sig}</p>
            {error && <p className="font-sans text-sm text-red-pen mt-2">A name, a valid email and a few words of message, please.</p>}
            <div className="mt-6 flex justify-end">
              <button type="submit" className="ink-btn magnetic inline-flex items-center gap-3 rounded-full bg-navy text-paper px-7 py-4 font-sans text-sm hover:text-navy" style={fill("#C5A059")}>Seal &amp; send <span aria-hidden="true">✉</span></button>
            </div>
          </form>

          <div ref={env} className={`${sent ? "" : "hidden"} text-center`}>
            <svg viewBox="0 0 320 210" className="mx-auto w-full max-w-md drop-shadow-xl" aria-hidden="true">
              <rect x="10" y="10" width="300" height="190" rx="4" fill="#FBF9F5" stroke="#1C2342" strokeOpacity=".2" />
              <path d="M10 14 L160 120 L310 14" fill="none" stroke="#1C2342" strokeOpacity=".25" />
              <path d="M10 196 L130 100 M310 196 L190 100" fill="none" stroke="#1C2342" strokeOpacity=".15" />
              <g id="seal">
                <circle cx="160" cy="120" r="30" fill="#B5543C" />
                <circle cx="160" cy="120" r="23" fill="none" stroke="#E3CFA2" strokeOpacity=".7" />
                <svg x="138" y="98" width="44" height="44"><use href="#nm-quill" /></svg>
              </g>
            </svg>
            <p id="received" className="mt-8 font-serif text-4xl">Sealed &amp; received.</p>
            <p className="mt-2 text-ink-soft">We&apos;ll reply personally, and in confidence.</p>
            <button onClick={again} className="mt-6 font-hand text-2xl text-red-pen underline underline-offset-4">write another →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
