# 电影推荐系统 — 前端设计文档

> 技术栈：TypeScript + Vue3 + Vue Router + Pinia + Axios + Vite + Tailwind CSS  
> UI 方案：用户端手写样式 (Tailwind + 自定义 CSS)，管理端使用 Element Plus  
> 设计风格：Monochrome Minimal（极简黑白灰）  
> 文档日期：2026-05-07

---

## 1. 技术选型与版本

| 技术 | 版本 | 用途 | 选型理由 |
|---|---|---|---|
| Vue 3 | ^3.4 | 响应式 UI 框架 | Composition API + `<script setup>` 提供更好的 TS 支持和逻辑复用 |
| TypeScript | ^5.4 | 类型系统 | 接口定义、组件 Props 校验、API 类型约束 |
| Vite | ^5.2 | 构建工具 | 快速 HMR、原生 ESM、开箱即用的 TS 支持 |
| Vue Router | ^4.3 | 路由管理 | 支持懒加载、路由守卫、动态路由 |
| Pinia | ^2.1 | 状态管理 | Vue3 官方推荐，模块化 Store、DevTools 支持 |
| Axios | ^1.6 | HTTP 客户端 | 拦截器机制、请求取消、跨平台 |
| Tailwind CSS | ^3.4 | CSS 框架（CDN） | 原子化 CSS，配合自定义色板实现极简黑白灰风格 |
| Element Plus | ^2.7 | 管理端 UI 组件库 | 成熟的 Vue3 组件库，表格/表单/弹窗等开箱即用 |

### 辅助依赖

| 技术 | 用途 |
|---|---|
| Google Fonts (Archivo + Space Grotesk) | 品牌字体：标题用 Archivo，正文用 Space Grotesk |
| `vite-plugin-vue-devtools` | 开发环境 DevTools 集成 |
| `@vueuse/core` | 通用组合式工具函数（防抖、节流、localStorage 封装等） |
| `dayjs` | 日期格式化（轻量，替代 moment.js） |
| `echarts` + `vue-echarts` | 管理端评估看板图表 |

---

## 2. 项目目录结构

```
movie-recommender-web/
├─public/
│  └─assets/
│      └─posters/                  # 默认海报占位图
│          └─default-movie.png
├─src/
│  ├─main.ts                       # 应用入口
│  ├─App.vue                       # 根组件
│  │
│  ├─router/
│  │  ├─index.ts                   # 路由实例 + 守卫注册
│  │  ├─user-routes.ts             # 用户端路由表
│  │  └─admin-routes.ts            # 管理端路由表
│  │
│  ├─stores/
│  │  ├─authStore.ts               # 登录态、Token、用户信息
│  │  ├─movieStore.ts              # 电影列表、详情的客户端缓存
│  │  ├─recommendStore.ts          # 推荐结果
│  │  └─adminStore.ts              # 管理端共享状态（全局筛选条件等）
│  │
│  ├─api/
│  │  ├─request.ts                 # Axios 实例 + 拦截器
│  │  ├─authApi.ts                 # 登录/注册
│  │  ├─movieApi.ts                # 电影列表/详情
│  │  ├─ratingApi.ts               # 评分提交
│  │  ├─commentApi.ts              # 评论提交/查询
│  │  ├─recommendApi.ts            # 推荐列表
│  │  └─adminApi.ts                # 管理端全部接口
│  │
│  ├─types/
│  │  ├─api.ts                     # 统一响应体、分页泛型
│  │  ├─user.ts                    # 用户相关类型
│  │  ├─movie.ts                   # 电影相关类型
│  │  ├─recommend.ts               # 推荐相关类型
│  │  └─admin.ts                   # 管理端类型
│  │
│  ├─views/
│  │  ├─user/                      # 用户端页面
│  │  │  ├─HomePage.vue
│  │  │  ├─LoginPage.vue
│  │  │  ├─RegisterPage.vue
│  │  │  ├─MovieListPage.vue
│  │  │  ├─MovieDetailPage.vue
│  │  │  ├─RecommendPage.vue
│  │  │  └─ProfilePage.vue
│  │  └─admin/                     # 管理端页面
│  │      ├─AdminLayout.vue        # 管理端布局（侧边栏 + 顶栏 + 内容区）
│  │      ├─DashboardPage.vue
│  │      ├─UserManagePage.vue
│  │      ├─MovieManagePage.vue
│  │      ├─CommentManagePage.vue
│  │      ├─RatingRecordPage.vue
│  │      ├─RecommendViewPage.vue
│  │      └─MetricsPage.vue
│  │
│  ├─components/
│  │  ├─common/                    # 用户端 & 管理端通用
│  │  │  ├─AppHeader.vue           # 顶部导航栏（用户端）
│  │  │  ├─AppFooter.vue           # 页脚
│  │  │  ├─MovieCard.vue           # 电影卡片
│  │  │  ├─StarRating.vue          # 星级评分组件
│  │  │  ├─PosterImage.vue         # 海报图片（含加载失败兜底）
│  │  │  └─Pagination.vue          # 分页器（用户端手写）
│  │  └─admin/                     # 管理端专用
│  │      ├─AdminSidebar.vue
│  │      ├─AdminHeader.vue
│  │      ├─MovieFormDialog.vue    # 电影新增/编辑弹窗
│  │      └─MetricChart.vue        # ECharts 指标图表
│  │
│  ├─composables/                  # 组合式函数（逻辑复用）
│  │  ├─useAuth.ts                 # 登录状态检查、角色判断
│  │  ├─usePagination.ts           # 分页逻辑封装
│  │  └─useDebounce.ts             # 输入防抖
│  │
│  ├─utils/
│  │  ├─token.ts                   # Token 存取（localStorage）
│  │  ├─validators.ts              # 前端表单校验（密码/用户名/评分）
│  │  └─format.ts                  # 日期格式化、评分精度
│  │
│  └─styles/
│      ├─variables.css             # CSS 变量（色板、间距、圆角）
│      ├─base.css                  # 重置与全局样式
│      └─shared.css                # 用户端复用样式
│
├─index.html
├─vite.config.ts
├─tsconfig.json
├─package.json
└─.env.development                 # 开发环境变量（API 代理地址）
```

