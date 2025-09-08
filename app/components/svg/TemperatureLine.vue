<template>
    <svg viewBox="0 0 100 100" height="72" preserveAspectRatio="none">
        <path :d="`M0,${tempToY(from)} L100,${tempToY(to)} L100,100 L0,100 Z`" fill="#F79C9F"
            style="opacity:.2" />

        <line :x1="0" :y1="tempToY(from)" :x2="100" :y2="tempToY(to)"
            style="stroke: #ED2329;stroke-width: 5;" />

        <circle :cx="circleX" :cy="tempToY(circlY)" r="8" stroke-width="0" fill="#ED2329" />
    </svg>
</template>

<script setup lang="ts">

const props = defineProps<{
    circleX?: number,
    minTemp: number,
    maxTemp: number,
    startTemp: number,
    endTemp: number,
}>()

const from = computed(() => {
    if (props.circleX === 0) return props.startTemp
    return (props.startTemp + props.endTemp) / 2
})

const to = computed(() => {
    if (props.circleX === 100) return props.endTemp
    return (props.startTemp + props.endTemp) / 2
})

const circlY = computed(() => {
    if (props.circleX === 0) return props.startTemp
    return props.endTemp
})

const tempToY = (temp: number): number => {
    if (props.maxTemp === props.minTemp) return 50
    return 10 + (100 - 20) * (1 - (temp - props.minTemp) / (props.maxTemp - props.minTemp))
}
</script>