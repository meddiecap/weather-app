import { describe, it, expect } from 'vitest'
import { windSpeedToBeaufort, windDirectionToCompass, getWeatherIcon } from '../../app/utils/weather'

describe('windSpeedToBeaufort', () => {
  it('returns correct Beaufort scale for various speeds', () => {
    expect(windSpeedToBeaufort(0)).toBe(0)
    expect(windSpeedToBeaufort(0.5)).toBe(1)
    expect(windSpeedToBeaufort(2)).toBe(2)
    expect(windSpeedToBeaufort(4)).toBe(3)
    expect(windSpeedToBeaufort(7)).toBe(4)
    expect(windSpeedToBeaufort(10)).toBe(5)
    expect(windSpeedToBeaufort(12)).toBe(6)
    expect(windSpeedToBeaufort(16)).toBe(7)
    expect(windSpeedToBeaufort(20)).toBe(8)
    expect(windSpeedToBeaufort(23)).toBe(9)
    expect(windSpeedToBeaufort(27)).toBe(10)
    expect(windSpeedToBeaufort(30)).toBe(11)
    expect(windSpeedToBeaufort(40)).toBe(12)
  })
})

describe('windDirectionToCompass', () => {
  it('returns correct compass direction for degrees', () => {
    expect(windDirectionToCompass(0)).toBe('N')
    expect(windDirectionToCompass(45)).toBe('NE')
    expect(windDirectionToCompass(90)).toBe('E')
    expect(windDirectionToCompass(135)).toBe('SE')
    expect(windDirectionToCompass(180)).toBe('S')
    expect(windDirectionToCompass(225)).toBe('SW')
    expect(windDirectionToCompass(270)).toBe('W')
    expect(windDirectionToCompass(315)).toBe('NW')
    expect(windDirectionToCompass(360)).toBe('N')
  })
})

describe('getWeatherIcon', () => {
  it('returns correct icon for known weather codes and day/night', () => {
    expect(getWeatherIcon(0, true)).toBe('clear-day.svg')
    expect(getWeatherIcon(0, false)).toBe('clear-night.svg')
    expect(getWeatherIcon(0, undefined)).toBe('clear-day.svg')
    expect(getWeatherIcon(1, true)).toBe('cloudy-1-day.svg')
    expect(getWeatherIcon(1, false)).toBe('cloudy-1-night.svg')
    expect(getWeatherIcon(1, undefined)).toBe('cloudy-1.svg')
  })

  it('returns default icon for unknown weather codes', () => {
    expect(getWeatherIcon(999)).toBe('cloudy.svg')
  })
})
