import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import userRoutes from './user-routes'
import adminRoutes from './admin-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [...userRoutes, ...adminRoutes]
})

router.beforeEach((to, _from) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'Home' }
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'Home' }
  }
})

export default router
