import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { title: '管理后台', requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/DashboardPage.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManagePage.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'movies',
        name: 'MovieManage',
        component: () => import('@/views/admin/MovieManagePage.vue'),
        meta: { title: '电影管理' }
      },
      {
        path: 'comments',
        name: 'CommentManage',
        component: () => import('@/views/admin/CommentManagePage.vue'),
        meta: { title: '评论管理' }
      },
      {
        path: 'ratings',
        name: 'RatingRecord',
        component: () => import('@/views/admin/RatingRecordPage.vue'),
        meta: { title: '评分记录' }
      },
      {
        path: 'recommendations/:userId',
        name: 'RecommendView',
        component: () => import('@/views/admin/RecommendViewPage.vue'),
        meta: { title: '推荐结果查看' }
      },
      {
        path: 'metrics',
        name: 'Metrics',
        component: () => import('@/views/admin/MetricsPage.vue'),
        meta: { title: '评估看板' }
      }
    ]
  }
]

export default adminRoutes
