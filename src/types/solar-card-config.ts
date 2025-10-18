import type { LovelaceCardConfig } from 'custom-card-helpers';

export interface SolarCardConfig extends LovelaceCardConfig {
  type: string;
  production_entity?: string;
  current_consumption_entity?: string;
  image_url?: string;
  grid_feed_entity?: string;
  grid_feed_charging_entity?: string;
  show_energy_flow?: boolean;
  show_top_devices?: boolean;
  top_devices_max?: number;
  device_badge_intensity?: boolean;
  excluded_device_ids?: string[];
  show_solar_forecast?: boolean;
  weather_entity?: string;
  solar_forecast_today_entity?: string;
  // When true (default), show the two "today" metrics (yield + grid).
  // When false, hide them and allow up to 8 custom totals metrics.
  show_today_metrics?: boolean;
  total_yield_entity?: string;
  total_grid_consumption_entity?: string;
  totals_metrics?: SolarCardTotalsMetric[];
  trend_graph_entities?: string[];
  trend_graph_hours_to_show?: number;
  show_trend_graphs?: boolean;
}

export interface SolarCardTotalsMetric {
  id?: string;
  entity?: string;
  label?: string;
  unit?: string;
  icon?: string;
  // When true or undefined, use the entity's own icon (if any).
  // When false, use the custom `icon` field if provided; otherwise no icon.
  use_entity_icon?: boolean;
}

export interface DisplayValue {
  value: string;
  unit: string;
}

export interface DeviceBadgeItem {
  id: string;
  name: string;
  watts: number;
  icon?: string;
  powerText?: string;
  entityId?: string;
  charging?: boolean;
}
