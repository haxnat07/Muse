"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";

/*
 * Page-wide effects: header contrast + logo spin, ink-fill buttons,
 * magnetic buttons and the custom cursor. Rendered last so its triggers measure after every pin.
 */
export default function GlobalMotion() {
  const { motion, fine } = useMotion();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  /* ink-fill buttons start their fill where the pointer enters */
  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const b = (e.target as Element).closest?.<HTMLElement>(".ink-btn");
      if (!b || b.contains(e.relatedTarget as Node)) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--x", e.clientX - r.left + "px");
      b.style.setProperty("--y", e.clientY - r.top + "px");
    };
    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  useGSAP(() => {
    if (!motion) return;
    ScrollTrigger.create({ trigger: "#services", start: "top 60px", end: "bottom 60px", toggleClass: { targets: "#siteHeader", className: "on-dark" } });
    gsap.to("#headLogo", { rotate: 360, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 1 } });

    if (!fine) return;
    const cleanups: (() => void)[] = [];

    gsap.utils.toArray<HTMLElement>(".magnetic").forEach(b => {
      const xTo = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }), yTo = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
      const move = (e: MouseEvent) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); };
      const leave = () => { xTo(0); yTo(0); };
      b.addEventListener("mousemove", move);
      b.addEventListener("mouseleave", leave);
      cleanups.push(() => { b.removeEventListener("mousemove", move); b.removeEventListener("mouseleave", leave); });
    });

    const html = document.documentElement;
    html.classList.add("has-cursor");
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    gsap.set([dot.current, ring.current], { autoAlpha: 0 });
    let seen = false;
    const onMove = (e: MouseEvent) => {
      if (!seen) { seen = true; gsap.set(ring.current, { x: e.clientX, y: e.clientY }); gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 }); }
      gsap.set(dot.current, { x: e.clientX, y: e.clientY }); rx(e.clientX); ry(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      const big = t.closest<HTMLElement>("[data-cursor]"), hov = t.closest("a, button, select, [data-cursor-hover]");
      ring.current?.classList.toggle("big", !!big && !hov);
      ring.current?.classList.toggle("hover", !!hov);
      if (big && label.current) label.current.textContent = big.dataset.cursor ?? "";
    };
    const hide = () => gsap.to([dot.current, ring.current], { autoAlpha: 0 });
    const show = () => gsap.to([dot.current, ring.current], { autoAlpha: 1 });
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    cleanups.push(() => {
      html.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    });
    return () => cleanups.forEach(f => f());
  }, { dependencies: [motion, fine] });

  return (
    <>
      <div ref={dot} id="cDot" aria-hidden="true" />
      <div ref={ring} id="cRing" aria-hidden="true"><span ref={label}>Read</span></div>
    </>
  );
}
