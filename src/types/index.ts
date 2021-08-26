export interface SafeExposureTime {
  st1: number;
  st2: number;
  st3: number;
  st4: number;
  st5: number;
  st6: number;
}

export interface SunTimes {
  solarNoon: Date;
  nadir: Date;
  sunrise: Date;
  sunset: Date;
  sunriseEnd: Date;
  sunsetStart: Date;
  dawn: Date;
  dusk: Date;
  nauticalDawn: Date;
  nauticalDusk: Date;
  nightEnd: Date;
  night: Date;
  goldenHourEnd: Date;
  goldenHour: Date;
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
  uv_time: Date;
  uv_max: number;
  uv_max_time: Date;
  ozone: number;
  ozone_time: Date;
  safe_exposure_time: SafeExposureTime;
  sun_info: SunInfo;
}

export interface UvResults {
  result: UvResult;
}