import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const auth = useAuthStore()
  return {
    isLoggedIn: computed(() => auth.isLoggedIn),
    isAdmin: computed(() => auth.isAdmin),
    userId: computed(() => auth.userId),
    user: computed(() => auth.user),
    login: auth.login,
    register: auth.register,
    logout: auth.logout
  }
}
