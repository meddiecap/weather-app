import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia, storeToRefs } from 'pinia'
import { useLocationsStore } from '../../stores/locations'
import type { Location } from '../../stores/locations'
import type { Ref } from 'vue'

describe('locations store', () => {
  let store: ReturnType<typeof useLocationsStore>
  let locations: Ref<Location[]>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLocationsStore()
    const { locations: locs } = storeToRefs(store)
    locations = locs
  })

  it('adds a new location with count 1 and date_added', () => {
    store.addOrUpdate({ name: 'Berlin', latitude: 1, longitude: 2 })
    expect(locations.value.length).toBe(1)
    expect(locations.value[0].count).toBe(1)
    expect(typeof locations.value[0].date_added).toBe('number')
  })

  it('increments count for existing location', () => {
    store.addOrUpdate({ name: 'Berlin', latitude: 1, longitude: 2 })
    store.addOrUpdate({ name: 'Berlin', latitude: 1, longitude: 2 })
    expect(locations.value[0].count).toBe(2)
  })

  it('does not exceed 10 locations and removes least popular/oldest', () => {
    for (let i = 0; i < 10; i++) {
      store.addOrUpdate({ name: `Loc${i}`, latitude: i, longitude: i })
    }
    // Add more locations to increase count except Loc0. 
    // This will ensure Loc0 is the least popular
    for (let i = 1; i < 10; i++) {
      store.addOrUpdate({ name: `Loc${i}`, latitude: i, longitude: i })
    }
    
    // Add a new location
    store.addOrUpdate({ name: 'NewLoc', latitude: 99, longitude: 99 })
    expect(locations.value.length).toBe(10)
    expect(locations.value.some(l => l.name === 'NewLoc')).toBe(true)
    // The oldest/least popular should be gone
    expect(locations.value.some(l => l.name === 'Loc0')).toBe(false)
  })

  it('sorts by count and date_added', () => {
    store.addOrUpdate({ name: 'A', latitude: 1, longitude: 1 })
    store.addOrUpdate({ name: 'B', latitude: 2, longitude: 2 })
    store.addOrUpdate({ name: 'A', latitude: 1, longitude: 1 })
    // A should be first (count 2), B second (count 1)
    expect(locations.value[0].name).toBe('A')
    expect(locations.value[1].name).toBe('B')
  })

  it('removes a location by name/lat/lon', () => {
    store.addOrUpdate({ name: 'A', latitude: 1, longitude: 1 })
    store.addOrUpdate({ name: 'B', latitude: 2, longitude: 2 })
    store.remove({ name: 'A', latitude: 1, longitude: 1 })
    expect(locations.value.length).toBe(1)
    expect(locations.value[0].name).toBe('B')
  })
})