### 关于双端划分

用户端和管理端共用同一项目、同一入口，通过 **路由前缀** 区分：

- 用户端路由前缀：`/`
- 管理端路由前缀：`/admin`

这样共享 `api/`、`stores/`、`types/`、`utils/`，避免重复代码。用户端不使用 Element Plus，管理端按需引入。

---

## 3. 路由设计

### 3.1 用户端路由表

```typescript
// src/router/user-routes.ts

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
```

### 3.2 管理端路由表

```typescript
// src/router/admin-routes.ts

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
```

### 3.3 路由守卫

```typescript
// src/router/index.ts (核心逻辑)

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

  // 1. 游客限制页面（登录/注册页）—— 已登录则跳转首页
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'Home' }
  }

  // 2. 需要登录的页面
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // 3. 需要管理员权限的页面
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'Home' }
  }
})
```

### 3.4 懒加载策略

所有页面组件使用 `() => import(...)` 动态导入，按路由自动拆分 chunk：
- 用户端页面：各自独立 chunk
- 管理端页面：各自独立 chunk
- Element Plus 组件仅在 `/admin/*` 路由下按需加载

---

## 4. 组件架构

### 4.1 组件树

```
App.vue
├─ AppHeader.vue                # 用户端全局导航
├─ <router-view>                # 根据路由切换以下页面
│
│   # 用户端页面
│   ├─ HomePage.vue
│   │   ├─ MovieCard.vue        # 热门推荐电影卡片（v-for）
│   │   └─ Pagination.vue
│   │
│   ├─ MovieListPage.vue
│   │   ├─ MovieCard.vue
│   │   └─ Pagination.vue
│   │
│   ├─ MovieDetailPage.vue
│   │   ├─ StarRating.vue       # 评分交互
│   │   ├─ PosterImage.vue      # 海报展示
│   │   └─ MovieCard.vue        # "相似推荐" 区域
│   │
│   ├─ RecommendPage.vue
│   │   ├─ MovieCard.vue        # 推荐电影卡片
│   │   └─ Pagination.vue
│   │
│   ├─ LoginPage.vue
│   └─ RegisterPage.vue
│
│   # 管理端页面
│   └─ AdminLayout.vue          # 管理端壳（侧边栏 + 内容）
│       ├─ AdminSidebar.vue     # el-menu 导航
│       ├─ AdminHeader.vue      # 顶栏（用户信息、退出）
│       └─ <router-view>
│           ├─ DashboardPage.vue
│           ├─ UserManagePage.vue     # el-table + el-pagination
│           ├─ MovieManagePage.vue    # el-table + MovieFormDialog
│           ├─ CommentManagePage.vue  # el-table + 删除确认
│           ├─ RatingRecordPage.vue   # el-table 只读
│           ├─ RecommendViewPage.vue  # el-table 展示推荐明细
│           └─ MetricsPage.vue        # MetricChart.vue (ECharts)
│
└─ AppFooter.vue
```

