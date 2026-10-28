export const MUSES: [string, string, string][] = [
  ["I", "Clio", "History"], ["II", "Euterpe", "Music & lyric"], ["III", "Thalia", "Comedy"], ["IV", "Melpomene", "Tragedy"],
  ["V", "Terpsichore", "Dance"], ["VI", "Erato", "Love poetry"], ["VII", "Polyhymnia", "Sacred hymn"], ["VIII", "Urania", "The stars"],
  ["IX", "Calliope", "Eloquence & epic poetry"],
];

export const NUMERALS = MUSES.map(m => m[0]);

export const LANGS: [string, string][] = [
  ["Clarity", "English"], ["Claridad", "Spanish"], ["Clarté", "French"], ["Klarheit", "German"], ["وضوح", "Arabic"],
  ["Chiarezza", "Italian"], ["Ясность", "Russian"], ["明晰", "Japanese"], ["Clareza", "Portuguese"],
];

export const MARQUEE = ["Policy writing", "Gender equality", "Minority rights", "Women's rights", "Mission-critical proposals", "Executive voice"];

export const MENU_LINKS = [
  { href: "#about", num: "I.", label: "The Ninth", page: "p. 02" },
  { href: "#services", num: "II.", label: "Strategic Communications", page: "p. 03" },
  { href: "#services", num: "III.", label: "Editorial & Proposals", page: "p. 03" },
  { href: "#leadership", num: "IV.", label: "Leadership", page: "p. 05" },
  { href: "#redpen", num: "V.", label: "Try the Red Pen", page: "p. 06" },
  { href: "#letter", num: "VI.", label: "Contact", page: "p. 07" },
];

export const AUDIENCES = [
  { title: "International Organizations", body: "Institutions and NGOs whose proposals and policy messaging must resonate across member states, donors and communities — often in several languages at once." },
  { title: "Women & Latinx in STEM", body: "Early- and mid-career professionals positioning themselves with confidence — applications, cover letters and career narratives that open doors." },
  { title: "Mission-Driven Leaders", body: "Executives and advocates who need their voice to carry conviction on complex, sensitive global issues — on the page and at the podium." },
];

export const LEADER_CARDS = [
  { k: "Now", v: "Amazon" },
  { k: "Alma mater", v: "Yale" },
  { k: "Alma mater", v: "Columbia SIPA" },
  { k: "Expertise", v: "Trust & Safety", dark: true },
  { k: "Expertise", v: "Public Interest Law" },
  { k: "Expertise", v: "International Security" },
];

export const SERVICES = ["a proposal review", "strategic communications", "policy messaging", "coaching"];

export const EMAIL = "hello@ninthmuse.com";
