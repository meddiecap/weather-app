import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia, storeToRefs } from 'pinia'
import { useLocationsStore } from '../../stores/locations'
import type { Location } from '../../types/Location'
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
    store.addOrUpdate({ name: 'Berlin', lat: 1, lon: 2 })
    expect(locations.value.length).toBe(1)
    expect(locations.value[0].count).toBe(1)
    expect(typeof locations.value[0].date_added).toBe('number')
  })

  it('increments count for existing location', () => {
    store.addOrUpdate({ name: 'Berlin', lat: 1, lon: 2 })
    store.addOrUpdate({ name: 'Berlin', lat: 1, lon: 2 })
    expect(locations.value[0].count).toBe(2)
  })

  it('does not exceed 10 locations and removes least popular/oldest', () => {
    for (let i = 0; i < 10; i++) {
      store.addOrUpdate({ name: `Loc${i}`, lat: i, lon: i })
    }
    // Add more locations to increase count except Loc0. 
    // This will ensure Loc0 is the least popular
    for (let i = 1; i < 10; i++) {
      store.addOrUpdate({ name: `Loc${i}`, lat: i, lon: i })
    }
    
    // Add a new location
    store.addOrUpdate({ name: 'NewLoc', lat: 99, lon: 99 })
    expect(locations.value.length).toBe(10)
    expect(locations.value.some(l => l.name === 'NewLoc')).toBe(true)
    // The oldest/least popular should be gone
    expect(locations.value.some(l => l.name === 'Loc0')).toBe(false)
  })

  it('sorts by count and date_added', () => {
    store.addOrUpdate({ name: 'A', lat: 1, lon: 1 })
    store.addOrUpdate({ name: 'B', lat: 2, lon: 2 })
    store.addOrUpdate({ name: 'A', lat: 1, lon: 1 })
    // A should be first (count 2), B second (count 1)
    expect(locations.value[0].name).toBe('A')
    expect(locations.value[1].name).toBe('B')
  })

  it('removes a location by name/lat/lon', () => {
    store.addOrUpdate({ id: 1, name: 'A', lat: 1, lon: 1 })
    store.addOrUpdate({ id: 2, name: 'B', lat: 2, lon: 2 })    
    const locToRemove = locations.value.find(
      l => l.name === 'A' && l.lat === 1 && l.lon === 1
    )
    if (locToRemove) {
      store.remove(locToRemove.id)
    }
    expect(locations.value.length).toBe(1)
    expect(locations.value[0].name).toBe('B')
  })
})