### 4.2 关键组件 Props / Events 契约

**MovieCard.vue**

```typescript
// 用户端手写卡片，展示缩略图 + 标题 + 评分 + 类型标签
defineProps<{
  movieId: number
  title: string
  posterUrl: string | null
  avgRating: number
  ratingCount: number
  genres: string[]
  rankNo?: number          // 推荐页显示排名
  recommendReason?: string  // 推荐页显示推荐解释
}>()

defineEmits<{
  click: [movieId: number]
}>()
```

**StarRating.vue**

```typescript
// 星级评分交互组件（用户端手写，CSS 实现星级效果）
defineProps<{
  modelValue: number       // 当前评分 0.5~5.0
  readonly: boolean         // 游客只读
  size?: 'small' | 'normal'
}>()

defineEmits<{
  'update:modelValue': [score: number]
}>()
```

**PosterImage.vue**

```typescript
// 海报图片，加载失败时显示默认占位图
defineProps<{
  src: string | null
  alt: string
  fallback?: string         // 默认 '/assets/posters/default-movie.png'
}>()
```

**MovieFormDialog.vue**（管理端 Element Plus）

```typescript
// 电影新增/编辑弹窗
defineProps<{
  visible: boolean
  movie?: MovieFormData    // 编辑时传入已有数据，新增时为 undefined
}>()

defineEmits<{
  close: []
  submit: [data: MovieFormData]
}>()
```

---

## 5. 状态管理（Pinia）

### 5.1 authStore

```typescript
// src/stores/authStore.ts

interface AuthState {
  token: string | null
  user: { id: number; username: string; role: number } | null
}

// getters
authStore.isLoggedIn   // computed: token !== null && user !== null
authStore.isAdmin      // computed: (user.role & 4) === 4
authStore.userId       // computed: user?.id ?? null

// actions
authStore.login(username: string, password: string): Promise<void>
  // 1. POST /api/auth/login
  // 2. 保存 token 到 localStorage + state
  // 3. 保存 user 信息到 state

authStore.register(username: string, password: string, confirmPassword: string): Promise<void>
  // 1. POST /api/auth/register
  // 2. 注册成功后自动调用 login

authStore.logout()
  // 1. 清除 token + user state
  // 2. 清除 localStorage
  // 3. router.push('/')

authStore.initFromStorage()
  // 应用初始化时从 localStorage 恢复 token
```

**持久化策略**：`token` 和 `user` 在登录时写入 `localStorage`，应用启动时通过 `initFromStorage()` 恢复。不使用 Pinia 持久化插件，保持简单可控。

### 5.2 movieStore

```typescript
// src/stores/movieStore.ts

// 用途：缓存已加载的电影列表和详情，减少重复请求

interface MovieState {
  listCache: Map<string, MovieListCache>     // key: `${page}_${genreId}_${sortBy}_${keyword}`
  detailCache: Map<number, MovieDetail>       // key: movieId
  hotMovies: MovieCardData[]                  // 首页热门榜
}

// actions
movieStore.fetchMovies(params: MovieQueryParams): Promise<MovieListResponse>
  // 1. 优先返回缓存（5 分钟内有效）
  // 2. 缓存未命中则调用 movieApi.getMovieList()
  // 3. 写入缓存
  // 4. 返回结果

movieStore.fetchMovieDetail(movieId: number): Promise<MovieDetail>
  // 同上，缓存命中直接返回

movieStore.fetchHotMovies(): Promise<MovieCardData[]>
  // 无缓存，每次获取最新
```

### 5.3 recommendStore

