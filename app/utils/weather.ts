// Convert wind speed in m/s to Beaufort scale (0-12)
export function windSpeedToBeaufort(speed: number): number {
    if (speed < 0.3) return 0
    if (speed < 1.6) return 1
    if (speed < 3.4) return 2
    if (speed < 5.5) return 3
    if (speed < 8.0) return 4
    if (speed < 10.8) return 5
    if (speed < 13.9) return 6
    if (speed < 17.2) return 7
    if (speed < 20.8) return 8
    if (speed < 24.5) return 9
    if (speed < 28.5) return 10
    if (speed < 32.7) return 11
    return 12
}

// Convert wind direction in degrees to compass point (e.g., N, NE, E, ...)
export function windDirectionToCompass(degrees: number): string | undefined {
    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'
    ]
    const idx = Math.round(degrees / 22.5) % 16
    return directions[idx]
}

const WEATHER_ICON_MAP: Record<number, [string, string, string]> = {
  0: ["clear-day.svg", "clear-night.svg", "clear-day.svg"],
  1: ["cloudy-1-day.svg", "cloudy-1-night.svg", "cloudy-1.svg"],
  2: ["cloudy-2-day.svg", "cloudy-2-night.svg", "cloudy-2.svg"],
  3: ["cloudy-3-day.svg", "cloudy-3-night.svg", "cloudy-3.svg"],
  45: ["fog-day.svg", "fog-night.svg", "fog.svg"],
  48: ["frost-day.svg", "frost-night.svg", "frost.svg"],
  51: ["rainy-1-day.svg", "rainy-1-night.svg", "rainy-1.svg"],
  53: ["rainy-2-day.svg", "rainy-2-night.svg", "rainy-2.svg"],
  55: ["rainy-3-day.svg", "rainy-3-night.svg", "rainy-3.svg"],
  56: ["rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg"],
  57: ["rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg"],
  61: ["rainy-1-day.svg", "rainy-1-night.svg", "rainy-1.svg"],
  63: ["rainy-2-day.svg", "rainy-2-night.svg", "rainy-2.svg"],
  65: ["rainy-3-day.svg", "rainy-3-night.svg", "rainy-3.svg"],
  66: ["rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg"],
  67: ["rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg", "rain-and-sleet-mix.svg"],
  71: ["snowy-1-day.svg", "snowy-1-night.svg", "snowy-1.svg"],
  73: ["snowy-2-day.svg", "snowy-2-night.svg", "snowy-2.svg"],
  75: ["snowy-3-day.svg", "snowy-3-night.svg", "snowy-3.svg"],
  77: ["snowy-1-day.svg", "snowy-1-night.svg", "snowy-1.svg"],
  80: ["rainy-1-day.svg", "rainy-1-night.svg", "rainy-1.svg"],
  81: ["rainy-2-day.svg", "rainy-2-night.svg", "rainy-2.svg"],
  82: ["rainy-3-day.svg", "rainy-3-night.svg", "rainy-3.svg"],
  85: ["snowy-1-day.svg", "snowy-1-night.svg", "snowy-1.svg"],
  86: ["snowy-2-day.svg", "snowy-2-night.svg", "snowy-2.svg"],
  95: ["isolated-thunderstorms-day.svg", "isolated-thunderstorms-night.svg", "isolated-thunderstorms.svg"],
  96: ["severe-thunderstorm.svg", "severe-thunderstorm.svg", "severe-thunderstorm.svg"],
  99: ["severe-thunderstorm.svg", "severe-thunderstorm.svg", "severe-thunderstorm.svg"],
};
const DEFAULT_ICON = "cloudy.svg";

export function getWeatherIcon(weatherCode: number, isDay?: boolean | number): string {
  const icons = WEATHER_ICON_MAP[weatherCode];
  if (!icons) return DEFAULT_ICON;
  if (isDay === undefined || isDay === null) return icons[2];
  if (isDay === 1 || isDay === true) return icons[0];
  if (isDay === 0 || isDay === false) return icons[1];
  return icons[2];
}