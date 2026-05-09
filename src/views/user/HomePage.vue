<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useMovieStore } from '@/stores/movieStore'
import { useRecommendStore } from '@/stores/recommendStore'
import { useToast } from '@/composables/useToast'
import MovieCard from '@/components/common/MovieCard.vue'
import type { MovieCardData } from '@/types/movie'
import type { RecommendRecord } from '@/types/recommend'

const router = useRouter()
const auth = useAuthStore()
const movieStore = useMovieStore()
const recommendStore = useRecommendStore()
const toast = useToast()

const hotMovies = ref<MovieCardData[]>([])
const recommendMovies = ref<RecommendRecord[]>([])
const loading = ref(true)
const searchKeyword = ref('')

onMounted(async () => {
  try {
    hotMovies.value = await movieStore.fetchHotMovies()
    if (auth.isLoggedIn) {
      await recommendStore.fetchRecommendations(1, 6)
      recommendMovies.value = recommendStore.results
    }
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

function goToRecommend() {
  if (!auth.isLoggedIn) {
    toast.show('请先登录后再查看推荐')
    router.push('/login')
    return
  }
  router.push({ name: 'Recommend' })
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
            <button class="btn-outline" @click="goToRecommend">
              查看推荐
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-16 space-y-20">
      <!-- 个性化推荐 -->
      <section>
        <div class="flex items-end justify-between mb-8">
          <div>
            <h2 class="font-heading text-2xl font-semibold tracking-tight mb-1">个性化推荐</h2>
            <p class="text-sm text-[#A1A1AA]">基于你的偏好，为你精选推荐</p>
          </div>
          <template v-if="auth.isLoggedIn">
            <a href="#" class="text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors duration-150 cursor-pointer" @click.prevent="router.push({ name: 'Recommend' })">
              查看全部 &rarr;
            </a>
          </template>
        </div>

        <div v-if="loading" class="text-center py-20 text-sm text-[#A1A1AA]">加载中...</div>

        <!-- 未登录 -->
        <div v-else-if="!auth.isLoggedIn" class="text-center py-16 border border-dashed border-[#E4E4E7] rounded-md">
          <p class="text-sm text-[#A1A1AA] mb-4">登录后获取个性化推荐内容</p>
          <button class="btn-primary text-sm" @click="router.push('/login')">去登录</button>
        </div>

        <!-- 已登录：个性化推荐 -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          <MovieCard
            v-for="(movie, idx) in recommendMovies.slice(0, 6)"
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
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          <MovieCard
            v-for="(movie, idx) in hotMovies.slice(0, 6)"
            :key="movie.movieId"
            v-bind="movie"
            :rank-no="idx + 1"
            @click="goToMovie(movie.movieId)"
          />
        </div>
      </section>
    </main>
  </div>
</template>
