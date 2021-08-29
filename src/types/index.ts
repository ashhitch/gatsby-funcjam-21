export interface SafeExposureTime {
  st1: number;
  st2: number;
  st3: number;
  st4: number;
  st5: number;
  st6: number;
}

export interface SunTimes {
  solarNoon: string;
  nadir: string;
  sunrise: string;
  sunset: string;
  sunriseEnd: string;
  sunsetStart: string;
  dawn: string;
  dusk: string;
  nauticalDawn: string;
  nauticalDusk: string;
  nightEnd: string;
  night: string;
  goldenHourEnd: string;
  goldenHour: string;
}

export interface SunPosition {
  azimuth: number;
  altitude: number;
}

export interface SunInfo {
  sun_times: SunTimes;
  sun_position: SunPosition;
}

export interface UvResult {
  uv: number;
  uv_time: string;
  uv_max: number;
  uv_max_time: string;
  ozone: number;
  ozone_time: string;
  safe_exposure_time: SafeExposureTime;
  sun_info: SunInfo;
}

export interface UvResults {
  result: UvResult;
}
