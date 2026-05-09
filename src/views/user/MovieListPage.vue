<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import { useDebounceFn } from '@vueuse/core'
import MovieCard from '@/components/common/MovieCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import type { MovieCardData } from '@/types/movie'

const router = useRouter()
const route = useRoute()
const movieStore = useMovieStore()

const movies = ref<MovieCardData[]>([])
const total = ref(0)
const loading = ref(false)

const keyword = ref((route.query.keyword as string) || '')
const activeGenre = ref((route.query.genre as string) || '全部')
const sortBy = ref<'hot' | 'rating' | 'time'>((route.query.sortBy as any) || 'hot')
const page = ref(Number(route.query.page) || 1)
const pageSize = 12

const genres = ['全部', '动作', '喜剧', '科幻', '悬疑', '爱情', '动画', '纪录片', '恐怖']

const genreIdMap: Record<string, number | undefined> = {
  '全部': undefined, '动作': 1, '喜剧': 2, '科幻': 3, '悬疑': 4, '爱情': 5, '动画': 6, '纪录片': 7, '恐怖': 8
}

const sortOptions = [
  { label: '热门', value: 'hot' as const },
  { label: '评分', value: 'rating' as const },
  { label: '最新', value: 'time' as const }
]

async function loadMovies() {
  loading.value = true
  try {
    const res = await movieStore.fetchMovies({
      page: page.value,
      size: pageSize,
      keyword: keyword.value || undefined,
      genreId: genreIdMap[activeGenre.value],
      sortBy: sortBy.value
    })
    movies.value = res.records
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const debouncedLoad = useDebounceFn(loadMovies, 300)

function updateQuery() {
  const query: Record<string, string> = {}
  if (keyword.value) query.keyword = keyword.value
  if (activeGenre.value !== '全部') query.genre = activeGenre.value
  if (sortBy.value !== 'hot') query.sortBy = sortBy.value
  if (page.value > 1) query.page = String(page.value)
  router.replace({ query })
}

watch(keyword, () => { page.value = 1; updateQuery(); debouncedLoad() })
watch(activeGenre, () => { page.value = 1; updateQuery(); debouncedLoad() })
watch(sortBy, () => { page.value = 1; updateQuery(); debouncedLoad() })
watch(page, () => { updateQuery(); loadMovies() })

onMounted(() => { loadMovies() })

function goToMovie(id: number) {
  router.push({ name: 'MovieDetail', params: { id } })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-8">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          v-for="genre in genres"
          :key="genre"
          class="px-4 py-1.5 text-xs whitespace-nowrap cursor-pointer rounded-sm border transition-all duration-200 font-medium"
          :class="activeGenre === genre
            ? 'bg-[#18181B] text-white border-[#18181B]'
            : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]'"
          @click="activeGenre = genre"
        >
          {{ genre }}
        </button>
      </div>
      <div class="flex border border-[#E4E4E7] rounded-sm overflow-hidden ml-auto">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          class="px-4 py-1.5 text-xs cursor-pointer transition-colors duration-150"
          :class="sortBy === opt.value
            ? 'bg-[#18181B] text-white font-medium'
            : 'text-[#52525B] hover:bg-[#F4F4F5]'"
          @click="sortBy = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Movie Grid -->
    <div v-if="loading" class="text-center py-20 text-sm text-[#A1A1AA]">加载中...</div>

    <template v-else>
      <div v-if="movies.length === 0" class="text-center py-20 text-sm text-[#A1A1AA]">
        暂无电影
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-10">
        <MovieCard
          v-for="movie in movies"
          :key="movie.movieId"
          v-bind="movie"
          @click="goToMovie(movie.movieId)"
        />
      </div>
    </template>

    <div class="flex justify-center">
      <Pagination :current="page" :total="total" :page-size="pageSize" @change="page = $event" />
    </div>
  </div>
</template>
