<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { ratingApi, type UserRatingRecord } from '@/api/ratingApi'
import { commentApi, type UserCommentRecord } from '@/api/commentApi'
import { formatDateTime, formatDate } from '@/utils/format'
import Pagination from '@/components/common/Pagination.vue'

const auth = useAuthStore()
const PAGE_SIZE = 10

const activeTab = ref<'info' | 'ratings' | 'comments'>('info')

const roleLabel = computed(() => {
  const map: Record<number, string> = { 2: '普通用户', 4: '管理员', 255: '超级管理员' }
  return map[auth.user?.role ?? 2] ?? '普通用户'
})

const ratings = ref<UserRatingRecord[]>([])
const comments = ref<UserCommentRecord[]>([])
const loading = ref(true)

const ratingPage = ref(1)
const ratingTotal = ref(0)
const commentPage = ref(1)
const commentTotal = ref(0)

async function loadRatings(page: number) {
  ratingPage.value = page
  const res = await ratingApi.getMyRatings({ page, size: PAGE_SIZE })
  ratings.value = res.data.data.records
  ratingTotal.value = res.data.data.total
}

async function loadComments(page: number) {
  commentPage.value = page
  const res = await commentApi.getMyComments({ page, size: PAGE_SIZE })
  comments.value = res.data.data.records
  commentTotal.value = res.data.data.total
}

onMounted(async () => {
  if (!auth.userId) return
  try {
    await Promise.all([loadRatings(1), loadComments(1)])
  } catch {
    // ignore errors
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <!-- Header -->
    <h2 class="font-heading text-2xl font-semibold tracking-tight mb-8">个人中心</h2>

    <!-- Tabs -->
    <div class="flex gap-8 border-b border-[#E4E4E7] mb-8">
      <button
        class="pb-2.5 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2"
        :class="activeTab === 'info' ? 'text-[#09090B] border-[#18181B]' : 'text-[#A1A1AA] border-transparent hover:text-[#52525B]'"
        @click="activeTab = 'info'"
      >
        个人信息
      </button>
      <button
        class="pb-2.5 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2"
        :class="activeTab === 'ratings' ? 'text-[#09090B] border-[#18181B]' : 'text-[#A1A1AA] border-transparent hover:text-[#52525B]'"
        @click="activeTab = 'ratings'"
      >
        我的评分
      </button>
      <button
        class="pb-2.5 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2"
        :class="activeTab === 'comments' ? 'text-[#09090B] border-[#18181B]' : 'text-[#A1A1AA] border-transparent hover:text-[#52525B]'"
        @click="activeTab = 'comments'"
      >
        我的评论
      </button>
    </div>

    <!-- Tab: 个人信息 -->
    <div v-if="activeTab === 'info'" class="bg-white border border-[#E4E4E7] rounded-sm p-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-xs text-[#A1A1AA] mb-1">用户名</p>
          <p class="text-sm font-medium">{{ auth.user?.username }}</p>
        </div>
        <div>
          <p class="text-xs text-[#A1A1AA] mb-1">角色</p>
          <p class="text-sm font-medium">{{ roleLabel }}</p>
        </div>
        <div>
          <p class="text-xs text-[#A1A1AA] mb-1">邮箱</p>
          <p class="text-sm font-medium">{{ auth.user?.email || '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-[#A1A1AA] mb-1">注册时间</p>
          <p class="text-sm font-medium">{{ auth.user?.createdTime ? formatDate(auth.user.createdTime) : '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-[#A1A1AA] mb-1">评分总数</p>
          <p class="text-sm font-medium">{{ ratingTotal }}</p>
        </div>
        <div>
          <p class="text-xs text-[#A1A1AA] mb-1">评论总数</p>
          <p class="text-sm font-medium">{{ commentTotal }}</p>
        </div>
      </div>
    </div>

    <!-- Tab: 我的评分 -->
    <div v-if="activeTab === 'ratings'">
      <div v-if="loading" class="text-center py-10 text-sm text-[#A1A1AA]">加载中...</div>
      <div v-else-if="ratings.length === 0" class="text-sm text-[#A1A1AA] py-8 text-center">暂无评分记录</div>
      <template v-else>
        <div class="space-y-2 mb-4">
          <div
            v-for="r in ratings"
            :key="r.id"
            class="flex items-center justify-between p-4 border border-[#E4E4E7] rounded-sm"
          >
            <div>
              <p class="text-sm font-medium">{{ r.movieTitle }}</p>
              <p class="text-xs text-[#A1A1AA]">{{ formatDateTime(r.ratedTime) }}</p>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span class="font-semibold text-sm">{{ r.score.toFixed(1) }}</span>
            </div>
          </div>
        </div>
        <Pagination :current="ratingPage" :total="ratingTotal" :page-size="PAGE_SIZE" @change="loadRatings" />
      </template>
    </div>

    <!-- Tab: 我的评论 -->
    <div v-if="activeTab === 'comments'">
      <div v-if="loading" class="text-center py-10 text-sm text-[#A1A1AA]">加载中...</div>
      <div v-else-if="comments.length === 0" class="text-sm text-[#A1A1AA] py-8 text-center">暂无评论记录</div>
      <template v-else>
        <div class="space-y-3 mb-4">
          <div
            v-for="c in comments"
            :key="c.id"
            class="p-4 border border-[#E4E4E7] rounded-sm"
          >
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-sm font-medium">{{ c.movieTitle }}</p>
              <span class="text-xs text-[#A1A1AA]">{{ formatDateTime(c.createdTime) }}</span>
            </div>
            <p class="text-sm text-[#52525B]">{{ c.content }}</p>
          </div>
        </div>
        <Pagination :current="commentPage" :total="commentTotal" :page-size="PAGE_SIZE" @change="loadComments" />
      </template>
    </div>
  </div>
</template>
