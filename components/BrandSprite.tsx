/* Brand mark redrawn from the logo — swap for the official file */
export default function BrandSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="quillBands" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9EC5E8" /><stop offset=".34" stopColor="#9EC5E8" />
          <stop offset=".34" stopColor="#8E9AC4" /><stop offset=".52" stopColor="#8E9AC4" />
          <stop offset=".52" stopColor="#9C93B5" /><stop offset=".68" stopColor="#9C93B5" />
          <stop offset=".68" stopColor="#6E6A93" /><stop offset=".82" stopColor="#6E6A93" />
          <stop offset=".82" stopColor="#3B3F66" /><stop offset="1" stopColor="#3B3F66" />
        </linearGradient>
        <path id="arcTop" d="M 38 100 A 62 62 0 0 1 162 100" fill="none" />
        <path id="arcBot" d="M 26 100 A 74 74 0 0 0 174 100" fill="none" />
      </defs>
      <symbol id="nm-quill" viewBox="0 0 200 200">
        <path d="M74 146 C 84 112, 104 82, 146 56 C 138 92, 118 120, 84 138 Z" fill="url(#quillBands)" />
        <path d="M70 152 L 140 64" stroke="#9EC5E8" strokeWidth="2.4" strokeLinecap="round" />
      </symbol>
      <symbol id="nm-logo" viewBox="0 0 200 200">
        <use href="#nm-quill" />
        <g fill="currentColor" className="font-sans" fontSize="22" letterSpacing="13">
          <text textAnchor="middle"><textPath href="#arcTop" startOffset="52%">NINTH</textPath></text>
          <text textAnchor="middle"><textPath href="#arcBot" startOffset="52%">MUSE</textPath></text>
        </g>
        <circle cx="22" cy="100" r="3" fill="currentColor" /><circle cx="178" cy="100" r="3" fill="currentColor" />
      </symbol>
    </svg>
  );
}
