<template>
    <div class="card bg-base-100 card-md shadow-sm">
        <div class="card-body">
            <h2 class="card-title">{{ title }}</h2>
            <slot name="content"></slot>
            <slot class="mt-6" name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    title?: string
}>()
</script>