```typescript
// src/stores/recommendStore.ts

interface RecommendState {
  results: RecommendRecord[]
  source: 'mix' | 'hot'         // mix=融合推荐, hot=热门兜底
  isColdStart: boolean
  total: number
  page: number
}

// actions
recommendStore.fetchRecommendations(page: number, size: number): Promise<void>
  // 1. GET /api/user/recommendations?page&size
  // 2. 更新 state
  // 3. 如果返回 401，authStore.logout()
```

### 5.4 adminStore

```typescript
// 管理端轻量共享状态，主要用于跨页面的筛选条件保持

interface AdminState {
  userManageKeyword: string
  movieManageKeyword: string
  commentManageKeyword: string
}
```

---

## 6. API 接口层

### 6.1 Axios 实例封装

```typescript
// src/api/request.ts

import axios from 'axios'
import type { ApiResponse } from '@/types/api'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,   // 开发环境 '/api'
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// ========== 请求拦截器：注入 JWT ==========
http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// ========== 响应拦截器：统一错误处理 ==========
http.interceptors.response.use(
  (response) => {
    const body: ApiResponse = response.data
    if (body.code !== 0) {
      // 业务错误统一弹窗提示
      handleBusinessError(body)
      return Promise.reject(body)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore().logout()
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    }
    return Promise.reject(error)
  }
)

function handleBusinessError(body: ApiResponse) {
  // 使用 Element Plus 的 ElMessage（管理端）或自定义 Toast（用户端）
  // 根据 body.code 映射友好提示文案
}

export default http
```

### 6.2 API 模块划分

```typescript
// src/api/authApi.ts
export const authApi = {
  login:     (data: LoginReq)            => http.post<ApiResponse<LoginRes>>('/auth/login', data),
  register:  (data: RegisterReq)         => http.post<ApiResponse<{ userId: number }>>('/auth/register', data),
}

// src/api/movieApi.ts
export const movieApi = {
  getList:   (params: MovieQueryParams)  => http.get<ApiResponse<MovieListRes>>('/movies', { params }),
  getDetail: (id: number)                => http.get<ApiResponse<MovieDetail>>(`/movies/${id}`),
}

// src/api/ratingApi.ts
export const ratingApi = {
  submit: (data: RatingReq) => http.post<ApiResponse<RatingRes>>('/ratings', data),
}

// src/api/commentApi.ts
export const commentApi = {
  submit: (data: CommentReq) => http.post<ApiResponse<CommentRes>>('/comments', data),
}

// src/api/recommendApi.ts
export const recommendApi = {
  getList: (params: { page: number; size: number }) =>
    http.get<ApiResponse<RecommendRes>>('/recommendations', { params }),
}

// src/api/adminApi.ts
export const adminApi = {
  getUsers:         (params: AdminUserQuery)  => http.get<ApiResponse<UserListRes>>('/admin/users', { params }),
  getMovies:        (params: AdminMovieQuery) => http.get<ApiResponse<MovieListRes>>('/admin/movies', { params }),
  createMovie:      (data: MovieFormData)     => http.post<ApiResponse<{ movieId: number }>>('/admin/movies', data),
  updateMovie:      (id: number, data: MovieFormData) => http.put<ApiResponse<void>>(`/admin/movies/${id}`, data),
  getComments:      (params: AdminCommentQuery) => http.get<ApiResponse<CommentListRes>>('/admin/comments', { params }),
  deleteComment:    (id: number)              => http.delete<ApiResponse<boolean>>(`/admin/comments/${id}`),
  getRatings:       (params: AdminRatingQuery) => http.get<ApiResponse<RatingListRes>>('/admin/ratings', { params }),
  getRecommendations: (userId: number, params: { page: number; size: number }) =>
    http.get<ApiResponse<RecommendRes>>(`/admin/recommendations/${userId}`, { params }),
  getMetrics:       (jobId?: number)          => http.get<ApiResponse<MetricsRes>>('/admin/metrics', { params: jobId ? { jobId } : {} }),
}
```

---

## 7. 用户端页面设计

### 7.1 首页（HomePage）

**布局**：顶部搜索栏 + 热门推荐区 + 类型快捷入口

