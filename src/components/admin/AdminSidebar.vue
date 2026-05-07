<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const auth = useAuthStore()

const activeMenu = computed(() => route.path)

const menuItems = [
  { path: '/admin/dashboard', icon: 'Grid', label: '仪表盘' },
  { path: '/admin/movies', icon: 'Film', label: '电影管理' },
  { path: '/admin/users', icon: 'User', label: '用户管理' },
  { path: '/admin/comments', icon: 'ChatLineSquare', label: '评论管理' },
  { path: '/admin/ratings', icon: 'Star', label: '评分管理' },
]
</script>

<template>
  <aside class="fixed left-0 top-0 bottom-0 w-56 z-40 flex flex-col" style="background:#FAFAFA; border-right:1px solid #E4E4E7;">
    <div class="flex items-center gap-2.5 px-5 py-5 border-b border-[#E4E4E7]">
      <svg class="w-7 h-7 text-[#18181B] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
      </svg>
      <div>
        <span class="font-heading text-base font-semibold tracking-tight">MovieRec</span>
        <p class="text-[10px] text-[#A1A1AA]">管理后台</p>
      </div>
    </div>

    <nav class="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-all duration-150"
        :class="activeMenu === item.path
          ? 'bg-[#18181B] text-white font-medium'
          : 'text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B]'"
      >
        {{ item.label }}
      </router-link>

      <div class="pt-4 mt-4 border-t border-[#E4E4E7]">
        <router-link
          to="/admin/recommendations/1"
          class="flex items-center gap-3 px-3 py-2.5 text-sm text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B] rounded-sm transition-all duration-150"
        >
          推荐结果
        </router-link>
        <router-link
          to="/admin/metrics"
          class="flex items-center gap-3 px-3 py-2.5 text-sm text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B] rounded-sm transition-all duration-150"
        >
          评估看板
        </router-link>
      </div>
    </nav>

    <div class="px-3 py-4 border-t border-[#E4E4E7]">
      <div class="flex items-center gap-3 px-3">
        <div class="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-xs font-semibold text-white">
          {{ auth.user?.username?.charAt(0).toUpperCase() || 'A' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ auth.user?.username || '管理员' }}</p>
          <p class="text-xs text-[#A1A1AA] truncate">管理员</p>
        </div>
      </div>
    </div>
  </aside>
</template>
