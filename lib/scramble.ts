/* multi-script glyphs used for the "decoding" text effect */
const GLYPHS = [..."ABCDEFGHJKLMNPRSTUVWXYZabdefghkmnpqrstuwxyzÆØßÉÕçñαβγδλπσωДЖЗИЛФЦШЯبتجحدرسصطعفقكلمنهو明晰語文字अकखगघ"];

export const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export function scramble(el: HTMLElement, to: string, dur = 900, motion = true): Promise<void> {
  if (!motion) { el.textContent = to; return Promise.resolve(); }
  const target = [...to];
  const start = performance.now();
  return new Promise(res => {
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const shown = Math.floor(p * target.length);
      el.textContent = target.map((c, i) => (i < shown || c === " " ? c : rnd())).join("");
      if (p < 1) requestAnimationFrame(frame);
      else { el.textContent = to; res(); }
    };
    requestAnimationFrame(frame);
  });
}
