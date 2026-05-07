<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  current: number
  total: number
  pageSize?: number
}>(), {
  pageSize: 12
})

const emit = defineEmits<{
  change: [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 1)

const pages = computed(() => {
  const p: (number | string)[] = []
  const tp = totalPages.value
  const curr = props.current

  if (tp <= 7) {
    for (let i = 1; i <= tp; i++) p.push(i)
  } else {
    p.push(1)
    if (curr > 3) p.push('...')
    for (let i = Math.max(2, curr - 1); i <= Math.min(tp - 1, curr + 1); i++) {
      p.push(i)
    }
    if (curr < tp - 2) p.push('...')
    p.push(tp)
  }
  return p
})

function go(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.current) {
    emit('change', page)
  }
}
</script>

<template>
  <div class="flex items-center gap-1" v-if="totalPages > 1">
    <button
      class="pagination-btn"
      :disabled="current <= 1"
      @click="go(current - 1)"
    >
      &larr;
    </button>
    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="w-7 h-7 flex items-center justify-center text-xs text-[#A1A1AA]">...</span>
      <button
        v-else
        class="pagination-btn"
        :class="{ active: p === current }"
        @click="go(p as number)"
      >
        {{ p }}
      </button>
    </template>
    <button
      class="pagination-btn"
      :disabled="current >= totalPages"
      @click="go(current + 1)"
    >
      &rarr;
    </button>
  </div>
</template>
