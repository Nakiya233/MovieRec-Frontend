<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string | null
  alt: string
  fallback?: string
}>(), {
  fallback: '/assets/posters/default-movie.png'
})

const imgSrc = ref<string>(props.src || props.fallback)
const hasError = ref(false)

function onError() {
  if (!hasError.value) {
    hasError.value = true
    imgSrc.value = props.fallback
  }
}
</script>

<template>
  <div class="aspect-[2/3] bg-[#F4F4F5] relative overflow-hidden rounded-sm">
    <img
      :src="imgSrc"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="onError"
    />
  </div>
</template>
