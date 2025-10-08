import { LitElement, html } from 'lit';

export class SolarOverview extends LitElement {
  static get properties() {
    return {
      production: { attribute: false },
      consumption: { attribute: false },
      imageUrl: { attribute: 'image-url' },
      productionLabel: { attribute: 'production-label' },
      consumptionLabel: { attribute: 'consumption-label' },
      fallback: { attribute: false },
    };
  }

  production!: { value: string; unit: string };
  consumption!: { value: string; unit: string };
  imageUrl: string = '';
  productionLabel: string = '';
  consumptionLabel: string = '';
  fallback: unknown = null;

  // Use light DOM so parent card styles apply
  createRenderRoot() {
    return this;
  }

  render() {
    const prod = this.production || { value: '—', unit: '' };
    const cons = this.consumption || { value: '—', unit: '' };
    return html`
      <div class="overview-panel">
        <div class="content">
          <div class="metric">
            <div class="label"><ha-icon icon="mdi:solar-panel"></ha-icon> ${this.productionLabel}</div>
            <div class="value">${prod.value} ${prod.unit}</div>
          </div>
          <div class="metric">
            <div class="label"><ha-icon icon="mdi:power-socket-eu"></ha-icon> ${this.consumptionLabel}</div>
            <div class="value smaller">${cons.value} ${cons.unit}</div>
          </div>
        </div>
        <div class="image">
          ${this.imageUrl
            ? html`<img src="${this.imageUrl}" alt="Solar panels" loading="lazy" />`
            : (this.fallback as any)}
        </div>
      </div>
    `;
  }
}

customElements.define('solar-overview', SolarOverview);

