import { LitElement, html, svg } from 'lit';
import type { Hass } from '../types/ha';
import type { DisplayValue } from '../types/solar-card-config';
import { entityDisplay } from '../utils/entity';
import { OVERVIEW_STYLE_CSS } from '../styles/overview.styles';


export class SolarOverview extends LitElement {
  static get properties() {
    return {
      production: { attribute: false },
      consumption: { attribute: false },
      imageUrl: { attribute: 'image-url' },
      productionLabel: { attribute: 'production-label' },
      consumptionLabel: { attribute: 'consumption-label' },
      fallback: { attribute: false },
      hass: { attribute: false },
      productionEntity: { attribute: 'production-entity' },
      consumptionEntity: { attribute: 'consumption-entity' },
      imageFallback: { type: Boolean, attribute: 'image-fallback' },
    };
  }

  production!: DisplayValue;
  consumption!: DisplayValue;
  imageUrl: string = '';
  productionLabel: string = '';
  consumptionLabel: string = '';
  fallback: unknown = null;
  hass: Hass | null = null;
  productionEntity?: string;
  consumptionEntity?: string;
  imageFallback: boolean = false;

  private _defaultPanelsSvg() {
    const rows = Array.from({ length: 3 });
    const cols = Array.from({ length: 6 });
    const cells = rows.flatMap((_r, r) =>
      cols.map((_c, c) => svg`<rect x="${8 + c * 31}" y="${8 + r * 36}" width="28" height="28" rx="3" fill="rgba(255,255,255,0.25)" />`),
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

  // Use light DOM so parent card styles apply
  createRenderRoot() {
    return this;
  }

  render() {
    let prod = this.production || { value: '—', unit: '' };
    let cons = this.consumption || { value: '—', unit: '' };
    if ((!prod || !prod.value) && this.hass && this.productionEntity) {
      prod = entityDisplay(this.hass, this.productionEntity);
    }
    if ((!cons || !cons.value) && this.hass && this.consumptionEntity) {
      cons = entityDisplay(this.hass, this.consumptionEntity);
    }
    return html`
      <style>${OVERVIEW_STYLE_CSS}</style>
      <style>${OVERVIEW_STYLE_CSS}</style>
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
            : (this.fallback as any) || (this.imageFallback ? this._defaultPanelsSvg() : null)}
        </div>
      </div>
    `;
  }
}

customElements.define('solar-overview', SolarOverview);