```
┌──────────────────────────────────┐
│  AppHeader (导航栏)              │
├──────────────────────────────────┤
│  🔍 搜索框 (输入关键词→跳转列表) │
│  [热门推荐]                     │
│  MovieCard × 8 (2行×4列网格)    │
│  点击 → /movies/:id             │
│  [查看更多 → 电影列表]          │
├──────────────────────────────────┤
│  AppFooter                       │
└──────────────────────────────────┘
```

**数据加载**：`movieStore.fetchHotMovies()` — 请求 `GET /api/movies?sortBy=hot&size=8`

**交互**：
- 点击搜索框 → 跳转 `/movies?keyword=xxx`
- 点击 MovieCard → 跳转 `/movies/:id`
- 点击"查看更多" → 跳转 `/movies`

### 7.2 电影列表页（MovieListPage）

**布局**：筛选区 + 排序栏 + 卡片网格 + 分页器

```
┌──────────────────────────────────────┐
│  筛选：[类型下拉] [排序：热门|评分|时间] │
│  搜索关键词：[keyword]              │
├──────────────────────────────────────┤
│  MovieCard × N (网格布局)            │
├──────────────────────────────────────┤
│  < 1 2 3 ... 10 >  (Pagination)     │
└──────────────────────────────────────┘
```

**数据加载**：`movieStore.fetchMovies({ page, size, genreId, keyword, sortBy })`

**URL 同步**：所有筛选参数通过 `route.query` 同步，刷新页面保持筛选状态。

**交互**：
- 切换类型/排序 → 重置 page=1，重新请求
- 输入关键词 → 300ms 防抖后重新请求
- 点击卡片 → 跳转详情

### 7.3 电影详情页（MovieDetailPage）

**布局**：

```
┌──────────────────────────────────────┐
│  海报 (PosterImage)                  │
│  标题、上映年份、类型标签             │
│  平均评分 ★ 4.12 (1200人评分)        │
│                                      │
│  简介：overview 文本                 │
│                                      │
│  ── 我的评分 ──                      │
│  [未登录] 提示登录后评分             │
│  [已登录] StarRating (可交互)        │
│                                      │
│  ── 我的评论 ──                      │
│  [已登录] 评论文本框 + 提交按钮       │
│                                      │
│  ── 最新评论 ──                      │
│  "username: content"  (status=0 的评论) │
└──────────────────────────────────────┘
```

**数据加载**：`GET /api/movies/{id}` → 包含 movie 详情 + latestComments

**交互**：
- StarRating 点击 → `POST /api/user/ratings` → 即时刷新 avgRating 显示
- 评论提交 → `POST /api/user/comments` → 刷新评论列表
- 游客访问 → StarRating 设为 readonly，隐藏评论框，显示"登录后参与互动"

**状态处理**：
- 电影不存在（404）→ 显示"电影不存在"提示
- 暂无评论 → 显示"暂无评论，来写第一条吧"

### 7.4 推荐页（RecommendPage）

**布局**：

```
┌──────────────────────────────────────┐
│  我的推荐 (source=mix 或 热门兜底)   │
│  [冷启动提示] "评分不足，为你推荐热门电影" │
├──────────────────────────────────────┤
│  MovieCard × N                       │
│  每张卡片显示:                       │
│  - rankNo 排名                       │
│  - 推荐解释: "与你高分电影风格相似"    │
│  - scoreMix / scoreUserCF / scoreItemCF│
├──────────────────────────────────────┤
│  Pagination                          │
└──────────────────────────────────────┘
```

**数据加载**：`recommendStore.fetchRecommendations(page, size)` → `GET /api/user/recommendations`

**交互**：
- 冷启动时显示 `isColdStart=true` 提示横幅
- 点击卡片 → 跳转详情

**状态处理**：
- 未登录 → 路由守卫自动跳转登录页
- 推荐结果为空 + 热门亦为空 → 显示"暂无推荐"
- 接口报错 → 显示错误提示 + 重试按钮

### 7.5 登录/注册页（LoginPage / RegisterPage）

**登录页**：用户名 + 密码 → `POST /api/auth/login` → 成功跳转 `redirect` 参数或首页

**注册页**：用户名 + 密码 + 确认密码 → 前端校验（长度、一致性）→ `POST /api/auth/register` → 自动登录

**校验规则**（前端同步校验，减少无效请求）：
- 用户名：4-32 位字母数字下划线
- 密码：6-64 位
- 确认密码：必须与密码一致

