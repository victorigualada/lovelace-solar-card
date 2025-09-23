export interface HassEntityAttributes {
  unit_of_measurement?: string;
  temperature?: number;
  temperature_unit?: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes & Record<string, any>;
}

export interface HassLocale {
  language?: string;
}

export interface UnitSystem {
  temperature?: string;
}

export interface HassConfig {
  unit_system?: UnitSystem;
}

export interface Hass {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: HassLocale;
  config?: HassConfig;
  callWS<T = any>(msg: any): Promise<T>;
  callApi<T = any>(method: string, path: string): Promise<T>;
}

export interface EntityRegistryEntry {
  entity_id: string;
  device_id?: string;
  icon?: string;
  original_icon?: string;
}

export interface DeviceRegistryEntry {
  id: string;
  icon?: string;
  name?: string;
}

export interface DeviceConsumptionPref {
  stat_consumption: string;
  name?: string;
}

export interface EnergyPreferences {
  device_consumption?: DeviceConsumptionPref[];
}
