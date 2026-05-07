import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/user/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/LoginPage.vue'),
    meta: { title: '登录', guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/RegisterPage.vue'),
    meta: { title: '注册', guestOnly: true }
  },
  {
    path: '/movies',
    name: 'MovieList',
    component: () => import('@/views/user/MovieListPage.vue'),
    meta: { title: '电影列表' }
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: () => import('@/views/user/MovieDetailPage.vue'),
    meta: { title: '电影详情' }
  },
  {
    path: '/recommendations',
    name: 'Recommend',
    component: () => import('@/views/user/RecommendPage.vue'),
    meta: { title: '个性推荐', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/ProfilePage.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  }
]

export default userRoutes
