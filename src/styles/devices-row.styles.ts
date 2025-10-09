export const DEVICES_STYLE_CSS = `
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
  }

  .badge {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--solar-badge-gap, 10px);
    /* Tier-controlled default alphas (can be overridden via --solar-badge-*) */
    --_bg-alpha: var(--solar-badge-bg-alpha, 0.04);
    --_border-alpha: var(--solar-badge-border-alpha, 0.10);
    --_icon-alpha: var(--solar-badge-icon-alpha, 0.10);
    --_progress-alpha: var(--solar-badge-progress-alpha, 0.20);
    /* Accent color hooks: follow HA icon color by default, with rgb fallback */
    --_accent-color: var(--solar-accent-color, var(--state-icon-color, var(--primary-color)));
    --_accent-rgb: var(--solar-accent-rgb, var(--rgb-primary-color));
    /* Mix percentages for color-mix fallback-less tints */
    /* Base gradient strength (start/end). You can override either or both. */
    --_bg-mix-start: var(--solar-badge-bg-mix-start, var(--solar-badge-bg-mix, 6%));
    --_bg-mix-end: var(--solar-badge-bg-mix-end, 12%);
    --_border-mix: var(--solar-badge-border-mix, 12%);
    --_icon-mix: var(--solar-badge-icon-mix, 12%);
    --_progress-mix: var(--solar-badge-progress-mix, 18%);
    background: var(
      --solar-badge-bg,
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--_accent-color) var(--_bg-mix-start), transparent),
        color-mix(in srgb, var(--_accent-color) var(--_bg-mix-end), transparent)
      )
    );
    color: var(--primary-text-color);
    padding: var(--solar-badge-padding, 8px 12px);
    border-radius: var(--solar-badge-radius, 999px);
    /* Fallback border using rgb */
    border: 1px solid var(--solar-badge-border, rgba(var(--_accent-rgb), var(--_border-alpha)));
    /* Prefer theme icon color via color-mix when available */
    border-color: var(
      --solar-badge-border,
      color-mix(in srgb, var(--_accent-color) var(--_border-mix), transparent)
    );
    white-space: nowrap;
    /* Equal width per configured max badge count */
    --_count: var(--solar-badge-max-count, 4);
    --_gap: var(--solar-badges-gap, 12px);
    --badge-basis: calc((100% - ((var(--_count) - 1) * var(--_gap))) / var(--_count));
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
      color-mix(in srgb, var(--_accent-color) 6%, transparent)
    );
    border-color: var(--_accent-color);
    box-shadow: 0 3px 10px rgba(var(--_accent-rgb), 0.12), 0 2px 4px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  .badge:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  .badge:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--_accent-rgb), 0.24);
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
    color: var(--solar-badge-icon-color, var(--_accent-color));
    /* Fallback using rgb */
    background: var(--solar-badge-icon-bg, rgba(var(--_accent-rgb), var(--_icon-alpha)));
    /* Prefer theme icon color via color-mix */
    background: var(
      --solar-badge-icon-bg,
      color-mix(in srgb, var(--_accent-color) var(--_icon-mix), transparent)
    );
    box-shadow: inset 0 0 0 1px rgba(var(--_accent-rgb), calc(var(--_icon-alpha) + 0.02));
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

  /* Straight usage fill with soft tail fade */
  .badge::before {
    content: '';
    position: absolute;
    inset: 0;
    /* Expand by tail so the solid portion ends near --badge-usage */
    width: min(100%, calc(var(--badge-usage, 0%) + var(--solar-badge-tail, 18px)));
    /* Tail length can be adjusted; pixels give consistent look */
    --_tail: var(--solar-badge-tail, 18px);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--_accent-color) var(--_progress-mix), transparent) 0%,
      color-mix(in srgb, var(--_accent-color) var(--_progress-mix), transparent) calc(100% - var(--_tail)),
      color-mix(in srgb, var(--_accent-color) 0%, transparent) 100%
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
    box-shadow: 0 2px 10px rgba(var(--_accent-rgb), 0.14), 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  @container (max-width: 900px) {
    .badges { 
      justify-content: space-evenly; 
    }
  }

  /* Compact mode: hide device name under 500px containers */
  @container (max-width: 500px) {
    .badge { grid-template-columns: auto auto; min-width: 75px }
    .badge .name { display: none; }
  }
`;
