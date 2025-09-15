
<template>
  <div class="static-map">
    <NuxtImg ref="mapImage" :src="imageUrl" class="w-full h-auto" :alt="`Map centered at ${lat}, ${lon}`" @error="generateImage" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  lat: number | string
  lon: number | string
  zoom?: number
  width?: number
  height?: number
}>()

const mapImage = ref(null)

const imageUrl = ref(`/maps/${props.lat}_${props.lon}_${props.zoom ?? 9}_${props.width ?? 600}x${props.height ?? 400}.png`)

const generateImage = () => {
    console.log('Regenerating map image')
    $fetch(`/api/static-map?lat=${props.lat}&lon=${props.lon}&zoom=${props.zoom ?? 9}&width=${props.width ?? 600}&height=${props.height ?? 400}`, { responseType: 'arrayBuffer' })
    .then((data) => {
        if (typeof data === 'string') {
            console.error('Error fetching static map:', data)
            return            
        }

        if (data instanceof ArrayBuffer) {
            imageUrl.value = URL.createObjectURL(new Blob([data]))
            return
        }

        console.error('Unexpected data type from static map API:', typeof data)
    })

}
</script>

<style scoped>
.static-map {
  width: 100%;
  height: auto;
  background: #eee;
  border-radius: 8px;
  overflow: hidden;
}
</style>
