<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  readonly?: boolean
  size?: 'small' | 'normal'
}>(), {
  readonly: false,
  size: 'normal'
})

const emit = defineEmits<{
  'update:modelValue': [score: number]
}>()

const starClass = computed(() => props.size === 'small' ? 'w-3.5 h-3.5' : 'w-5 h-5')

function setRating(star: number) {
  if (props.readonly) return
  emit('update:modelValue', star)
}
</script>

<template>
  <div class="star-rating" :class="{ readonly }">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :class="[starClass, 'transition-colors duration-150']"
      :style="{ color: star <= modelValue ? '#18181B' : '#E4E4E7' }"
      :disabled="readonly"
      @click="setRating(star)"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
button:disabled {
  cursor: default;
}
</style>
