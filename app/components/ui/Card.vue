<template>
    <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
            <h2 v-if="title" class="card-title">{{ title }}</h2>
            <slot name="content" />
            <slot class="mt-6" name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>
