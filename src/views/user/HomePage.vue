<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import MovieCard from '@/components/common/MovieCard.vue'
import type { MovieCardData } from '@/types/movie'

const router = useRouter()
const movieStore = useMovieStore()

const hotMovies = ref<MovieCardData[]>([])
const loading = ref(true)
const searchKeyword = ref('')

const genres = ['全部', '动作', '喜剧', '科幻', '悬疑', '爱情', '动画', '纪录片', '恐怖']
const activeGenre = ref('全部')

onMounted(async () => {
  try {
    hotMovies.value = await movieStore.fetchHotMovies()
  } finally {
    loading.value = false
  }
})

function goToMovie(id: number) {
  router.push({ name: 'MovieDetail', params: { id } })
}

function goToSearch() {
  const kw = searchKeyword.value.trim()
  if (kw) {
    router.push({ name: 'MovieList', query: { keyword: kw } })
  }
}

function selectGenre(genre: string) {
  activeGenre.value = genre
  if (genre === '全部') {
    router.push({ name: 'MovieList' })
  } else {
    router.push({ name: 'MovieList', query: { genre: genre } })
  }
}
</script>

<template>
  <div class="font-body text-[#09090B]">
    <!-- Hero -->
    <section class="bg-[#FAFAFA] border-b border-[#E4E4E7]">
      <div class="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-xs font-semibold px-2.5 py-1 bg-[#18181B] text-white rounded-sm">热门推荐</span>
            <span class="text-sm text-[#A1A1AA]">发现你的下一部最爱</span>
          </div>
          <h1 class="font-heading text-5xl md:text-7xl font-bold leading-none tracking-tight mb-6">
            MovieRec
          </h1>
          <p class="text-base text-[#52525B] leading-relaxed mb-8 max-w-lg">
            基于 AI 算法的智能电影推荐系统。浏览、评分、发现 —— 你的个人影院从这里开始。
          </p>
          <div class="flex items-center gap-4">
            <button class="btn-primary" @click="router.push({ name: 'MovieList' })">
              立即探索
            </button>
            <button class="btn-outline" @click="router.push({ name: 'Recommend' })">
              查看推荐
            </button>
          </div>

          <div class="flex gap-10 mt-12" v-if="!loading && hotMovies.length > 0">
            <div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                <span class="font-heading font-bold text-2xl">{{ hotMovies[0]?.avgRating.toFixed(1) }}</span>
              </div>
              <p class="text-xs text-[#A1A1AA] mt-1">最高评分</p>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-heading font-bold text-2xl">{{ hotMovies.length }}</span>
              </div>
              <p class="text-xs text-[#A1A1AA] mt-1">热门影片</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Genre Pills -->
    <div class="border-b border-[#E4E4E7]">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="genre in genres"
            :key="genre"
            class="px-4 py-1.5 text-sm whitespace-nowrap cursor-pointer rounded-sm border transition-all duration-200 font-medium"
            :class="activeGenre === genre
              ? 'bg-[#18181B] text-white border-[#18181B]'
              : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]'"
            @click="selectGenre(genre)"
          >
            {{ genre }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-16 space-y-20">
      <!-- 为你推荐 -->
      <section>
        <div class="flex items-end justify-between mb-8">
          <div>
            <h2 class="font-heading text-2xl font-semibold tracking-tight mb-1">热门推荐</h2>
            <p class="text-sm text-[#A1A1AA]">本周最受好评的影片</p>
          </div>
          <a href="#" class="text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors duration-150 cursor-pointer" @click.prevent="router.push({ name: 'MovieList', query: { sortBy: 'hot' } })">
            查看全部 &rarr;
          </a>
        </div>

        <div v-if="loading" class="text-center py-20 text-sm text-[#A1A1AA]">加载中...</div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          <MovieCard
            v-for="(movie, idx) in hotMovies"
            :key="movie.movieId"
            v-bind="movie"
            :rank-no="idx + 1"
            @click="goToMovie(movie.movieId)"
          />
        </div>
      </section>

      <!-- 热门排行 -->
      <section v-if="!loading && hotMovies.length > 0">
        <div class="flex items-end justify-between mb-8">
          <div>
            <h2 class="font-heading text-2xl font-semibold tracking-tight mb-1">热门排行</h2>
            <p class="text-sm text-[#A1A1AA]">本周最受好评的影片</p>
          </div>
          <a href="#" class="text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors duration-150 cursor-pointer" @click.prevent="router.push({ name: 'MovieList', query: { sortBy: 'rating' } })">
            查看全部 &rarr;
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          <div
            v-for="(movie, idx) in hotMovies.slice(0, 4)"
            :key="movie.movieId"
            class="flex items-center gap-5 p-5 bg-white border border-[#E4E4E7] hover:border-[#18181B] transition-colors duration-200 cursor-pointer"
            @click="goToMovie(movie.movieId)"
          >
            <span class="font-heading text-4xl font-bold text-[#E4E4E7] w-10 text-right select-none">{{ String(idx + 1).padStart(2, '0') }}</span>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm truncate">{{ movie.title }}</h3>
              <div class="flex items-center gap-2 mt-1.5">
                <svg class="w-3.5 h-3.5 text-[#18181B] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                <span class="text-sm font-semibold">{{ movie.avgRating.toFixed(1) }}</span>
              </div>
              <p class="text-xs text-[#A1A1AA] mt-1">{{ movie.genres.slice(0, 2).join(' / ') }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
