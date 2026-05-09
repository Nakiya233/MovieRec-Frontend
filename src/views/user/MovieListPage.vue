<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
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
const selectedGenres = reactive<Set<string>>(new Set())
const sortBy = ref<'hot' | 'rating' | 'time'>((route.query.sortBy as any) || 'hot')
const page = ref(Number(route.query.page) || 1)
const pageSize = 12

const genres = ['动作', '喜剧', '科幻', '悬疑', '爱情', '动画', '纪录', '恐怖', '剧情', '惊悚', '犯罪', '奇幻', '冒险', '家庭', '战争', '历史', '音乐', '西部']

const genreIdMap: Record<string, number> = {
  '动作': 28, '喜剧': 35, '科幻': 878, '悬疑': 9648, '爱情': 10749, '动画': 16, '纪录': 99, '恐怖': 27, '剧情': 18, '惊悚': 53, '犯罪': 80, '奇幻': 14, '冒险': 12, '家庭': 10751, '战争': 10752, '历史': 36, '音乐': 10402, '西部': 37
}

const sortOptions = [
  { label: '热门', value: 'hot' as const },
  { label: '评分', value: 'rating' as const },
  { label: '最新', value: 'time' as const }
]

const selectedGenreNames = ref((route.query.genres as string) || '')

function syncGenresFromQuery() {
  selectedGenres.clear()
  if (selectedGenreNames.value) {
    selectedGenreNames.value.split(',').forEach(g => {
      if (g && genreIdMap[g]) selectedGenres.add(g)
    })
  }
}

syncGenresFromQuery()

async function loadMovies() {
  loading.value = true
  try {
    const ids = [...selectedGenres].map(g => genreIdMap[g]).join(',')
    const res = await movieStore.fetchMovies({
      page: page.value,
      size: pageSize,
      keyword: keyword.value || undefined,
      genreIds: ids || undefined,
      sortBy: sortBy.value,
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
  if (selectedGenres.size > 0) query.genres = [...selectedGenres].join(',')
  if (sortBy.value !== 'hot') query.sortBy = sortBy.value
  if (page.value > 1) query.page = String(page.value)
  router.replace({ query })
}

function toggleGenre(genre: string) {
  if (selectedGenres.has(genre)) {
    selectedGenres.delete(genre)
  } else {
    selectedGenres.add(genre)
  }
  page.value = 1; updateQuery(); debouncedLoad()
}

watch(() => route.query.keyword, (val) => {
  keyword.value = (val as string) || ''
  page.value = 1; updateQuery(); debouncedLoad()
})
watch(() => route.query.genres, (val) => {
  selectedGenreNames.value = (val as string) || ''
  syncGenresFromQuery()
  page.value = 1; updateQuery(); debouncedLoad()
})
watch(sortBy, () => { page.value = 1; updateQuery(); debouncedLoad() })
watch(page, () => { updateQuery(); loadMovies() })

onMounted(() => { loadMovies() })

function goToMovie(id: number) {
  router.push({ name: 'MovieDetail', params: { id } })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="flex gap-10">
      <!-- Left Sidebar - Genre Filters -->
      <aside class="w-40 flex-shrink-0">
        <h3 class="text-sm font-semibold text-[#09090B] mb-4">电影类型</h3>
        <div class="flex flex-col gap-1">
          <label
            v-for="genre in genres"
            :key="genre"
            class="flex items-center gap-2.5 px-2 py-1.5 rounded-sm cursor-pointer transition-colors duration-150 hover:bg-[#F4F4F5]"
            :class="selectedGenres.has(genre) ? 'text-[#09090B]' : 'text-[#52525B]'"
            @click="toggleGenre(genre)"
          >
            <span class="relative flex items-center justify-center w-3.5 h-3.5 rounded-sm border transition-colors duration-150"
              :class="selectedGenres.has(genre) ? 'bg-[#18181B] border-[#18181B]' : 'border-[#D4D4D8]'">
              <svg v-if="selectedGenres.has(genre)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span class="text-sm">{{ genre }}</span>
          </label>
        </div>
      </aside>

      <!-- Right Content -->
      <div class="flex-1 min-w-0">
        <!-- Sort -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-sm text-[#A1A1AA]">共 {{ total }} 部</p>
          <div class="flex border border-[#E4E4E7] rounded-sm overflow-hidden">
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
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
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
    </div>
  </div>
</template>
