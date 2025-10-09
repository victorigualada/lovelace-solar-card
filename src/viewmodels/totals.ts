import type { Hass } from '../types/ha';
import type { SolarCardConfig, SolarCardTotalsMetric } from '../types/solar-card-config';
import { entityDisplay } from '../utils/entity';
import { iconForEntity } from '../utils/icons';

export type TotalsItem = {
  key: string;
  label: string;
  value: string;
  unit: string;
  icon: string | null;
  entity: string | null;
};

export function effectiveTotalsMetricConfig(cfg: SolarCardConfig): SolarCardTotalsMetric[] {
  if (!Array.isArray(cfg.totals_metrics)) return [];
  return cfg.totals_metrics
    .filter((metric) => metric && typeof metric === 'object')
    .slice(0, 8)
    .map((metric, idx) => {
      const idFallback = typeof metric.entity === 'string' && metric.entity ? metric.entity : `metric-${idx + 1}`;
      return {
        ...metric,
        id: typeof metric.id === 'string' && metric.id ? metric.id : idFallback,
      } as SolarCardTotalsMetric;
    });
}

export function labelForTotalsMetric(hass: Hass | null, metric: SolarCardTotalsMetric, entityId?: string | null) {
  if (typeof metric.label === 'string' && metric.label.trim()) return metric.label.trim();
  if (entityId) {
    const stateObj = hass?.states?.[entityId];
    const friendly = stateObj?.attributes?.friendly_name;
    if (friendly) return friendly;
    const [, suffix] = entityId.split('.', 2);
    if (suffix) return suffix.replace(/_/g, ' ');
  }
  return 'Total';
}

export function computeTotalsMetrics(hass: Hass | null, cfg: SolarCardConfig): TotalsItem[] {
  const metrics = effectiveTotalsMetricConfig(cfg);
  return metrics.map((metric, index) => {
    const entityId = metric.entity;
    const display = entityId ? entityDisplay(hass, entityId) : { value: '—', unit: '' };
    const label = labelForTotalsMetric(hass, metric, entityId);
    const unit = typeof metric.unit === 'string' && metric.unit ? metric.unit : display.unit;
    const key = metric.id || entityId || `metric-${index + 1}`;
    const useEntityIcon = metric.use_entity_icon !== false; // default true
    let icon: string | null = null;
    if (useEntityIcon && entityId) {
      const entityIcon = iconForEntity(hass, entityId);
      if (typeof entityIcon === 'string' && entityIcon.trim()) icon = entityIcon.trim();
    }
    if (!icon) {
      const custom = typeof metric.icon === 'string' && metric.icon.trim() ? metric.icon.trim() : '';
      icon = custom || null;
    }
    return {
      key,
      label,
      value: display.value,
      unit,
      icon,
      entity: entityId || null,
    };
  });
}
