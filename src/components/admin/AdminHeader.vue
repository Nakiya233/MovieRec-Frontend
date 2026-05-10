<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const routeTitleMap: Record<string, string> = {
  '/admin/dashboard': '仪表盘',
  '/admin/users': '用户管理',
  '/admin/movies': '电影管理',
  '/admin/comments': '评论管理',
  '/admin/ratings': '评分记录',
  '/admin/metrics': '评估看板',
}

const pageTitle = computed(() => {
  const path = route.path
  for (const [key, title] of Object.entries(routeTitleMap)) {
    if (path.startsWith(key)) return title
  }
  if (path.startsWith('/admin/recommendations')) return '推荐结果'
  return '管理后台'
})
</script>

<template>
  <div class="sticky top-0 z-30 px-6 py-3 flex items-center justify-between bg-white border-b border-[#E4E4E7]">
    <h1 class="font-heading text-lg font-semibold tracking-tight">{{ pageTitle }}</h1>
    <div class="flex items-center gap-3">
      <input
        type="text"
        placeholder="搜索..."
        class="hidden sm:block w-48 px-3 py-1.5 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-sm placeholder-[#A1A1AA] focus:border-[#18181B] focus:outline-none transition-all duration-200"
      />
      <div class="relative p-2 hover:bg-[#F4F4F5] rounded transition-colors duration-150 cursor-pointer">
        <svg class="w-4 h-4 text-[#52525B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#18181B] rounded-full"></span>
      </div>
      <button
        class="ml-2 px-3 py-1.5 text-xs font-medium text-[#52525B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
        @click="auth.logout('AdminLogin')"
      >
        退出登录
      </button>
    </div>
  </div>
</template>
