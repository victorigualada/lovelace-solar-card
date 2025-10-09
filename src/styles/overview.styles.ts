export const OVERVIEW_STYLE_CSS = `
  :host {
    display: contents;
  }

  .overview-panel {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 40px;
    align-items: center;
    padding-right: 16px;
  }

  .content {
    display: grid;
    gap: 10px;
  }

  .metric .label {
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

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

  @container (max-width: 1200px) {
    .overview-panel {
      padding-right: 0;
      padding-bottom: 12px;
      display: flex;
      gap: 12px;
      align-items: start;
    }

    .image {
      width: clamp(100px, 28cqi, 150px);
      max-width: 150px;
      justify-self: end;
    }
  }

  @container (max-width: 700px) {
    .overview-panel .content { order: 1; }

    .overview-panel .image {
      order: 2;
      justify-self: start;
      width: clamp(80px, 40cqi, 120px);
      max-width: 120px;
    }
  }

  @container (max-width: 568px) {
    .overview-panel { grid-template-columns: 1fr auto; }
  }

  @container (max-width: 350px) {
    .image > svg { width: 80%; }
  }

  @container (max-width: 280px) {
    .image { display: none; }
  }
`;
