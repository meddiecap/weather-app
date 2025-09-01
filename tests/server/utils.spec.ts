import { describe, it, expect } from 'vitest'
import { makeSearchKey, makeForecastKey, assertName, assertCoords } from '../../server/utils/route-helpers'


describe('route-helpers', () => {
    it('builds stable search cache key', () => {
        expect(makeSearchKey({ name: ' Berlin ', language: 'en', count: 7 })).toBe('search::name=berlin|language=en|count=7')
    })


    it('builds stable forecast cache key', () => {
        expect(
            makeForecastKey({ lat: 52.52, lon: 13.405, hourly: 'temperature_2m,precipitation' })
        ).toBe('forecast::lat=52.52|lon=13.405|hourly=temperature_2m,precipitation')
    })


    it('assertName fails on short input', () => {
        expect(() => assertName('ab')).toThrowError(/min length 3/i)
    })


    it('assertCoords fails on missing', () => {
        expect(() => assertCoords(undefined, 4)).toThrowError(/lat/i)
    })
})