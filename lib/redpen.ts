/* Red Pen demo: rule-based simulation, no AI, nothing leaves the browser */

export const RP_SAMPLES = {
  cover: "To whom it may concern, I am writing to apply for the Policy Associate role. I am a hard-working team player and I am very passionate about gender equality. I believe that my skills would be a great fit in order to support your mission in a fast-paced environment.",
  proposal: "It is important to note that due to the fact that funding is limited, we will utilize a number of community partners in order to leverage existing networks and create synergies. This is extremely important for the success of the programme at this point in time.",
  policy: "The chairman of the committee argued that mankind must act now. Each delegate should bring his or her own manpower estimates, and with regard to the budget, we really need to think outside the box.",
} as const;

export type SampleKey = keyof typeof RP_SAMPLES;

type Rule = [RegExp, string | ((m: string) => string), string];

// [pattern, replacement ('' = cut), margin note] — longer phrases win over shorter overlapping ones
const RP_RULES: Rule[] = [
  [/\bto whom it may concern,?/gi, "Dear Hiring Committee,", "find a name if you can"],
  [/\bdear sir(?:\s*(?:\/|or)\s*madam)?,?/gi, "Dear Hiring Committee,", "find a name if you can"],
  [/\bI am writing to apply for\b/gi, "I'd like to be considered for", "they know why you're writing"],
  [/\bI am a hard-working team player\b/gi, "In my last role I [one concrete result]", "show, don't claim"],
  [/\b(?:hard-working|detail-oriented|results-driven|self-motivated)\s*/gi, "", "show, don't claim"],
  [/\bteam player\b/gi, "collaborator", "cliché"],
  [/\b(?:(?:very|really|extremely) )?passionate about\b/gi, "committed to", "everyone is 'passionate'"],
  [/\b(?:very|extremely|really) important\b/gi, "critical", "one strong word beats two weak ones"],
  [/\bI (?:believe|think|feel) that\s*/gi, "", "own the claim"],
  [/\bit is important to note that\s*/gi, "", "if it matters, just say it"],
  [/\bdue to the fact that\b/gi, "because", "fewer words, same meaning"],
  [/\bin order to\b/gi, "to", "fewer words, same meaning"],
  [/\bat this point in time\b/gi, "now", "fewer words, same meaning"],
  [/\bwith regards? to\b/gi, "on", "fewer words, same meaning"],
  [/\bin terms of\b/gi, "in", "fewer words, same meaning"],
  [/\ba number of\b/gi, "several", "be specific if you can"],
  [/\butili[sz](?:e|es|ed|ing)\b/gi, m => m.replace(/utili[sz]/i, "us"), "plain English"],
  [/\bleverag(?:e|ing)\b/gi, "build on", "jargon"],
  [/\bsynerg(?:y|ies)\b/gi, "collaboration", "jargon"],
  [/\bthink outside the box\b/gi, "rethink our approach", "cliché"],
  [/\s*in a fast-paced environment\b/gi, "", "cliché — and it adds nothing"],
  [/\bwould be a great fit\b/gi, "match what you need", "let them decide 'fit'"],
  [/\bchairman\b/gi, "chair", "inclusive language"],
  [/\bmankind\b/gi, "humanity", "inclusive language"],
  [/\bmanpower\b/gi, "staffing", "inclusive language"],
  [/\bhis or her\b/gi, "their", "inclusive language"],
  [/\bhe or she\b/gi, "they", "inclusive language"],
  [/\b(?:very|really)\s+/gi, "", "intensifiers weaken"],
];

type Hit = { s: number; e: number; old: string; rep: string; note: string };

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "edit"; old: string; rep: string; n: number; idx: number };

export type MarkUp = { segments: Segment[]; notes: string[]; edits: number; stats: string };

const wc = (t: string) => (t.trim().match(/\S+/g) || []).length;

function findEdits(text: string): Hit[] {
  const hits: Hit[] = [];
  RP_RULES.forEach(([re, repl, note]) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (!m[0]) { re.lastIndex++; continue; }
      const rep = typeof repl === "function" ? repl(m[0]) : repl;
      hits.push({ s: m.index, e: m.index + m[0].length, old: m[0], rep, note });
    }
  });
  hits.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s));
  const out: Hit[] = [];
  let cur = 0;
  hits.forEach(h => { if (h.s >= cur) { out.push(h); cur = h.e; } });
  return out;
}

export function markUp(text: string): MarkUp {
  const edits = findEdits(text);
  const notes: string[] = [];
  const noteNum = (n: string) => { let i = notes.indexOf(n); if (i < 0) { notes.push(n); i = notes.length - 1; } return i + 1; };
  const segments: Segment[] = [];
  let after = "", cur = 0;
  edits.forEach(ed => {
    const before = text.slice(cur, ed.s);
    if (before) segments.push({ kind: "text", text: before });
    after += before;
    let r = ed.rep;
    if (r && /^[A-Z]/.test(ed.old.trim()) && /^[a-z]/.test(r)) r = r[0].toUpperCase() + r.slice(1);
    segments.push({ kind: "edit", old: ed.old, rep: r, n: noteNum(ed.note), idx: segments.filter(x => x.kind === "edit").length });
    after += r;
    cur = ed.e;
  });
  const rest = text.slice(cur);
  if (rest) segments.push({ kind: "text", text: rest });
  after += rest;

  if (text.split(/(?<=[.!?])\s+/).some(s => wc(s) > 30)) noteNum("a sentence runs past 30 words — split it?");
  if (text.includes("!")) noteNum('let the content carry the energy, not the "!"');
  if (!edits.length) noteNum("already tight — next an editor would look at structure, audience and tone");

  const stats = `${wc(text)} → ${wc(after)} words · ${edits.length} edit${edits.length === 1 ? "" : "s"}`;
  return { segments, notes, edits: edits.length, stats };
}

export const guessService = (text: string) => (/dear|apply|role|position/i.test(text) ? "coaching" : "a proposal review");