### 7.6 个人中心（ProfilePage）

**布局**：

```
┌──────────────────────────────────────┐
│  用户信息：username、注册时间         │
│  ── 我的评分 ──                      │
│  评分列表 (电影名 + 评分 + 时间)     │
│  ── 我的评论 ──                      │
│  评论列表 (电影名 + 内容 + 时间)     │
└──────────────────────────────────────┘
```

**数据加载**：
- 评分列表：可复用 `GET /api/admin/ratings?userId=self`，或单独提供 `/api/user/ratings/mine`
- 评论列表：同理，需在前端过滤 `status=0`

---

## 8. 管理端页面设计

### 8.1 管理端布局（AdminLayout.vue）

基于 Element Plus 的 `el-container` / `el-menu` 构建：

```
┌──────┬───────────────────────────┐
│      │  AdminHeader (用户名+退出) │
│ Side │───────────────────────────│
│ bar  │                           │
│      │  <router-view>            │
│[控制台]│                          │
│ 用户管理│                          │
│ 电影管理│                          │
│ 评论管理│                          │
│ 评分记录│                          │
│ 推荐结果│                          │
│ 评估看板│                          │
└──────┴───────────────────────────┘
```

侧边栏使用 `el-menu` 的 `router` 模式，`:default-active` 绑定当前 `route.path`。

### 8.2 控制台（DashboardPage）

使用 `el-card` + `el-statistic` 风格卡片展示：

- 用户总数
- 电影总数
- 评分总数
- 评论总数
- 最新推荐批次时间 + 状态标签（`el-tag`：success/failed/running）

### 8.3 用户管理（UserManagePage）

**组件**：`el-table` + `el-pagination` + `el-input`（搜索）+ `el-select`（状态筛选）

**表格列**：ID、用户名、邮箱、状态（启用/禁用）、注册时间

**交互**：支持按用户名搜索、按状态筛选、分页浏览。不提供用户编辑/删除（一期范围：只读管理）。

### 8.4 电影管理（MovieManagePage）

**组件**：`el-table` + `el-pagination` + `el-button`（新增）+ `MovieFormDialog`

**表格列**：ID、标题、上映年份、平均评分、评分人数、操作（编辑）

**MovieFormDialog（el-dialog）**：
- `el-form` 绑定 `MovieFormData`：标题(`el-input`)、简介(`el-input type=textarea`)、上映年份(`el-date-picker`)、TMDB ID(`el-input-number`)、海报 URL(`el-input`)、类型(`el-select multiple`)
- 校验规则：标题必填、年份范围 1900-2026
- 新增模式 → `POST /api/admin/movies`
- 编辑模式 → `PUT /api/admin/movies/{id}`
- 提交成功后关闭弹窗 + 刷新表格

### 8.5 评论管理（CommentManagePage）

**组件**：`el-table` + `el-pagination` + `el-input`（搜索）

**表格列**：ID、用户名、电影名、评论内容（截断显示）、发布时间、操作（删除按钮）

**删除操作**：`el-popconfirm` 确认 → `DELETE /api/admin/comments/{id}` → 该行从列表中移除或刷新

**交互**：管理员删除评论后，`status` 更新为 1，用户端电影详情页不再显示该评论。

### 8.6 评分记录（RatingRecordPage）

**组件**：`el-table` + `el-pagination` + 筛选条件（用户 ID、电影 ID）

**表格列**：ID、用户 ID、电影名、评分值、评分时间

**交互**：纯只读查询，不支持编辑或删除评分。

### 8.7 推荐结果查看（RecommendViewPage）

**入口**：管理员输入/选择用户 ID → `GET /api/admin/recommendations/{userId}`

**表格列**：排名、电影名、scoreMix、scoreUserCF、scoreItemCF、jobId

**交互**：纯只读，分页浏览目标用户的推荐明细。

### 8.8 评估看板（MetricsPage）

**上半部分** — 批次选择：

`el-select` 列出所有 `success` 状态的 recommend_job（按 run_time 倒序），默认选中最新批次。

**下半部分** — 指标展示：

使用 `MetricChart.vue`（封装 `vue-echarts`）展示两组数据：

| 图表 | 类型 | 数据 |
|---|---|---|
| Precision@K / Recall@K 对比 | 分组柱状图 | X=K 值，分组=UserCF/ItemCF |
| Coverage / Novelty 对比 | 柱状图 | X=指标，分组=UserCF/ItemCF |

