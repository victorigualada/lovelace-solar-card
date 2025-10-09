export const METRICS_STYLE_CSS = `
  :host {
    display: block;
    width: 100%;
    container-type: inline-size;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
    gap: 12px;
    align-items: start;
  }

  .metric-column {
    display: grid;
    gap: 24px;
  }

  .metric { min-width: 0; }

  .metric:hover { cursor: pointer; }

  .metric .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  .metric-top,
  .metric-bottom {
    display: grid;
    grid-template-columns: 24px 1fr;
    grid-template-rows: auto auto;
    column-gap: 8px;
  }

  .metric-top > .icon,
  .metric-bottom > .icon {
    grid-row: 1 / span 2;
    align-self: center;
    color: var(--secondary-text-color);
    --mdc-icon-size: 24px;
  }

  .metric-bottom > .icon.placeholder {
    display: block;
    width: 24px;
    height: 24px;
    grid-row: 1 / span 2;
    align-self: center;
    visibility: hidden;
  }

  .metric-top > .label,
  .metric-bottom > .label { grid-column: 2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .metric-top > .value,
  .metric-bottom > .value { grid-column: 2; white-space: nowrap; }

  .metric .value {
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.1;
  }

  .metric .value.smaller { font-size: 1.4rem; }

  @container (max-width: 900px) {
    .metric .value { font-size: 1.6rem; }
    .metric .value.smaller { font-size: 1.2rem; }
  }

  @container (max-width: 700px) {
    .metrics-grid { grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr)); }
    .metric .value { font-size: 1.5rem; }
    .metric .value.smaller { font-size: 1.1rem; }
  }

  @container (max-width: 568px) {
    .metrics-grid { grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr)); min-width: 0; }
  }
`;
