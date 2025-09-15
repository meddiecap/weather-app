<script setup lang="ts">
import Card from '~/components/ui/Card.vue';

const route = useRoute()
const { data, error } = await useFetch(`/api/location/${route.params['location']}`)

</script>

<template>
<div class="min-h-screen text-slate-900 dark:text-slate-100">
    <div class="container grid gap-6 lg:grid-cols-3">

      <!-- Card of 2 columns wide -->
      <Card class="col-span-2">
        <template #content>
          {{  data }}          
          <h2 class="card-title">Your location</h2>
          <div class="text-xs text-gray-500 flex-grow-0 mb-4">
            Location: ({{ data?.lat }}, {{ data?.lon }})
          </div>

          <!-- Current weather -->
        </template>
      </Card> 
    </div>
  </div>
</template>