表格汇总（`el-table`）：Algorithm | K | Precision | Recall | Coverage | Novelty

---

## 9. 设计系统与通用组件

### 9.1 设计理念

**Monochrome Minimal（极简黑白灰）** — 整体以 zinc 色系单色调为主，无彩色渐变，强调留白、边框和字体层次。所有圆角统一 2px（Tailwind `rounded-sm`），拒绝大圆角。仅状态标签使用语义色。

### 9.2 色彩系统

#### Tailwind 自定义色板

| Token | 色值 | 用途 |
|---|---|---|
| `accent` | `#18181B` (zinc-900) | 主强调色、深色背景、按钮填充、导航激活态 |
| `accent-hover` | `#3F3F46` (zinc-700) | 悬停加深色 |
| `surface` | `#FAFAFA` (zinc-50) | 输入框背景、表头背景、卡片底色、Sidebar 背景 |
| `border` | `#E4E4E7` (zinc-200) | 所有边框统一色 |
| `text-secondary` | `#52525B` (zinc-600) | 次要文字、未激活导航 |
| `text-muted` | `#A1A1AA` (zinc-400) | 辅助文字、占位符、表头标签 |
| `hover-bg` | `#F4F4F5` (zinc-100) | 行悬停、导航悬停背景 |

#### 语义色（仅用于状态标签）

| 用途 | 背景 | 文字 | 边框 |
|---|---|---|---|
| 成功 / 正常 / 启用 | `#F0FDF4` | `#16A34A` | `#BBF7D0` |
| 错误 / 禁用 / 删除 | `#FEF2F2` | `#DC2626` | `#FECACA` |
| 警告 | `#FFFBEB` | `#CA8A04` | — |

#### 主文字色

| 场景 | 色值 |
|---|---|
| 主内容文字 | `#09090B` (zinc-950) |
| 深色背景上文字 | `white` / `white/70` / `white/50` |

### 9.3 字体系统

| Token | 字体 | 用途 |
|---|---|---|
| `font-heading` | Archivo, sans-serif | 标题、大数字、品牌名、统计数字 |
| `font-body` | Space Grotesk, sans-serif | 正文（全局默认） |

**导入方式（index.html）：**

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**字号层级：**

| 用途 | 字号 | 字重 |
|---|---|---|
| Hero 主标题 | `text-4xl` ~ `text-7xl` | `font-bold` |
| 页面大标题 | `text-2xl` ~ `text-3xl` | `font-semibold` ~ `font-bold` |
| 区块标题 | `text-xl` ~ `text-2xl` | `font-semibold` |
| 模态框标题 | `text-lg` | `font-semibold` |
| 导航链接 | `text-sm` | `font-medium` |
| 正文 | `text-sm` | — |
| 辅助文字 | `text-xs` | — |
| 极小标签 | `text-[10px]` | `font-semibold` |
| 统计数字 | `text-3xl` | `font-bold` (font-heading) |

### 9.4 全局基础样式

文件：`src/styles/design-system.css`

```css
body {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #09090B;
  background: #FFFFFF;
  -webkit-font-smoothing: antialiased;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

a { color: inherit; text-decoration: none; }
```

### 9.5 通用组件清单

| 组件 | 使用场景 | 用户端 | 管理端 |
|---|---|---|---|
| AppHeader | 全局导航栏 | Tailwind 手写 | 无（AdminSidebar 替代） |
| AppFooter | 全局页脚 | Tailwind 手写 | 无 |
| MovieCard | 电影卡片展示 | Tailwind 手写 | 无 |
| StarRating | 星级评分 | Tailwind 手写 | 无 |
| PosterImage | 海报+兜底 | Tailwind 手写 | 无 |
| Pagination | 分页 | Tailwind 手写 | Element Plus 内置 |

### 9.6 输入框

所有 input / textarea / select 统一 Tailwind 样式：

```
w-full px-4 py-3
text-sm text-[#09090B]
placeholder:text-[#A1A1AA]
bg-[#FAFAFA]
border border-[#E4E4E7]
rounded-sm
focus:border-[#18181B] focus:outline-none
transition-all duration-200
```

### 9.7 按钮

