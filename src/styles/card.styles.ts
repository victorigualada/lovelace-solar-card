import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    padding: 16px;
    --label-color: var(--secondary-text-color);
    container-type: inline-size;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0;
    align-items: stretch;
    grid-auto-rows: auto;
  }
  .container.has-forecast {
    grid-template-columns: 1fr 2fr auto;
  }

  /* Overview (content + image) */
  .overview-panel {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 40px;
    align-items: center;
    padding-right: 16px;
  }
  /* Metrics section */
  .right-divider {
    display: none;
  }
  .forecast-panel {
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding-left: 16px;
    display: grid;
    align-content: start;
    align-self: stretch;
  }

  .content {
    display: grid;
    gap: 10px;
  }

  .metric .label {
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }
  /* Left panel labels keep icon inline */
  .overview-panel .metric .label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 1.2rem;
    padding-bottom: 4px;
  }
  .overview-panel .metric .label ha-icon {
    color: var(--secondary-text-color);
    width: 28px;
    height: 28px;
    --mdc-icon-size: 28px;
  }
  .overview-panel .metric .value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Top row icons on the left, spanning two text rows */
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
  .metric-bottom > .label {
    grid-column: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .metric-top > .value,
  .metric-bottom > .value {
    grid-column: 2;
    white-space: nowrap;
  }

  .metric .value {
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.1;
  }

  .metric .value.smaller {
    font-size: 1.4rem;
  }

  .image {
    width: 30%;
    max-width: 180px;
    min-width: 140px;
    justify-self: end;
  }

  .image > img,
  .image > svg {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }

  .energy-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 12px;
  }
  .grid-kwh-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 8px;
  }
  .graphs-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 8px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  /* Devices row */
  .devices-row {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 12px;
  }
  .devices-row .badges {
    display: flex;
    gap: 8px;
    align-items: stretch;
    width: 100%;
    cursor: pointer;
  }
  .devices-row .badge {
    display: grid;
    grid-template-columns: auto 1fr auto; /* icon | name | value */
    align-items: center;
    gap: 8px;
    background: var(--chip-background-color, rgba(0, 0, 0, 0.03));
    color: var(--primary-text-color);
    padding: 6px 10px;
    border-radius: 16px;
    border: 1px solid transparent;
    white-space: nowrap;
    width: 100%;
    min-width: 0; /* allow inner ellipsis */
    overflow: hidden; /* prevent overlap when space is tight */
    cursor: pointer;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      box-shadow 120ms ease;
  }
  .devices-row .badge:hover {
    background: rgba(var(--rgb-primary-color), 0.08);
    border-color: var(--primary-color);
  }
  .devices-row .badge ha-icon {
    color: var(--secondary-text-color);
  }
  .devices-row .badge .name {
    max-width: 14ch;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .devices-row .badge .value {
    font-weight: 600;
    justify-self: end;
    text-align: right;
  }

  /* Forecast mini panel */
  .forecast {
    border: 0;
    border-radius: 10px;
    padding: 12px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    align-items: center;
    max-width: 320px;
    justify-self: end;
  }
  .forecast .title {
    font-weight: 700;
  }
  .forecast .subtle {
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }
  .forecast .temp {
    font-weight: 800;
    font-size: 1.8rem;
  }
  .forecast .icon ha-icon {
    width: 40px;
    height: 40px;
    --mdc-icon-size: 40px;
  }

  /* Grids for top/bottom sections */
  .metrics-panel {
    display: grid;
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 4px 16px 12px;
    gap: 12px;
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
    gap: 12px;
    align-items: start;
  }
  .metrics-grid .metric-wrapper {
    display: contents;
  }
  .metrics-grid .metric {
    min-width: 0;
  }
  .metrics-grid .metric:hover {
    cursor: pointer;
  }
  .metrics-grid .metric .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .metric-column {
    display: grid;
    gap: 24px;
  }

  /* Stack sections on narrower screens */
  @container (max-width: 1200px) {
    .container,
    .container.has-forecast {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .overview-panel {
      padding-right: 0;
      padding-bottom: 12px;
      display: flex;
      gap: 12px;
      align-items: start;
    }
    .forecast-panel {
      display: flex;
    }
    .metrics-panel {
      min-width: calc(100% - 320px);
    }
    .forecast {
      justify-self: stretch;
      max-width: none;
    }
    .image {
      width: clamp(100px, 28cqi, 150px);
      max-width: 150px;
      justify-self: end;
    }
    .metrics-panel {
      padding-left: 0;
      border-left: none;
    }
    .metrics-grid {
      grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
      min-width: 0;
    }
    .metrics-panel .metric {
      min-width: 0;
    }
  }

  @container (max-width: 900px) {
    .devices-row .badges {
      flex-wrap: wrap;
      justify-content: center;
    }
    .devices-row .badge {
      max-width: 40%;
    }
    /* Tighten big numbers and reduce columns to avoid overlap */
    .metric .value {
      font-size: 1.6rem;
    }
    .metric .value.smaller {
      font-size: 1.2rem;
    }
    .overview-panel {
      grid-template-columns: 1fr auto;
    }
    .image {
      width: clamp(90px, 26cqi, 130px);
      max-width: 130px;
    }
  }

  @container (max-width: 756px) {
    .metrics-panel {
      min-width: 100%;
    }
    .forecast-panel {
      order: 3;
      width: 100%;
      border-left: none;
      padding-left: 0;
      padding-top: 12px;
    }
    .forecast {
      padding: 0;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }

  @container (max-width: 700px) {
    .overview-panel .content {
      order: 1;
    }
    .overview-panel .image {
      order: 2;
      justify-self: start;
      width: clamp(80px, 40cqi, 120px);
      max-width: 120px;
    }
    .metrics-grid {
      grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
    }
    .metric .value {
      font-size: 1.5rem;
    }
    .metric .value.smaller {
      font-size: 1.1rem;
    }
  }

  @container (max-width: 568px) {
    .overview-panel {
      grid-template-columns: 1fr auto;
    }
    .metrics-panel {
      width: 100%;
    }
    .image {
      width: clamp(90px, 32cqi, 130px);
      max-width: 130px;
    }
    /* Right panel: clamp to max 2 columns */
    .metrics-grid {
      grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr));
      min-width: 0;
    }
  }

  @container (max-width: 350px) {
    .image > svg {
      width: 80%;
    }
  }

  @container (max-width: 280px) {
    .image {
      display: none;
    }

    .devices-row .badge {
      max-width: 100%;
    }
  }
`;

