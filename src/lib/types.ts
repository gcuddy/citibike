export interface Root<TData> {
  data: Data<TData>;
  last_updated: number;
  ttl: number;
}

export interface Data<T> {
  stations: T[];
}

export interface StationInfo {
  name: string;
  rental_uris: RentalUris;
  eightd_has_key_dispenser: boolean;
  legacy_id: string;
  external_id: string;
  eightd_station_services: any[];
  electric_bike_surcharge_waiver: boolean;
  has_kiosk: boolean;
  station_id: string;
  capacity: number;
  lat: number;
  rental_methods: string[];
  lon: number;
  short_name: string;
  station_type: string;
  region_id?: string;
}

export interface RentalUris {
  ios: string;
  android: string;
}

export interface StationStatus {
  is_installed: number;
  num_docks_available: number;
  last_reported: number;
  station_status: string;
  num_bikes_available: number;
  is_returning: number;
  station_id: string;
  legacy_id: string;
  num_docks_disabled: number;
  is_renting: number;
  eightd_has_available_keys: boolean;
  num_ebikes_available: number;
  num_bikes_disabled: number;
  num_scooters_unavailable?: number;
  num_scooters_available?: number;
}


export type StationInfoRoot = Root<StationInfo>;
export type StationStatusRoot = Root<StationStatus>;
