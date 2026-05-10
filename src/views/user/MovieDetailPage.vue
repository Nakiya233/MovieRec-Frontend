<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movieStore'
import { useAuthStore } from '@/stores/authStore'
import { ratingApi } from '@/api/ratingApi'
import { commentApi } from '@/api/commentApi'
import { useToast } from '@/composables/useToast'
import PosterImage from '@/components/common/PosterImage.vue'
import StarRating from '@/components/common/StarRating.vue'
import Pagination from '@/components/common/Pagination.vue'
import { formatRating, formatDateTime } from '@/utils/format'
import type { MovieDetail, CommentItem } from '@/types/movie'

const route = useRoute()
const movieStore = useMovieStore()
const auth = useAuthStore()
const toast = useToast()

const movie = ref<MovieDetail | null>(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')

const myRating = ref(0)
const myRatingId = ref<number | null>(null)
const ratingSubmitting = ref(false)

const commentContent = ref('')
const myCommentId = ref<number | null>(null)
const commentSubmitting = ref(false)
const commentSuccess = ref(false)

const comments = ref<CommentItem[]>([])
const commentPage = ref(1)
const commentTotal = ref(0)
const commentPageSize = 10

function resetState() {
  movie.value = null
  comments.value = []
  myRating.value = 0
  myRatingId.value = null
  commentContent.value = ''
  myCommentId.value = null
  commentSuccess.value = false
  notFound.value = false
  error.value = ''
  loading.value = true
}

async function loadComments(page: number) {
  const id = Number(route.params.id)
  const res = await movieStore.fetchMovieComments(id, page, commentPageSize)
  comments.value = res.records
  commentTotal.value = res.total
  commentPage.value = page
}

async function init() {
  resetState()
  try {
    const id = Number(route.params.id)
    const tasks: Promise<any>[] = [
      movieStore.fetchMovieDetail(id).then(d => { movie.value = d }),
      loadComments(1),
    ]
    if (auth.isLoggedIn) {
      tasks.push(
        ratingApi.getMyRatings({ page: 1, size: 1, movieId: id }).then(res => {
          const r = res.data.data.records[0]
          if (r) { myRating.value = r.score; myRatingId.value = r.id }
        }),
        commentApi.getMyComments({ page: 1, size: 1, movieId: id }).then(res => {
          const c = res.data.data.records[0]
          if (c) { commentContent.value = c.content; myCommentId.value = c.id }
        }),
      )
    }
    await Promise.all(tasks)
  } catch (e: any) {
    if (e?.response?.status === 404) {
      notFound.value = true
    } else {
      error.value = e?.message || '加载失败'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => init())

watch(() => route.params.id, () => {
  if (route.params.id) init()
})

async function submitRating() {
  if (!movie.value || ratingSubmitting.value) return
  ratingSubmitting.value = true
  try {
    await ratingApi.submit({ movieId: movie.value.movieId, score: myRating.value })
    toast.show(myRatingId.value ? '评分修改成功' : '评分提交成功')
    const id = Number(route.params.id)
    const [detail, ratingRes] = await Promise.all([
      movieStore.fetchMovieDetail(id),
      ratingApi.getMyRatings({ page: 1, size: 1, movieId: id }),
    ])
    movie.value = detail
    const record = ratingRes.data.data.records[0]
    if (record) {
      myRating.value = record.score
      myRatingId.value = record.id
    }
  } catch (e: any) {
    toast.show(e?.response?.data?.message || e?.message || '评分提交失败')
  } finally {
    ratingSubmitting.value = false
  }
}

async function submitComment() {
  if (!movie.value || !commentContent.value.trim() || commentSubmitting.value) return
  commentSubmitting.value = true
  try {
    await commentApi.submit({ movieId: movie.value.movieId, content: commentContent.value.trim() })
    commentSuccess.value = true
    toast.show(myCommentId.value ? '评论修改成功' : '评论发表成功')
    const id = Number(route.params.id)
    // Reload detail, comments, and user's latest comment
    const [detail, commentListRes, commentRes] = await Promise.all([
      movieStore.fetchMovieDetail(id),
      movieStore.fetchMovieComments(id, 1, commentPageSize),
      commentApi.getMyComments({ page: 1, size: 1, movieId: id }),
    ])
    movie.value = detail
    comments.value = commentListRes.records
    commentTotal.value = commentListRes.total
    commentPage.value = 1
    const latest = commentRes.data.data.records[0]
    if (latest) {
      commentContent.value = latest.content
      myCommentId.value = latest.id
    }
  } catch (e: any) {
    toast.show(e?.response?.data?.message || e?.message || '评论提交失败')
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
                  {{ myRatingId ? '修改评分' : '提交评分' }}
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
            {{ commentSubmitting ? '提交中...' : (myCommentId ? '修改评论' : '发表评论') }}
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
        <div v-if="comments.length === 0" class="text-sm text-[#A1A1AA] py-8 text-center">
          暂无评论，来写第一条吧
        </div>
        <div v-else class="space-y-4 mb-4">
          <div
            v-for="comment in comments.filter(c => c.status === 0)"
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
        <Pagination v-if="commentTotal > commentPageSize" :current="commentPage" :total="commentTotal" :page-size="commentPageSize" @change="loadComments" />
      </div>
    </template>
  </div>
</template>
