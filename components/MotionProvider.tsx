"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type MotionCtx = {
  /** null until the client has resolved media queries */
  motion: boolean | null;
  fine: boolean;
  reduce: boolean;
  introDone: boolean;
  finishIntro: () => void;
  getLenis: () => Lenis | null;
  scrollTo: (target: string | HTMLElement, opts?: { offset?: number; duration?: number }) => void;
};

const Ctx = createContext<MotionCtx | null>(null);

export const useMotion = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMotion must be used inside <MotionProvider>");
  return c;
};

function useMedia(query: string): boolean | null {
  return useSyncExternalStore(
    cb => { const m = matchMedia(query); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => matchMedia(query).matches,
    () => null,
  );
}

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceQ = useMedia("(prefers-reduced-motion: reduce)");
  const fineQ = useMedia("(pointer: fine)");
  const motion = reduceQ === null ? null : !reduceQ;
  const reduce = !!reduceQ;
  const fine = !!fineQ;

  const lenisRef = useRef<Lenis | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const introRef = useRef(false);

  const getLenis = useCallback(() => lenisRef.current, []);

  const finishIntro = useCallback(() => {
    if (introRef.current) return;
    introRef.current = true;
    lenisRef.current?.start();
    setIntroDone(true);
  }, []);

  const scrollTo = useCallback<MotionCtx["scrollTo"]>((target, opts = {}) => {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(el, { duration: opts.duration ?? 1.6, offset: opts.offset ?? 0 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  /* smooth scrolling, driven by the GSAP ticker; held until the intro finishes */
  useEffect(() => {
    if (!motion) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    if (!introRef.current) lenis.stop();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motion]);

  /* in-page anchor links go through Lenis (menu links wait for the menu to close) */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const t = id.length > 1 && document.querySelector<HTMLElement>(id);
      if (!t) return;
      e.preventDefault();
      setTimeout(() => scrollTo(t), a.classList.contains("menu-link") ? 450 : 0);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  return (
    <Ctx.Provider value={{ motion, fine, reduce, introDone, finishIntro, getLenis, scrollTo }}>
      {children}
    </Ctx.Provider>
  );
}
