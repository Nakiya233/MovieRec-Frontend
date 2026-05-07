<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecommendStore } from '@/stores/recommendStore'
import MovieCard from '@/components/common/MovieCard.vue'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const recommendStore = useRecommendStore()

const loading = ref(false)
const error = ref('')

const page = ref(1)
const pageSize = 12

async function loadRecommendations() {
  loading.value = true
  error.value = ''
  try {
    await recommendStore.fetchRecommendations(page.value, pageSize)
  } catch (e: any) {
    error.value = e?.message || '加载推荐失败'
  } finally {
    loading.value = false
  }
}

function goToMovie(id: number) {
  router.push({ name: 'MovieDetail', params: { id } })
}

function onPageChange(p: number) {
  page.value = p
  loadRecommendations()
}

onMounted(() => loadRecommendations())
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="font-heading text-2xl font-semibold tracking-tight mb-1">我的推荐</h1>
      <p class="text-sm text-[#A1A1AA]">
        基于你的观影历史智能推荐
      </p>
    </div>

    <!-- Cold Start Banner -->
    <div
      v-if="recommendStore.isColdStart && !loading"
      class="mb-8 p-4 bg-[#FAFAFA] border border-[#E4E4E7] rounded-sm text-sm text-[#52525B]"
    >
      评分数据不足，为你推荐热门电影。多评几部电影可以获得更精准的个性化推荐。
    </div>

    <!-- Error -->
    <div v-if="error" class="text-center py-10 text-sm text-[#DC2626]">
      <p>{{ error }}</p>
      <button class="btn-outline mt-4 text-xs" @click="loadRecommendations">重试</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-sm text-[#A1A1AA]">加载中...</div>

    <template v-else>
      <div v-if="recommendStore.results.length === 0" class="text-center py-20 text-sm text-[#A1A1AA]">
        暂无推荐
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-10">
        <MovieCard
          v-for="item in recommendStore.results"
          :key="item.movieId"
          :movie-id="item.movieId"
          :title="item.title"
          :poster-url="item.posterUrl"
          :avg-rating="item.avgRating"
          :rating-count="item.ratingCount"
          :genres="item.genres"
          :rank-no="item.rankNo"
          :recommend-reason="item.recommendReason || undefined"
          @click="goToMovie(item.movieId)"
        />
      </div>
    </template>

    <div class="flex justify-center">
      <Pagination
        :current="page"
        :total="recommendStore.total"
        :page-size="pageSize"
        @change="onPageChange"
      />
    </div>
  </div>
</template>
