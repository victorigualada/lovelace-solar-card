export const FORECAST_STYLE_CSS = `
  :host {
    display: contents;
  }

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

  .forecast .title { font-weight: 700; }

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

  @container (max-width: 756px) {
    .forecast { 
      display: flex; 
      width: 100%; 
      justify-content: space-between;
      max-width: unset;
    }
  }
`;
