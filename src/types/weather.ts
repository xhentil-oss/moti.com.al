// ─── Core Weather Types ──────────────────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherSymbol {
  code: string;
  label: string;
  emoji: string;
}

export interface HourlyForecast {
  time: string; // ISO-8601
  temperature: number;
  feelsLike: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  uvIndex: number;
  symbol: WeatherSymbol;
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  symbol: WeatherSymbol;
  sunrise?: string;
  sunset?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  symbol: WeatherSymbol;
  updatedAt: string;
}

export interface LocationWeather {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
}

export interface LocationInfo {
  name: string;
  nameAl: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  elevation?: number;
  timezone: string;
  population?: number;
}

export interface WeatherAlert {
  id: string;
  type: "WARNING" | "WATCH" | "ADVISORY";
  title: string;
  description: string;
  severity: "EXTREME" | "SEVERE" | "MODERATE" | "MINOR";
  validFrom: string;
  validTo: string;
  area: string;
}

export interface SearchResult {
  id: string;
  name: string;
  nameAl: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  population?: number;
}

// ─── API Response Types (Yr/MET) ─────────────────────────────────────────────

export interface YrForecastResponse {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
  properties: {
    meta: {
      updated_at: string;
      units: Record<string, string>;
    };
    timeseries: YrTimeseries[];
  };
}

export interface YrTimeseries {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature?: number;
        wind_speed?: number;
        wind_from_direction?: number;
        relative_humidity?: number;
        air_pressure_at_sea_level?: number;
        dew_point_temperature?: number;
        cloud_area_fraction?: number;
        ultraviolet_index_clear_sky?: number;
      };
    };
    next_1_hours?: {
      summary: { symbol_code: string };
      details: { precipitation_amount?: number; probability_of_precipitation?: number };
    };
    next_6_hours?: {
      summary: { symbol_code: string };
      details: {
        air_temperature_max?: number;
        air_temperature_min?: number;
        precipitation_amount?: number;
        probability_of_precipitation?: number;
      };
    };
    next_12_hours?: {
      summary: { symbol_code: string };
    };
  };
}

// ─── MetAlerts GeoJSON (MET Norway) ──────────────────────────────────────────

export interface MetAlertsFeature {
  type: "Feature";
  geometry: { type: string; coordinates: any };
  properties: {
    id: string;
    title: string;
    description?: string;
    instruction?: string;
    awareness_level: string; // "1 white; Awareness", "2 green; Minor", "3 yellow; Moderate", "4 orange; Severe", "5 red; Extreme"
    awareness_type: string;  // "1; Wind", "2; snow-ice", etc.
    severity: string;        // "Minor" | "Moderate" | "Severe" | "Extreme"
    certainty: string;
    status: string;
    effective: string;
    expires: string;
    MunicipalityId?: string;
    county?: string;
    country?: string;
    resources?: { description: string; uri: string }[];
  };
}

export interface MetAlertsResponse {
  type: "FeatureCollection";
  features: MetAlertsFeature[];
}

// ─── App UI State ─────────────────────────────────────────────────────────────

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AppState {
  currentLocation: LocationInfo | null;
  weather: LocationWeather | null;
  loadingState: LoadingState;
  error: string | null;
  unit: "C" | "F";
  theme: "dark" | "light";
  recentSearches: SearchResult[];
}
