<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import { useAuthStore } from '@/stores/authStore'
import { ratingApi } from '@/api/ratingApi'
import { commentApi } from '@/api/commentApi'
import PosterImage from '@/components/common/PosterImage.vue'
import StarRating from '@/components/common/StarRating.vue'
import { formatRating, formatDateTime } from '@/utils/format'
import type { MovieDetail, CommentItem } from '@/types/movie'

const route = useRoute()
const movieStore = useMovieStore()
const auth = useAuthStore()

const movie = ref<MovieDetail | null>(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')

const myRating = ref(0)
const ratingSubmitting = ref(false)

const commentContent = ref('')
const commentSubmitting = ref(false)
const commentSuccess = ref(false)

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    movie.value = await movieStore.fetchMovieDetail(id)
  } catch (e: any) {
    if (e?.response?.status === 404) {
      notFound.value = true
    } else {
      error.value = e?.message || '加载失败'
    }
  } finally {
    loading.value = false
  }
})

async function submitRating() {
  if (!movie.value || ratingSubmitting.value) return
  ratingSubmitting.value = true
  try {
    const res = await ratingApi.submit({ movieId: movie.value.movieId, score: myRating.value })
    movie.value.avgRating = res.data.data.avgRating
  } catch (e: any) {
    // ignore
  } finally {
    ratingSubmitting.value = false
  }
}

async function submitComment() {
  if (!movie.value || !commentContent.value.trim() || commentSubmitting.value) return
  commentSubmitting.value = true
  try {
    await commentApi.submit({ movieId: movie.value.movieId, content: commentContent.value.trim() })
    commentContent.value = ''
    commentSuccess.value = true
    // Reload detail to get updated comments
    const id = Number(route.params.id)
    movie.value = await movieStore.fetchMovieDetail(id)
  } catch (e: any) {
    // ignore
  } finally {
    commentSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-sm text-[#A1A1AA]">加载中...</div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="text-center py-20">
      <p class="text-lg font-semibold mb-2">电影不存在</p>
      <p class="text-sm text-[#A1A1AA]">该电影可能已被移除或链接有误</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-sm text-[#DC2626]">{{ error }}</p>
    </div>

    <template v-else-if="movie">
      <!-- Header -->
      <div class="flex flex-col md:flex-row gap-8 mb-12">
        <div class="w-48 flex-shrink-0">
          <PosterImage :src="movie.posterUrl" :alt="movie.title" />
        </div>
        <div class="flex-1">
          <h1 class="font-heading text-3xl font-bold mb-2">{{ movie.title }}</h1>
          <div class="flex items-center gap-3 text-sm text-[#52525B] mb-4">
            <span v-if="movie.releaseDate">{{ movie.releaseDate }}</span>
            <span v-for="g in movie.genres" :key="g" class="genre-tag">{{ g }}</span>
          </div>

          <div class="flex items-center gap-2 mb-6">
            <svg class="w-5 h-5 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span class="font-heading text-2xl font-bold">{{ formatRating(movie.avgRating) }}</span>
            <span class="text-sm text-[#A1A1AA]">({{ movie.ratingCount }} 人评分)</span>
          </div>

          <p v-if="movie.overview" class="text-sm text-[#52525B] leading-relaxed">{{ movie.overview }}</p>

          <!-- My Rating -->
          <div class="mt-8 p-5 border border-[#E4E4E7] rounded-sm">
            <h3 class="text-sm font-semibold mb-3">我的评分</h3>
            <template v-if="auth.isLoggedIn">
              <div class="flex items-center gap-3">
                <StarRating v-model="myRating" :size="'normal'" />
                <span class="text-sm text-[#52525B]">{{ myRating }} 分</span>
                <button
                  v-if="myRating > 0"
                  class="text-xs text-[#18181B] underline cursor-pointer"
                  :disabled="ratingSubmitting"
                  @click="submitRating"
                >
                  提交评分
                </button>
              </div>
            </template>
            <p v-else class="text-sm text-[#A1A1AA]">
              <a href="/login" class="text-[#18181B] underline">登录</a>后参与评分
            </p>
          </div>
        </div>
      </div>

      <!-- Comment Form -->
      <div class="mb-12 p-5 border border-[#E4E4E7] rounded-sm">
        <h3 class="text-sm font-semibold mb-3">我的评论</h3>
        <template v-if="auth.isLoggedIn">
          <textarea
            v-model="commentContent"
            class="input-field mb-3"
            rows="3"
            placeholder="写下你的评论..."
          ></textarea>
          <button
            class="btn-primary text-xs"
            :disabled="!commentContent.trim() || commentSubmitting"
            @click="submitComment"
          >
            {{ commentSubmitting ? '提交中...' : '发表评论' }}
          </button>
          <p v-if="commentSuccess" class="text-xs text-[#16A34A] mt-2">评论发表成功</p>
        </template>
        <p v-else class="text-sm text-[#A1A1AA]">
          <a href="/login" class="text-[#18181B] underline">登录</a>后发表评论
        </p>
      </div>

      <!-- Latest Comments -->
      <div>
        <h3 class="text-sm font-semibold mb-4">最新评论</h3>
        <div v-if="movie.latestComments.length === 0" class="text-sm text-[#A1A1AA] py-8 text-center">
          暂无评论，来写第一条吧
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="comment in movie.latestComments.filter(c => c.status === 0)"
            :key="comment.id"
            class="p-4 border border-[#E4E4E7] rounded-sm"
          >
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium">{{ comment.username }}</span>
              <span class="text-xs text-[#A1A1AA]">{{ formatDateTime(comment.createdAt) }}</span>
            </div>
            <p class="text-sm text-[#52525B] leading-relaxed">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
