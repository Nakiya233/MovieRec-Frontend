import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/authApi'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/token'
import type { UserInfo } from '@/types/user'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => token.value !== null && user.value !== null)
  const isAdmin = computed(() => (user.value?.role ?? 0) === 4)
  const userId = computed(() => user.value?.id ?? null)

  function initFromStorage() {
    const savedToken = getToken()
    const savedUser = getUser()
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
    }
  }

  async function login(username: string, password: string) {
    const res = await authApi.login({ username, password })
    const { token: newToken, user: newUser } = res.data.data
    token.value = newToken
    user.value = newUser
    setToken(newToken)
    setUser(newUser)
  }

  async function register(username: string, password: string, confirmPassword: string) {
    await authApi.register({ username, password, confirmPassword })
    await login(username, password)
  }

  function logout() {
    token.value = null
    user.value = null
    removeToken()
    removeUser()
    router.push({ name: 'Home' })
  }

  return { token, user, isLoggedIn, isAdmin, userId, initFromStorage, login, register, logout }
})
