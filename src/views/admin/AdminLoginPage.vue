<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { removeToken, removeUser } from '@/utils/token'
import { validateUsername, validatePassword } from '@/utils/validators'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMsg.value = ''

  const uErr = validateUsername(username.value)
  if (uErr !== true) { errorMsg.value = uErr; return }
  const pErr = validatePassword(password.value)
  if (pErr !== true) { errorMsg.value = pErr; return }

  loading.value = true
  try {
    await auth.login(username.value, password.value)
    if (auth.isAdmin) {
      router.push('/admin/dashboard')
    } else {
      auth.token = null
      auth.user = null
      removeToken()
      removeUser()
      errorMsg.value = '无权限访问管理后台，仅限管理员登录'
    }
  } catch (e: any) {
    errorMsg.value = e?.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="font-body min-h-screen flex items-center justify-center bg-white p-8">
    <div class="w-full max-w-sm">
      <!-- Brand -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <svg class="w-7 h-7 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span class="font-heading text-2xl tracking-tight text-[#09090B]">MovieRec</span>
        </div>
        <p class="text-sm text-[#A1A1AA]">管理后台</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white border border-[#E4E4E7] rounded-lg p-8">
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">用户名</label>
            <input
              v-model="username"
              type="text"
              placeholder="管理员账号"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="········"
              class="input-field"
            />
          </div>
          <p v-if="errorMsg" class="text-xs text-[#DC2626]">{{ errorMsg }}</p>
          <button
            type="submit"
            class="btn-primary w-full py-3"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </button>
        </form>
      </div>

      <!-- Back link -->
      <p class="text-center mt-6">
        <router-link to="/" class="text-xs text-[#A1A1AA] hover:text-[#52525B] transition-colors">
          返回前台首页
        </router-link>
      </p>
    </div>
  </div>
</template>
