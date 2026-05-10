<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { validateUsername, validatePassword } from '@/utils/validators'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const activeTab = ref<'login' | 'register'>('login')

// Login fields
const loginUsername = ref('')
const loginPassword = ref('')
const loginError = ref('')
const loginLoading = ref(false)

// Register fields
const regUsername = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regConfirmPassword = ref('')
const regError = ref('')
const regLoading = ref(false)

async function handleLogin() {
  loginError.value = ''
  const uErr = validateUsername(loginUsername.value)
  if (uErr !== true) { loginError.value = uErr; return }
  const pErr = validatePassword(loginPassword.value)
  if (pErr !== true) { loginError.value = pErr; return }

  loginLoading.value = true
  try {
    await auth.login(loginUsername.value, loginPassword.value)
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (e: any) {
    loginError.value = e?.message || '登录失败，请重试'
  } finally {
    loginLoading.value = false
  }
}

function validateEmail(email: string): string | true {
  if (!email) return '请输入邮箱地址'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '邮箱格式不正确'
  return true
}

async function handleRegister() {
  regError.value = ''
  const uErr = validateUsername(regUsername.value)
  if (uErr !== true) { regError.value = uErr; return }
  const eErr = validateEmail(regEmail.value)
  if (eErr !== true) { regError.value = eErr; return }
  const pErr = validatePassword(regPassword.value)
  if (pErr !== true) { regError.value = pErr; return }
  if (regPassword.value !== regConfirmPassword.value) {
    regError.value = '两次输入的密码不一致'
    return
  }

  regLoading.value = true
  try {
    await auth.register(regUsername.value, regPassword.value, regConfirmPassword.value, regEmail.value)
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (e: any) {
    regError.value = e?.message || '注册失败，请重试'
  } finally {
    regLoading.value = false
  }
}
</script>

<template>
  <div class="font-body min-h-screen flex">
    <!-- Left: Brand Panel -->
    <div class="hidden lg:flex lg:w-5/12 bg-[#18181B] text-white flex-col justify-between p-12 relative overflow-hidden">
      <div>
        <div class="flex items-center gap-3 mb-16">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span class="font-heading text-2xl tracking-tight">MovieRec</span>
        </div>
        <div class="max-w-sm">
          <p class="text-4xl font-heading font-semibold leading-tight mb-6">发现你的下一部最爱电影</p>
          <p class="text-base text-[#A1A1AA] leading-relaxed">基于 AI 算法的智能推荐系统，精准匹配你的观影偏好。超过 10,000 部影片等你探索。</p>
        </div>
      </div>
      <div class="flex gap-2 text-xs text-[#71717A]">
        <span>© 2026 MovieRec</span>
        <span>·</span>
        <a href="#" class="hover:text-white transition-colors duration-200">隐私政策</a>
        <span>·</span>
        <a href="#" class="hover:text-white transition-colors duration-200">用户协议</a>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center gap-2 mb-10">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#18181B">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span class="font-heading text-xl tracking-tight text-[#09090B]">MovieRec</span>
        </div>

        <!-- Tab Switcher -->
        <div class="flex gap-8 mb-10">
          <button
            class="pb-2 text-sm font-semibold cursor-pointer border-b-2 transition-colors duration-200"
            :class="activeTab === 'login' ? 'text-[#09090B] border-[#18181B]' : 'text-[#A1A1AA] border-transparent hover:text-[#52525B]'"
            @click="activeTab = 'login'"
          >
            登录
          </button>
          <button
            class="pb-2 text-sm font-semibold cursor-pointer border-b-2 transition-colors duration-200"
            :class="activeTab === 'register' ? 'text-[#09090B] border-[#18181B]' : 'text-[#A1A1AA] border-transparent hover:text-[#52525B]'"
            @click="activeTab = 'register'"
          >
            注册
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">用户名</label>
            <input
              v-model="loginUsername"
              type="text"
              placeholder="您的用户名"
              class="input-field"
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-medium text-[#52525B]">密码</label>
            </div>
            <input
              v-model="loginPassword"
              type="password"
              placeholder="••••••••"
              class="input-field"
            />
          </div>
          <p v-if="loginError" class="text-xs text-[#DC2626]">{{ loginError }}</p>
          <button type="submit" class="btn-primary w-full py-3" :disabled="loginLoading">
            {{ loginLoading ? '登录中...' : '登 录' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-if="activeTab === 'register'" class="space-y-5" @submit.prevent="handleRegister">
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">用户名</label>
            <input
              v-model="regUsername"
              type="text"
              placeholder="您的昵称"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">邮箱地址</label>
            <input
              v-model="regEmail"
              type="email"
              placeholder="your@email.com"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">密码</label>
            <input
              v-model="regPassword"
              type="password"
              placeholder="至少 6 位字符"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-[#52525B] mb-2">确认密码</label>
            <input
              v-model="regConfirmPassword"
              type="password"
              placeholder="再次输入密码"
              class="input-field"
            />
          </div>
          <p v-if="regError" class="text-xs text-[#DC2626]">{{ regError }}</p>
          <button type="submit" class="btn-primary w-full py-3" :disabled="regLoading">
            {{ regLoading ? '注册中...' : '注 册' }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>
