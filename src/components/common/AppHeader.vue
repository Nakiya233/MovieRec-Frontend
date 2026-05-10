<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const searchText = ref('')

function goTo(path: string) {
  router.push(path)
}

function doSearch() {
  const val = searchText.value.trim()
  if (val) {
    router.push({ name: 'MovieList', query: { keyword: val } })
  }
}

function goToRecommend() {
  if (!auth.isLoggedIn) {
    toast.show('请先登录后再查看推荐')
    router.push('/login')
    return
  }
  router.push('/recommendations')
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E4E4E7]">
    <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-2.5 cursor-pointer" @click="goTo('/')">
          <svg class="w-7 h-7 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span class="font-heading text-lg tracking-tight font-semibold text-[#09090B]">MovieRec</span>
        </div>
        <div class="hidden md:flex gap-7 text-sm">
          <router-link to="/" class="font-medium" :class="route.path === '/' ? 'text-[#09090B]' : 'text-[#A1A1AA] hover:text-[#52525B] transition-colors duration-150'">首页</router-link>
          <router-link to="/movies" class="font-medium" :class="route.path.startsWith('/movies') ? 'text-[#09090B]' : 'text-[#A1A1AA] hover:text-[#52525B] transition-colors duration-150'">发现</router-link>
          <span class="font-medium cursor-pointer" :class="route.path.startsWith('/recommendations') ? 'text-[#09090B]' : 'text-[#A1A1AA] hover:text-[#52525B] transition-colors duration-150'" @click="goToRecommend">推荐</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden sm:block relative">
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索电影..."
            class="search-input w-56 px-3.5 py-2 pr-9 text-sm placeholder-[#A1A1AA]"
            @keyup.enter="doSearch"
          />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] hover:text-[#18181B] cursor-pointer transition-colors duration-150" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" @click="doSearch">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>

        <template v-if="auth.isLoggedIn">
          <div class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-[#F4F4F5] rounded transition-colors duration-150">
            <svg class="w-5 h-5 text-[#52525B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div class="relative group">
            <div class="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-xs font-semibold text-white cursor-pointer">
              {{ auth.user?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="absolute right-0 top-full mt-2 w-36 bg-white border border-[#E4E4E7] rounded-sm shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <a class="block px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#09090B] transition-colors duration-150 cursor-pointer" @click="goTo('/profile')">个人中心</a>
              <a class="block px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#09090B] transition-colors duration-150 cursor-pointer" @click="auth.logout()">退出登录</a>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn-outline text-sm" @click="goTo('/login')">登录</button>
          <button class="btn-primary text-sm" @click="goTo('/register')">注册</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.search-input {
  background: #FAFAFA;
  border: 1px solid #E4E4E7;
  border-radius: 4px;
  transition: all 0.2s ease;
}
.search-input:focus {
  border-color: #18181B;
  box-shadow: 0 0 0 1px rgba(24,24,27,0.08);
  outline: none;
}
</style>
