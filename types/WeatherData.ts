export interface CurrentWeather {
    // temperature_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,apparent_temperature,precipitation
    temperature_2m: number; // Current temperature at 2 meters above ground
    is_day: number; // 1 if it's day, 0 if it's night
    weather_code: number; // Weather condition code
    wind_speed_10m: number; // Wind speed at 10 meters above ground in km/h
    wind_direction_10m: number; // Wind direction at 10 meters above ground in degrees
    pressure_msl: number; // Atmospheric pressure at mean sea level in hPa
    cloud_cover: number; // Cloud cover percentage
    apparent_temperature: number; // Apparent temperature (feels like) at 2 meters above ground
    precipitation: number; // Precipitation amount in mm
}

export interface HourlyWeather {
    // temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day
    temperature_2m: number[]; // Temperature at 2 meters above ground
    weather_code: number[]; // Weather condition codes
    wind_speed_10m: number[]; // Wind speed at 10 meters above ground in km/h
    wind_direction_10m: number[]; // Wind direction at 10 meters above ground in degrees
    is_day: number[]; // 1 if it's day, 0 if it's night
    time: string[]; // Timestamps for each hourly data point in ISO 8601 format
}