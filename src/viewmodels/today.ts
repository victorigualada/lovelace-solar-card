import type { Hass } from '../types/ha';
import type { SolarCardConfig, DisplayValue } from '../types/solar-card-config';
import { formatNumberLocale } from '../utils/format';

export type TodayVm = {
  yieldToday: DisplayValue;
  gridToday: DisplayValue;
  yieldEntity: string | null;
  gridEntity: string | null;
};

export function computeToday(
  hass: Hass | null,
  cfg: SolarCardConfig,
  ensureYieldFromTotalNum: (entityId: string) => number | null,
  ensureGridFromTotalNum: (entityId: string) => number | null,
): TodayVm {
  const yieldUnit = cfg.total_yield_entity
    ? hass?.states?.[cfg.total_yield_entity]?.attributes?.unit_of_measurement || ''
    : '';
  const gridUnit = cfg.total_grid_consumption_entity
    ? hass?.states?.[cfg.total_grid_consumption_entity]?.attributes?.unit_of_measurement || ''
    : '';

  let yieldToday: DisplayValue = { value: '—', unit: yieldUnit };
  if (cfg.total_yield_entity) {
    const num = ensureYieldFromTotalNum(cfg.total_yield_entity);
    yieldToday =
      num != null
        ? { value: formatNumberLocale(num, hass, { maximumFractionDigits: 2 }), unit: yieldUnit }
        : { value: '—', unit: yieldUnit };
  }

  let gridToday: DisplayValue = { value: '—', unit: gridUnit };
  if (cfg.total_grid_consumption_entity) {
    const num = ensureGridFromTotalNum(cfg.total_grid_consumption_entity);
    gridToday =
      num != null
        ? { value: formatNumberLocale(num, hass, { maximumFractionDigits: 2 }), unit: gridUnit }
        : { value: '—', unit: gridUnit };
  }

  return {
    yieldToday,
    gridToday,
    yieldEntity: cfg.total_yield_entity || null,
    gridEntity: cfg.total_grid_consumption_entity || null,
  };
}
