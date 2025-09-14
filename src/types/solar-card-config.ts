import type { LovelaceCardConfig } from 'custom-card-helpers';

export interface SolarCardConfig extends LovelaceCardConfig {
  type: string;
  production_entity?: string;
  current_consumption_entity?: string;
  image_url?: string;
  show_energy_flow?: boolean;
  show_top_devices?: boolean;
  top_devices_max?: number;
  show_solar_forecast?: boolean;
  weather_entity?: string;
  solar_forecast_today_entity?: string;
  yield_today_entity?: string;
  grid_consumption_today_entity?: string;
  battery_percentage_entity?: string;
  inverter_state_entity?: string;
  total_yield_entity?: string;
  total_grid_consumption_entity?: string;
  battery_capacity_entity?: string;
  inverter_mode_entity?: string;
  trend_graph_entities?: string[];
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
}
