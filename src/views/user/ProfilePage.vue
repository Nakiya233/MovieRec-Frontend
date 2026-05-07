<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { adminApi } from '@/api/adminApi'
import { formatDateTime } from '@/utils/format'
import type { AdminRatingItem, AdminCommentItem } from '@/types/admin'

const auth = useAuthStore()

const ratings = ref<AdminRatingItem[]>([])
const comments = ref<AdminCommentItem[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!auth.userId) return
  try {
    const [ratingRes, commentRes] = await Promise.all([
      adminApi.getRatings({ userId: auth.userId, page: 1, size: 50 }),
      adminApi.getComments({ page: 1, size: 50 })
    ])
    ratings.value = ratingRes.data.data.records
    comments.value = commentRes.data.data.records.filter(c => c.userId === auth.userId && c.status === 0)
  } catch {
    // ignore errors
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <div class="mb-10">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-full bg-[#18181B] flex items-center justify-center text-lg font-bold text-white">
          {{ auth.user?.username?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div>
          <h1 class="font-heading text-xl font-semibold">{{ auth.user?.username }}</h1>
          <p class="text-sm text-[#A1A1AA]">普通用户</p>
        </div>
      </div>
      <button class="btn-outline text-xs" @click="auth.logout()">退出登录</button>
    </div>

    <div v-if="loading" class="text-center py-10 text-sm text-[#A1A1AA]">加载中...</div>

    <template v-else>
      <!-- My Ratings -->
      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">我的评分</h2>
        <div v-if="ratings.length === 0" class="text-sm text-[#A1A1AA]">暂无评分记录</div>
        <div v-else class="space-y-2">
          <div
            v-for="r in ratings"
            :key="r.id"
            class="flex items-center justify-between p-4 border border-[#E4E4E7] rounded-sm"
          >
            <div>
              <p class="text-sm font-medium">{{ r.movieTitle }}</p>
              <p class="text-xs text-[#A1A1AA]">{{ formatDateTime(r.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span class="font-semibold text-sm">{{ r.score.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- My Comments -->
      <section>
        <h2 class="text-lg font-semibold mb-4">我的评论</h2>
        <div v-if="comments.length === 0" class="text-sm text-[#A1A1AA]">暂无评论记录</div>
        <div v-else class="space-y-3">
          <div
            v-for="c in comments"
            :key="c.id"
            class="p-4 border border-[#E4E4E7] rounded-sm"
          >
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-sm font-medium">{{ c.movieTitle }}</p>
              <span class="text-xs text-[#A1A1AA]">{{ formatDateTime(c.createdAt) }}</span>
            </div>
            <p class="text-sm text-[#52525B]">{{ c.content }}</p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
