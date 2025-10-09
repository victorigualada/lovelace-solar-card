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

  /* Right side sections wrappers */
  .forecast-panel {
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding-left: 16px;
    display: grid;
    align-content: start;
    align-self: stretch;
  }

  .energy-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 12px;
  }

  /* Legacy grid-kwh section removed */
  .graphs-section {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-top: 12px;
    padding-top: 8px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  /* Grids for top/bottom sections */
  .metrics-panel {
    display: grid;
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 4px 16px 12px;
    gap: 12px;
  }

  @container (max-width: 1200px) {
    .container,
    .container.has-forecast {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .forecast-panel {
      display: flex;
    }
    .metrics-panel {
      min-width: calc(100% - 320px);
      padding-left: 0;
      border-left: none;
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
  }

  @container (max-width: 568px) {
    .metrics-panel {
      width: 100%;
    }
  }
`;
