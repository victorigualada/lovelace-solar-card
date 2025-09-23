import { html, svg } from 'lit';

export function renderDefaultPanelsSvg() {
  const rows = Array.from({ length: 3 });
  const cols = Array.from({ length: 6 });
  const cells = rows.flatMap((_r, r) =>
    cols.map((_c, c) =>
      svg`<rect x="${8 + c * 31}" y="${8 + r * 36}" width="28" height="28" rx="3" fill="rgba(255,255,255,0.25)" />`,
    ),
  );
  return html`
    <svg viewBox="0 0 240 200" part="image" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2d6cdf" />
          <stop offset="100%" stop-color="#0d3fa6" />
        </linearGradient>
      </defs>
      <g transform="translate(20,20)">
        <rect x="0" y="0" width="200" height="120" rx="6" fill="url(#g1)" />
        ${cells}
        <rect x="0" y="0" width="200" height="120" rx="6" fill="none" stroke="rgba(255,255,255,0.6)" />
      </g>
      <rect x="40" y="150" width="160" height="10" rx="5" fill="#8892a0" opacity="0.7" />
    </svg>
  `;
}
