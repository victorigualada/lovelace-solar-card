export const DEVICES_STYLE_CSS = `
  @property --grid-feed-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }

  :host {
    display: block;
    width: 100%;
    container-type: inline-size;
  }

  .devices-row {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 12px;
  }

  .badges {
    display: flex;
    gap: var(--solar-badges-gap, 12px);
    align-items: stretch;
    width: 100%;
    cursor: pointer;
    flex-wrap: wrap;
    --grid-feed-divider-width: 1px;
    --device-badge-count: var(--solar-badge-max-count, 4);
  }

  .badge {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--solar-badge-gap, 10px);
    /* Tier-controlled default alphas (can be overridden via --solar-badge-*) */
    --badge-bg-alpha: var(--solar-badge-bg-alpha, 0.04);
    --badge-border-alpha: var(--solar-badge-border-alpha, 0.10);
    --badge-icon-alpha: var(--solar-badge-icon-alpha, 0.10);
    --badge-progress-alpha: var(--solar-badge-progress-alpha, 0.20);
    /* Accent color hooks: follow HA icon color by default, with rgb fallback */
    --badge-accent-color: var(--solar-accent-color, var(--state-icon-color, var(--primary-color)));
    --badge-accent-rgb: var(--solar-accent-rgb, var(--rgb-primary-color));
    /* Mix percentages for color-mix fallback-less tints */
    /* Base gradient strength (start/end). You can override either or both. */
    --badge-bg-mix-start: var(--solar-badge-bg-mix-start, var(--solar-badge-bg-mix, 6%));
    --badge-bg-mix-end: var(--solar-badge-bg-mix-end, 12%);
    --badge-border-mix: var(--solar-badge-border-mix, 12%);
    --badge-icon-mix: var(--solar-badge-icon-mix, 12%);
    --badge-progress-mix: var(--solar-badge-progress-mix, 18%);
    background: var(
      --solar-badge-bg,
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--badge-accent-color) var(--badge-bg-mix-start), transparent),
        color-mix(in srgb, var(--badge-accent-color) var(--badge-bg-mix-end), transparent)
      )
    );
    color: var(--primary-text-color);
    padding: var(--solar-badge-padding, 8px 12px);
    border-radius: var(--solar-badge-radius, 999px);
    /* Fallback border using rgb */
    border: 1px solid var(--solar-badge-border, rgba(var(--badge-accent-rgb), var(--badge-border-alpha)));
    /* Prefer theme icon color via color-mix when available */
    border-color: var(
      --solar-badge-border,
      color-mix(in srgb, var(--badge-accent-color) var(--badge-border-mix), transparent)
    );
    white-space: nowrap;
    /* Equal width per configured max badge count */
    --badge-count: var(--device-badge-count, var(--solar-badge-max-count, 4));
    --badge-gap: var(--solar-badges-gap, 12px);
    --badge-basis: calc(
      (100% - ((var(--badge-count) - 1) * var(--badge-gap)) - var(--grid-feed-divider-width, 1px))
        / var(--badge-count)
    );
    flex: 0 0 var(--badge-basis);
    min-width: 150px;
    width: auto;
    /* Do not override the min-width; honor 150px on small screens */
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: background-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
      border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
      box-shadow 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: transform, opacity;
    position: relative;
  }

  .badge:hover {
    background: var(
      --solar-badge-hover-bg,
      color-mix(in srgb, var(--badge-accent-color) 6%, transparent)
    );
    border-color: var(--badge-accent-color);
    box-shadow: 0 3px 10px rgba(var(--badge-accent-rgb), 0.12), 0 2px 4px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  .badge:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  .badge:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--badge-accent-rgb), 0.24);
  }

  /* Enter/leave animations */
  .badge.enter { animation: badge-in 300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .badge.leave { animation: badge-out 240ms cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes badge-in {
    0% { opacity: 0; transform: translateY(6px) scale(0.985); }
    60% { opacity: 1; transform: translateY(0) scale(1.002); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes badge-out {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-6px) scale(0.985); }
  }

  @media (prefers-reduced-motion: reduce) {
    .badge.enter, .badge.leave { animation: none !important; }
  }

  .badge ha-icon {
    --mdc-icon-size: var(--solar-badge-icon-inner-size, 18px);
    display: inline-grid;
    place-items: center;
    width: var(--solar-badge-icon-size, 28px);
    height: var(--solar-badge-icon-size, 28px);
    border-radius: var(--solar-badge-icon-radius, 50%);
    color: var(--solar-badge-icon-color, var(--badge-accent-color));
    /* Fallback using rgb */
    background: var(--solar-badge-icon-bg, rgba(var(--badge-accent-rgb), var(--badge-icon-alpha)));
    /* Prefer theme icon color via color-mix */
    background: var(
      --solar-badge-icon-bg,
      color-mix(in srgb, var(--badge-accent-color) var(--badge-icon-mix), transparent)
    );
    box-shadow: inset 0 0 0 1px rgba(var(--badge-accent-rgb), calc(var(--badge-icon-alpha) + 0.02));
  }

  .badge .name {
    max-width: 16ch;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    color: var(--secondary-text-color);
  }

  .badge .value {
    font-weight: 700;
    justify-self: end;
    text-align: right;
    color: var(--primary-text-color);
  }

  .badge.grid-feed {
    --solar-badge-bg: var(
      --solar-grid-feed-background,
      color-mix(in srgb, var(--card-background-color, var(--ha-card-background, #0f172a)) 82%, transparent)
    );
    --solar-badge-border: color-mix(in srgb, var(--primary-color) 16%, transparent);
    --solar-badge-icon-bg: color-mix(in srgb, var(--primary-color) 10%, transparent);
    --solar-badge-icon-color: var(--solar-grid-feed-icon-color, var(--primary-color));
    border-radius: var(--solar-badge-radius, 999px);
    grid-template-columns: auto auto;
    gap: 10px;
    justify-content: flex-start;
    padding: 10px 16px;
    min-width: 0;
    flex: 0 0 auto;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
    position: relative;
    /* Allow charging ring to render outside the border */
    overflow: visible;
  }

  .badge.grid-feed::before {
    display: none;
  }

  .badge.grid-feed .name {
    display: none;
  }

  .badge.grid-feed .value {
    font-size: 1rem;
    letter-spacing: 0.01em;
    color: var(--solar-grid-feed-value-color, var(--primary-text-color));
    white-space: nowrap;
  }

  /* Disable older pseudo ring; we now use an SVG path that follows the pill border */
  .badge.grid-feed.charging::after { content: none; }

  /* SVG ring overlay that matches the rounded-rect outline */
  .badge.grid-feed .grid-feed-ring {
    position: absolute;
    inset: -4px;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: inherit;
    pointer-events: none;
    overflow: visible;
    opacity: 0.9;
    z-index: 2;
  }

  .badge.grid-feed .grid-feed-ring .ring {
    fill: none;
    stroke: var(--solar-grid-feed-charge-color, #22c55e);
    /* Prefer a subtle mix when available */
    stroke: var(
      --solar-grid-feed-charge-stroke,
      color-mix(in srgb, var(--solar-grid-feed-charge-color, #22c55e) 95%, transparent)
    );
    stroke-linecap: round;
    stroke-dasharray: 14 86; /* pathLength=100 -> 14% visible, 86% gap */
    stroke-dashoffset: 0;
    animation: grid-feed-dash 2.8s linear infinite;
  }

  .grid-feed-divider {
    flex: 0 0 var(--grid-feed-divider-width, 1px);
    width: var(--grid-feed-divider-width, 1px);
    background: var(--solar-grid-feed-divider-color, var(--divider-color, rgba(0, 0, 0, 0.18)));
    border-radius: 1px;
    opacity: 0.75;
    align-self: stretch;
    position: relative;
    z-index: 3; /* ensure it remains visible above any ring overflow */
  }

  @keyframes grid-feed-dash {
    to { stroke-dashoffset: -100; }
  }

  @media (prefers-reduced-motion: reduce) {
    .badge.grid-feed .grid-feed-ring .ring { animation: none !important; }
  }

  /* Straight usage fill with soft tail fade */
  .badge::before {
    content: '';
    position: absolute;
    inset: 0;
    /* Expand by tail so the solid portion ends near --badge-usage */
    width: min(100%, calc(var(--badge-usage, 0%) + var(--solar-badge-tail, 18px)));
    /* Tail length can be adjusted; pixels give consistent look */
    --badge-tail: var(--solar-badge-tail, 18px);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--badge-accent-color) var(--badge-progress-mix), transparent) 0%,
      color-mix(in srgb, var(--badge-accent-color) var(--badge-progress-mix), transparent) calc(100% - var(--badge-tail)),
      color-mix(in srgb, var(--badge-accent-color) 0%, transparent) 100%
    );
    /* Keep the left side rounded, right side straight */
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    transition: width 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;
    z-index: 0;
  }

  /* Keep foreground content above the fill */
  .badge > * { position: relative; z-index: 1; }

  /* No extra rules needed for no-value; background-size uses 0% fallback */

  /* Intensity tiers based on relative watts */
  .badge.tier-1 { 
    --solar-badge-bg-alpha: 0.06; 
    --solar-badge-border-alpha: 0.14; 
    --solar-badge-icon-alpha: 0.14; 
    --solar-badge-progress-alpha: 0.28;
  }
  .badge.tier-2 { 
    --solar-badge-bg-alpha: 0.06; 
    --solar-badge-border-alpha: 0.14; 
    --solar-badge-icon-alpha: 0.14; 
    --solar-badge-progress-alpha: 0.26; 
    --solar-badge-bg-mix-start: 8%;
    --solar-badge-bg-mix-end: 16%;
  }
  .badge.tier-3 { 
    --solar-badge-bg-alpha: 0.08; 
    --solar-badge-border-alpha: 0.18; 
    --solar-badge-icon-alpha: 0.18; 
    --solar-badge-progress-alpha: 0.30; 
    --solar-badge-bg-mix-start: 10%;
    --solar-badge-bg-mix-end: 20%;
    box-shadow: 0 2px 10px rgba(var(--badge-accent-rgb), 0.14), 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  @container (max-width: 900px) {
    .badges { 
      justify-content: space-evenly; 
    }
  }

  /* Small containers: use a horizontal divider, but keep feed badge intrinsic size */
  @container (max-width: 700px) {
    .grid-feed-divider {
      flex: 0 0 100%;
      width: 100%;
      height: 0;
      margin: 6px 0;
      background: none;
      border-top: 1px solid var(--solar-grid-feed-divider-color, var(--divider-color, rgba(0, 0, 0, 0.18)));
      border-radius: 0;
    }
  }

  /* Compact mode: hide device name under 500px containers */
  @container (max-width: 500px) {
    .badge { grid-template-columns: auto auto; min-width: 75px }
    .badge .name { display: none; }
  }
`;
