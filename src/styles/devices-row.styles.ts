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
    gap: 8px;
    align-items: stretch;
    width: 100%;
    cursor: pointer;
  }

  .badge {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    background: var(--chip-background-color, rgba(0, 0, 0, 0.03));
    color: var(--primary-text-color);
    padding: 6px 10px;
    border-radius: 16px;
    border: 1px solid transparent;
    white-space: nowrap;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    cursor: pointer;
    transition: background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
  }

  .badge:hover {
    background: rgba(var(--rgb-primary-color), 0.08);
    border-color: var(--primary-color);
  }

  .badge ha-icon { color: var(--secondary-text-color); }

  .badge .name {
    max-width: 14ch;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .badge .value {
    font-weight: 600;
    justify-self: end;
    text-align: right;
  }

  @container (max-width: 900px) {
    .badges { 
      flex-wrap: wrap; 
      justify-content: space-evenly; 
    }
 
    .badge { max-width: 40%; }
  }

  @container (max-width: 280px) { 
    .badge { max-width: 100%; } 
  }
`;
