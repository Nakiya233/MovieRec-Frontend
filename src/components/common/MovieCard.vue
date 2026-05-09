<script setup lang="ts">
import PosterImage from './PosterImage.vue'
import { formatRating } from '@/utils/format'

withDefaults(defineProps<{
  movieId: number
  title: string
  posterUrl?: string | null
  avgRating?: number
  ratingCount?: number
  genres?: string[]
  rankNo?: number
  recommendReason?: string | null
}>(), {
  posterUrl: null,
  avgRating: 0,
  ratingCount: 0,
  genres: () => [],
})

const emit = defineEmits<{
  click: [movieId: number]
}>()
</script>

<template>
  <div class="movie-card group" @click="emit('click', movieId)">
    <div class="relative">
      <PosterImage :src="posterUrl" :alt="title" />
      <div
        v-if="rankNo"
        class="absolute top-2 left-2 bg-[#18181B] text-white text-xs font-bold px-2 py-0.5 rounded-sm"
      >
        {{ rankNo }}
      </div>
      <div
        class="absolute top-2 right-2 bg-[#18181B] text-white text-xs font-bold px-2 py-0.5 rounded-sm"
      >
        {{ formatRating(avgRating) }}
      </div>
    </div>
    <div class="p-3 border-t border-[#E4E4E7]">
      <h3 class="text-sm font-medium truncate">{{ title }}</h3>
      <div class="flex items-center gap-1.5 mt-1">
        <span
          v-for="genre in genres.slice(0, 2)"
          :key="genre"
          class="text-[10px] text-[#A1A1AA] bg-[#FAFAFA] px-1.5 py-0.5 rounded-sm border border-[#E4E4E7]"
        >
          {{ genre }}
        </span>
        <span class="text-[10px] text-[#A1A1AA]">{{ ratingCount }} 人评分</span>
      </div>
      <p v-if="recommendReason" class="text-[10px] text-[#52525B] mt-1.5 leading-relaxed">
        {{ recommendReason }}
      </p>
    </div>
  </div>
</template>
