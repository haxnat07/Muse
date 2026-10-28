"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { guessService, markUp, RP_SAMPLES, type MarkUp, type SampleKey } from "@/lib/redpen";
import { prefillLetter } from "./Letter";

const fill = (c: string) => ({ "--fill": c }) as React.CSSProperties;
const MAX = 700;
const SAMPLE_LABELS: [SampleKey, string][] = [["cover", "Cover letter"], ["proposal", "Proposal"], ["policy", "Policy line"]];

/* V. Try the red pen — rule-based, runs in the browser */
export default function RedPen() {
  const { motion, getLenis } = useMotion();
  const root = useRef<HTMLElement>(null);
  const inRef = useRef<HTMLTextAreaElement>(null);
  const outRef = useRef<HTMLParagraphElement>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<MarkUp | null>(null);
  // how many struck words / insertions / notes have been revealed so far
  const [shown, setShown] = useState({ old: 0, neu: 0, notes: 0 });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useGSAP(() => {
    if (!motion) return;
    gsap.from(["#rpInWrap", "#rpOutWrap"], { y: 60, autoAlpha: 0, stagger: 0.12, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
  }, { dependencies: [motion], scope: root });

  const goBtn = useRef<HTMLButtonElement>(null);
  const [needText, setNeedText] = useState(false);

  const run = () => {
    const t = text.trim();
    if (!t) { setNeedText(true); inRef.current?.focus(); return; }
    setNeedText(false);
    timers.current.forEach(clearTimeout); timers.current = [];
    const r = markUp(t);
    setResult(r);
    if (!motion) { setShown({ old: Infinity, neu: Infinity, notes: Infinity }); return; }

    setShown({ old: 0, neu: 0, notes: 0 });
    const at = (ms: number, f: () => void) => timers.current.push(setTimeout(f, ms));
    for (let i = 0; i < r.edits; i++) {
      at(200 + i * 380, () => setShown(s => ({ ...s, old: i + 1 })));
      at(200 + i * 380 + 320, () => setShown(s => ({ ...s, neu: i + 1 })));
    }
    r.notes.forEach((_, i) => at(350 + i * 380, () => setShown(s => ({ ...s, notes: i + 1 }))));
    const lenis = getLenis();
    if (lenis && outRef.current && outRef.current.getBoundingClientRect().top > innerHeight * 0.8) lenis.scrollTo("#rpOutWrap", { offset: -100, duration: 1.2 });
  };

  /* samples only fill the draft; the reader presses "Mark it up" to run the edit */
  const loadSample = (k: SampleKey) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setText(RP_SAMPLES[k]); setResult(null); setNeedText(false);
    if (motion) gsap.fromTo(goBtn.current, { scale: 1 }, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 3, ease: "power1.inOut" });
  };

  return (
    <section ref={root} id="redpen" className="relative py-24 lg:py-36 border-t border-ink/10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-red-pen">V. — Try the red pen</p>
            <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-[1]">Hand us one paragraph. <em className="text-navy-soft">Watch it tighten.</em></h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-ink-soft">Paste a cover-letter opening, a proposal summary or a policy line. It&apos;s marked up right here in your browser &mdash; nothing you type leaves this page.</p>
        </div>

        <div className="mt-12 grid lg:grid-cols-12 gap-8 lg:gap-10">
          <div id="rpInWrap" className="lg:col-span-5">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sample paragraphs">
              <span className="eyebrow text-ink-mute mr-1">Try a sample:</span>
              {SAMPLE_LABELS.map(([k, label]) => (
                <button key={k} type="button" onClick={() => loadSample(k)} className="rounded-full ring-1 ring-ink/20 px-4 py-1.5 text-sm hover:ring-gold hover:bg-paper-soft transition">{label}</button>
              ))}
            </div>
            <label htmlFor="rpIn" className="sr-only">Your paragraph</label>
            <textarea
              id="rpIn" ref={inRef} maxLength={MAX} rows={8} value={text}
              onChange={e => { setText(e.target.value); if (e.target.value.trim()) setNeedText(false); }}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run(); } }}
              className="mt-4 w-full rounded-sm bg-paper-soft ring-1 ring-ink/15 focus:ring-2 focus:ring-gold outline-none p-5 font-serif text-xl leading-8 resize-y"
              placeholder="Paste one paragraph here…"
            />
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-xs text-ink-mute" aria-live="polite">
                {needText ? <span className="font-hand text-lg text-red-pen">paste a paragraph or pick a sample first ↑</span> : `${text.length} / ${MAX}`}
              </span>
              <button ref={goBtn} type="button" onClick={run} className="ink-btn magnetic inline-flex items-center gap-3 rounded-full bg-navy text-paper px-7 py-4 text-sm hover:text-navy" style={fill("#C5A059")}>Mark it up <span aria-hidden="true">✎</span></button>
            </div>
          </div>

          <div id="rpOutWrap" className="lg:col-span-7">
            <div className="relative bg-paper-soft ruled margin-line shadow-[0_40px_80px_-40px_rgba(28,35,66,.45)] ring-1 ring-ink/5 rounded-sm p-6 sm:p-10 min-h-[22rem] grid sm:grid-cols-[1fr_12rem] gap-8">
              <div>
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <span className="eyebrow text-ink-mute">Marked-up draft</span>
                  <span className="text-xs text-ink-mute">{result?.stats}</span>
                </div>
                <p ref={outRef} className="mt-4 font-serif text-xl leading-8 text-ink" aria-live="polite">
                  {!result && <span className="text-ink/35 italic">Your marked-up paragraph will appear here.</span>}
                  {result?.segments.map((seg, i) => {
                    if (seg.kind === "text") return <span key={i}>{seg.text}</span>;
                    const k = seg.idx;
                    return (
                      <span key={i}>
                        <span className={`rp-old ${k < shown.old ? "on" : ""}`}>{seg.old}</span>
                        {seg.rep && <> <span className={`rp-new ${k < shown.neu ? "on" : ""}`}>{seg.rep}</span></>}
                        <sup className="rp-sup">{seg.n}</sup>
                      </span>
                    );
                  })}
                </p>
              </div>
              <aside className="border-t sm:border-t-0 sm:border-l border-dashed border-red-pen/30 pt-6 sm:pt-0 sm:pl-6">
                <p className="eyebrow text-red-pen">Margin notes</p>
                <ol className="mt-3 space-y-2 font-hand text-xl text-red-pen leading-tight">
                  {result?.notes.map((n, i) => (
                    <li key={n} className={`rp-note flex gap-2 ${i < shown.notes ? "on" : ""}`}>
                      <span className="font-sans text-xs mt-1.5 shrink-0">{i + 1}</span><span>{n}</span>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
            <div className={`${result ? "flex" : "hidden"} mt-6 flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <p className="text-ink-soft text-sm max-w-md">This is a checklist, not an editor. A Ninth Muse editor also weighs structure, audience and cultural tone &mdash; things no checklist catches.</p>
              <a
                href="#letter" onClick={() => prefillLetter({ message: text.trim(), service: guessService(text) })}
                className="ink-btn magnetic shrink-0 inline-flex items-center gap-3 rounded-full ring-1 ring-ink/25 px-6 py-3 text-sm hover:text-paper" style={fill("#1C2342")}
              >Send it for a full edit →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
