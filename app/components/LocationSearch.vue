<template>
    <div class="location-search">
        <div class="input-wrapper">
            <Icon name="uil:search" class="search-icon" />
            <input v-model="search" type="search" class="input input-bordered w-full pl-10"
                placeholder="Search for a city or location..."
                @focus="showDropdown = true"
                @click="showDropdown = true"
                @blur="onBlur"
                @keydown.down.prevent="moveSelection(1)"
                @keydown.up.prevent="moveSelection(-1)"
                @keydown.enter.prevent="selectHighlighted" />
        </div>

        <ul v-if="showDropdown && results.length" class="dropdown-list">
            <li v-for="(result, idx) in results" :key="result.id || result.name + result.latitude + result.longitude"
                :class="{ highlighted: idx === highlighted }" @mousedown.prevent="selectResult(result)">
                {{ result.name }}<span v-if="result.country">, {{ result.country }}</span>
            </li>
        </ul>
        <div v-if="loading" class="loading">Searching...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const search = ref('')
const results = ref<Array<{ name: string; country?: string; latitude: number; longitude: number; id?: string }>>([])
const loading = ref(false)
const showDropdown = ref(false)
const highlighted = ref(-1)

const emit = defineEmits<{
    (e: 'select', location: { name: string; latitude: number; longitude: number; country?: string }): void
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
    emit('select', result)
    showDropdown.value = false
    highlighted.value = -1
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
    width: 100%;
}

.input-wrapper {
    position: relative;
    width: 100%;
}
.search-icon {
    position: absolute;
    left: 0.75em;
    top: 50%;
    transform: translateY(-50%);
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

.dropdown-list li {
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