**主按钮（深色填充）：**

```
px-6 py-2.5
bg-[#18181B]
hover:bg-[#3F3F46]
text-white text-sm font-semibold
rounded-sm
transition-colors duration-200
cursor-pointer
active:scale-[0.99]
```

**次按钮（边框幽灵）：**

```
px-5 py-2.5
border border-[#E4E4E7]
hover:border-[#18181B]
text-sm font-medium
rounded-sm
transition-all duration-200
cursor-pointer
```

### 9.8 卡片容器

```
bg-white
border border-[#E4E4E7]
rounded-sm
p-5
```

### 9.9 表格

```
w-full text-sm
thead: bg-[#FAFAFA] text-xs text-[#A1A1AA]
th: text-left py-3 px-5 font-medium
td: py-3 px-5 border-b border-[#F4F4F5]
tr: hover:bg-[#FAFAFA] transition-colors duration-150
```

### 9.10 分页器（用户端手写）

- 按钮尺寸：`w-7 h-7`
- 当前页：`bg-[#18181B] text-white font-medium`
- 其他页：`text-[#52525B] border border-[#E4E4E7] hover:border-[#18181B]`
- 箭头：`text-[#A1A1AA] border border-[#E4E4E7]`
- 统一 `rounded-sm text-xs`

### 9.11 模态框

```
fixed inset-0 z-50 flex items-center justify-center
  遮罩: absolute inset-0 bg-black/40
  内容: relative bg-white border border-[#E4E4E7] rounded-sm p-6
```

### 9.12 状态标签 (Badge)

- 成功/正常：`bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]`
- 错误/禁用：`bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]`
- 通用标签：`bg-[#FAFAFA] text-[#52525B] border border-[#E4E4E7]`
- 尺寸：`text-[10px] font-semibold px-2 py-0.5 rounded-sm`

### 9.13 类型标签 (Genre Tag)

```
text-xs font-medium px-3 py-1
border border-[#E4E4E7] rounded-sm
bg-[#FAFAFA] text-[#52525B]
```

### 9.14 类型筛选按钮（选中/未选中）

- 未选中：`bg-white text-[#52525B] border border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]`
- 选中：`bg-[#18181B] text-white border-[#18181B] font-medium`

### 9.15 海报兜底机制

`PosterImage.vue`：`<img :src="src" @error="onError" />`

- `src` 为 null/空 → 直接显示 `fallback`（默认 `/assets/posters/default-movie.png`）
- `src` 加载失败 → 替换为 `fallback`
- 海报容器：`aspect-[2/3] bg-[#F4F4F5] relative overflow-hidden rounded-sm`

### 9.16 过渡动画

全项目统一使用的过渡类：

| 属性 | 类名 |
|---|---|
| 颜色过渡 | `transition-colors duration-150` / `duration-200` |
| 全部过渡 | `transition-all duration-150` / `duration-200` |
| 变换过渡 | `transition-transform duration-300` |
| 按钮点击 | `active:scale-[0.99]` |
| 图片悬停 | `group-hover:scale-105` |

### 9.17 滚动条隐藏

用于水平滚动区域（类型筛选等）：

```css
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

### 9.18 响应式断点

| 断点 | 前缀 | 典型用途 |
|---|---|---|
| 640px | `sm:` | 2 列网格 |
| 768px | `md:` | 导航链接显示/隐藏、3 列网格 |
| 1024px | `lg:` | 侧边栏显示、4 列网格、登录页左右分栏 |
| 1280px | `xl:` | 大屏布局 |


## 10. 构建与部署

### 10.1 Vite 配置

```typescript
// vite.config.ts

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],        // 管理端依赖独立 chunk
          'echarts': ['echarts', 'vue-echarts'],   // 图表独立 chunk
        }
      }
    }
  }
})
```

### 10.2 环境变量

```ini
# .env.development
VITE_API_BASE_URL=/api

# .env.production
VITE_API_BASE_URL=/api
```

开发环境通过 Vite proxy 转发到后端，生产环境通过 Nginx 反向代理。

### 10.3 部署架构

```
用户浏览器
    │
    ▼
Nginx (:80)
    ├─ /          → Vue 前端静态文件 (dist/)
    └─ /api/*     → 反向代理 → Spring Boot (:8080)
```
