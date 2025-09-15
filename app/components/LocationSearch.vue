<template>
    <div class="location-search w-72">
        <div class="input-wrapper">
            <Icon v-if="loading" name="uil:spinner" class="search-icon animate-spin" />
            <Icon v-else name="uil:search" class="search-icon" />
            <input 
                v-model="search" type="search" class="input input-bordered w-full pl-10"
                placeholder="Search a city or location..." @focus="showDropdown = true" @click="showDropdown = true"
                @blur="onBlur" @keydown.down.prevent="moveSelection(1)" @keydown.up.prevent="moveSelection(-1)"
                @keydown.enter.prevent="selectHighlighted">
        </div>

        <ul v-if="showDropdown && (results.length || locations.length)" class="dropdown-list">

            <li 
                v-for="(result, idx) in results" :key="result.id"
                :class="{ highlighted: idx === highlighted }" @mousedown.prevent="selectResult(result)">
                {{ result.name }}<span v-if="result.country">, {{ result.country }}</span>
            </li>

            <li v-if="locations.length && !results.length">
                <div class="px-4 py-2 block border-b border-gray-200 text-gray-500">Saved Locations</div>
                <ul>
                    <li 
                        v-for="(location) in locations" :key="location.id"
                        class="flex items-center justify-between "
                       >
                        <div @mousedown.prevent="selectResult(location)">{{ location.name }}<span v-if="location.country">, {{ location.country }}</span></div>
                        <button 
                            class="ml-2 btn btn-xs btn-soft btn-error" aria-label="Remove from popular locations"
                            @click.prevent="locationsStore.remove(location.id)">
                            <Icon name="uil:times" />
                        </button>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocationsStore } from '../../stores/locations'
import type { Location } from '~~/types/Location'

const search = ref('')
const results = ref<Array<Location>>([])
const loading = ref(false)
const showDropdown = ref(false)
const highlighted = ref(-1)

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)

const emit = defineEmits<{
    (e: 'select', location: Location): void
}>()

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(search, (val) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)

    if (!val) {
        results.value = []
        loading.value = false
        return
    }
    loading.value = true
    debounceTimeout = setTimeout(async () => {
        try {
            const res = await $fetch('/api/search', { query: { name: val } })
            results.value = res.results || []
        } catch {
            results.value = []
        } finally {
            loading.value = false
        }
    }, 350)
})

const selectResult = (result: typeof results.value[0]) => {
    useLocationsStore().addOrUpdate(result)

    showDropdown.value = false
    highlighted.value = -1

    emit('select', result)
}

const onBlur = () => {
    setTimeout(() => (showDropdown.value = false), 100)
}

const moveSelection = (dir: 1 | -1) => {
    if (!results.value.length) return
    highlighted.value = (highlighted.value + dir + results.value.length) % results.value.length
}

const selectHighlighted = () => {
    if (highlighted.value >= 0 && highlighted.value < results.value.length) {
        const result = results.value[highlighted.value]
        if (result) selectResult(result)
    }
}
</script>

<style scoped>
.location-search {
    position: relative;
}

.input-wrapper {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 0.75em;
    top: 0.71em;
    width: 1.2em;
    height: 1.2em;
    color: #888;
    pointer-events: none;
    z-index: 2;
}

.input {
    width: 100%;
    box-sizing: border-box;
}

.dropdown-list {
    position: absolute;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    z-index: 10;
    max-height: 220px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
}

.dropdown-list li:not(:has(ul)) {
    padding: 0.5em 1em;
    cursor: pointer;
}

.dropdown-list li.highlighted {
    background: #f0f0f0;
}

.loading {
    margin-top: 0.5em;
    color: #888;
}
</style>
