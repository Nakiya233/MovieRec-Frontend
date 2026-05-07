# 电影推荐系统 — 前端实现计划

> 基于 [设计文档](../2026-05-07-frontend-design.md)，参考 login.html / user-home.html / admin-dashboard.html 三个页面布局
> 实现原则：每完成一个功能模块提交一次 git

---

## 总览

```
Phase 1: 项目脚手架          (1 步)
Phase 2: 基础层              (5 步：样式 → 类型 → 工具 → API → 路由+Store)
Phase 3: 通用组件            (1 步，6 个组件)
Phase 4: 用户端页面          (7 步，7 个页面)
Phase 5: 管理端页面          (9 步，1 布局 + 7 页面 + 1 图表组件)
Phase 6: 收尾集成            (2 步)
共 ~25 次 git commit
```

---

## Phase 1: 项目脚手架

### Step 1.1 — 初始化 Vite + Vue3 + TS 项目

**操作：**
```bash
npm create vite@latest . -- --template vue-ts
```

**依赖安装：**
```bash
npm install vue-router@4 pinia axios dayjs @vueuse/core
npm install element-plus echarts vue-echarts
npm install -D @types/node
```

**产出文件：**
- `package.json` — 依赖声明
- `vite.config.ts` — 配置 `@` 别名 + `/api` 代理 + `manualChunks`（element-plus, echarts 独立 chunk）
- `tsconfig.json` — 路径别名配置
- `index.html` — Google Fonts 引入（Archivo + Space Grotesk）
- `src/main.ts` — 创建 app、注册 router/pinia
- `src/App.vue` — 根组件 `<router-view />`
- `.env.development` — `VITE_API_BASE_URL=/api`

**验证：** `npm run dev` 启动成功，浏览器打开空白页。

**Git commit：** `chore: 初始化 Vite + Vue3 + TS 项目脚手架`

---

## Phase 2: 基础层

### Step 2.1 — 设计系统样式

创建全局样式文件，将 HTML 参考页中的 Tailwind 自定义色板、CSS 变量、按钮/输入框/卡片/表格等样式落地。

**文件：**
- `src/styles/variables.css` — CSS 自定义属性（色板、间距、圆角）
- `src/styles/base.css` — 重置样式、body 默认字体/颜色/抗锯齿
- `src/styles/shared.css` — 复用样式类（`.btn-primary`、`.btn-outline`、`.input-field`、`.stat-card`、`.table-header` 等）

**参考来源：** 设计文档 §9.1-9.18，以及三个 HTML 参考页中的 `<style>` 块。

**验证：** 无（纯 CSS，后续组件引用时验证）。

**Git commit：** `feat: 添加设计系统样式（Monochrome Minimal 色板 + 全局基础样式）`

### Step 2.2 — TypeScript 类型定义

**文件：**
- `src/types/api.ts` — `ApiResponse<T>`、`PageResult<T>`、`PageParams`
- `src/types/user.ts` — `UserInfo`、`LoginReq`、`RegisterReq`、`LoginRes`
- `src/types/movie.ts` — `MovieCardData`、`MovieDetail`、`MovieQueryParams`、`MovieListRes`、`MovieFormData`
- `src/types/recommend.ts` — `RecommendRecord`、`RecommendRes`
- `src/types/admin.ts` — `AdminUserQuery`、`AdminMovieQuery`、`AdminCommentQuery`、`AdminRatingQuery`、`MetricsRes`、`UserListRes`、`CommentListRes`、`RatingListRes`

**验证：** `npx vue-tsc --noEmit` 类型检查通过。

**Git commit：** `feat: 添加 TypeScript 类型定义（API 响应 / 用户 / 电影 / 推荐 / 管理端）`

### Step 2.3 — 工具函数

**文件：**
- `src/utils/token.ts` — `getToken()` / `setToken()` / `removeToken()`（localStorage 封装）
- `src/utils/validators.ts` — 用户名校验（4-32位）、密码校验（6-64位）、确认密码一致性
- `src/utils/format.ts` — 日期格式化（dayjs）、评分保留一位小数

**验证：** 导出函数可在浏览器 console 中正常调用。

**Git commit：** `feat: 添加工具函数（Token 存取 / 表单校验 / 日期格式化）`

### Step 2.4 — Axios 实例 + API 模块

**文件：**
- `src/api/request.ts` — Axios 实例、请求拦截器（注入 JWT）、响应拦截器（业务错误 + 401 处理）
- `src/api/authApi.ts` — `login()` / `register()`
- `src/api/movieApi.ts` — `getList()` / `getDetail()`
- `src/api/ratingApi.ts` — `submit()`
- `src/api/commentApi.ts` — `submit()`
- `src/api/recommendApi.ts` — `getList()`
- `src/api/adminApi.ts` — `getUsers()` / `getMovies()` / `createMovie()` / `updateMovie()` / `getComments()` / `deleteComment()` / `getRatings()` / `getRecommendations()` / `getMetrics()`

**验证：** 导出所有 API 函数，参数类型正确。

**Git commit：** `feat: 添加 Axios 实例封装 + 全部 API 模块`

### Step 2.5 — 路由 + Pinia Store

**文件：**
- `src/router/user-routes.ts` — 7 条用户端路由（首页/登录/注册/列表/详情/推荐/个人中心）
- `src/router/admin-routes.ts` — 1 条管理端路由（AdminLayout 嵌套 7 个子页面）
- `src/router/index.ts` — 合并路由 + `beforeEach` 守卫（游客限制 / 登录要求 / 管理员权限）
- `src/stores/authStore.ts` — 登录/注册/登出/初始化恢复
- `src/stores/movieStore.ts` — 电影列表缓存 / 详情缓存 / 热门电影
- `src/stores/recommendStore.ts` — 推荐结果 / 冷启动标记
- `src/stores/adminStore.ts` — 管理端共享筛选条件

**验证：** 路由守卫逻辑正确（未登录跳转、已登录跳过登录页、非管理员拒绝）。

**Git commit：** `feat: 添加路由配置 + Pinia Store（auth/movie/recommend/admin）`

---

## Phase 3: 通用组件

### Step 3.1 — 6 个通用组件

所有组件参考 HTML 参考页中的样式和交互实现。

| 组件 | 文件 | 核心 Props | 参考页面 |
|---|---|---|---|
| PosterImage | `src/components/common/PosterImage.vue` | `src`, `alt`, `fallback?` | user-home.html 卡片海报区 |
| StarRating | `src/components/common/StarRating.vue` | `modelValue`, `readonly`, `size?` | 设计文档 §4.2 |
| MovieCard | `src/components/common/MovieCard.vue` | 见设计文档 §4.2 Props 契约 | user-home.html `.movie-card` |
| Pagination | `src/components/common/Pagination.vue` | `current`, `total`, `pageSize` | admin-dashboard.html 分页器 |
| AppHeader | `src/components/common/AppHeader.vue` | 无（读取 authStore） | user-home.html `<nav>` |
| AppFooter | `src/components/common/AppFooter.vue` | 无 | user-home.html `<footer>` |

**注意：** AppHeader 需要根据 `authStore.isLoggedIn` 显示不同状态（未登录→登录按钮，已登录→用户头像+通知图标）。

**验证：** 在 App.vue 中临时引入 AppHeader + MovieCard（传 mock 数据）查看渲染效果，然后移除。

**Git commit：** `feat: 添加通用组件（AppHeader / AppFooter / MovieCard / StarRating / PosterImage / Pagination）`

---

## Phase 4: 用户端页面

### Step 4.1 — 登录注册页

**文件：** `src/views/user/LoginPage.vue`、`src/views/user/RegisterPage.vue`

**参考：** `docs/login.html` 的布局 —— 左侧品牌面板（深色背景 + 标语）、右侧表单面板（Tab 切换 + 输入框 + 提交按钮）

**功能：**
- 登录/注册 Tab 切换
- 前端校验（用户名 4-32 位、密码 6-64 位、确认密码一致）
- 调用 `authStore.login()` / `authStore.register()`
- 成功后跳转 redirect 参数或首页
- 错误提示（用户名已存在、密码错误等）

**Git commit：** `feat: 添加登录 + 注册页面`

### Step 4.2 — 首页

**文件：** `src/views/user/HomePage.vue`

**参考：** `docs/user-home.html` —— Hero 横幅 + 类型筛选 pill + 推荐网格 + 热门排行列表 + 最新上架横滚

**功能：**
- 调用 `movieStore.fetchHotMovies()` 渲染热门推荐网格（MovieCard × 8）
- 类型筛选 pill 按钮（点击切换选中态，纯 UI 占位，跳转逻辑后续接）
- 热门排行区（纯 UI 占位，数据从 hotMovies 取前4）
- 搜索框 → 回车跳转 `/movies?keyword=xxx`

**Git commit：** `feat: 添加用户端首页`

### Step 4.3 — 电影列表页

**文件：** `src/views/user/MovieListPage.vue`

**参考：** `docs/user-home.html` 推荐网格区域 + 类型 pill

**功能：**
- 从 `route.query` 读取筛选参数（keyword、genreId、sortBy、page）
- 调用 `movieStore.fetchMovies()` 获取数据
- MovieCard 网格 + Pagination 分页
- 类型筛选 + 排序切换 → 更新 query → 重新请求
- 关键词搜索 300ms 防抖

**Git commit：** `feat: 添加电影列表页（筛选 + 分页 + 搜索）`

### Step 4.4 — 电影详情页

**文件：** `src/views/user/MovieDetailPage.vue`

**参考：** 设计文档 §7.3 布局

**功能：**
- `GET /api/movies/:id` 获取详情
- 海报 + 标题 + 年份 + 类型标签 + 简介 + 平均评分
- 已登录 → StarRating 可交互（提交评分后刷新 avgRating）
- 已登录 → 评论输入框 + 提交
- 游客 → StarRating 只读，显示"登录后参与互动"
- 最新评论列表
- 电影不存在（404）→ 错误提示

**Git commit：** `feat: 添加电影详情页（海报 + 评分 + 评论）`

### Step 4.5 — 推荐页

**文件：** `src/views/user/RecommendPage.vue`

**参考：** 设计文档 §7.4

**功能：**
- `recommendStore.fetchRecommendations()` 获取推荐
- 冷启动时显示提示横幅
- MovieCard 网格 + 排名编号 + 推荐理由
- 分页

**Git commit：** `feat: 添加个性推荐页`

### Step 4.6 — 个人中心

**文件：** `src/views/user/ProfilePage.vue`

**参考：** 设计文档 §7.6

**功能：**
- 用户基本信息（username、注册时间）
- 我的评分列表（电影名 + 评分 + 时间）
- 我的评论列表（电影名 + 内容 + 时间，status=0 显示）

**Git commit：** `feat: 添加个人中心页`

### Step 4.7 — Composable 函数

**文件：**
- `src/composables/useAuth.ts` — 登录状态检查、角色判断
- `src/composables/usePagination.ts` — 分页逻辑封装
- `src/composables/useDebounce.ts` — 输入防抖

**验证：** 在已完成的用户端页面中确认 composable 正常工作。

**Git commit：** `feat: 添加 composable 函数（useAuth / usePagination / useDebounce）`

---

## Phase 5: 管理端页面

### Step 5.1 — 管理端布局

**文件：**
- `src/views/admin/AdminLayout.vue`
- `src/components/admin/AdminSidebar.vue`
- `src/components/admin/AdminHeader.vue`

**参考：** `docs/admin-dashboard.html` —— 左侧固定侧边栏 + 右侧顶栏 + 内容区

**功能：**
- el-menu 侧边栏（router 模式，`:default-active` 绑定路由）
- 侧边栏底部显示当前管理员信息
- 顶栏：页面标题 + 搜索框 + 通知图标
- `<router-view>` 渲染子页面

**验证：** 访问 `/admin/dashboard` 看到侧边栏 + 顶栏 + 空白内容区。

**Git commit：** `feat: 添加管理端布局（侧边栏 + 顶栏）`

### Step 5.2 — 控制台

**文件：** `src/views/admin/DashboardPage.vue`

**参考：** `docs/admin-dashboard.html` —— 4 个统计卡片 + 柱状图 + 最近活动 + 电影表格

**功能：**
- 统计卡片：用户总数 / 电影总数 / 评分总数 / 评论总数
- 最新推荐批次时间 + 状态标签（el-tag）
- 最近活动列表（纯 UI 占位，数据从 API 获取）
- 电影列表简表（纯 UI 占位）

**Git commit：** `feat: 添加管理端控制台页`

### Step 5.3 — 用户管理

**文件：** `src/views/admin/UserManagePage.vue`

**功能：**
- el-table：ID / 用户名 / 邮箱 / 状态 / 注册时间
- 搜索框 + el-pagination
- 只读管理（一期）

**Git commit：** `feat: 添加管理端用户管理页`

### Step 5.4 — 电影管理 + 表单弹窗

**文件：**
- `src/views/admin/MovieManagePage.vue`
- `src/components/admin/MovieFormDialog.vue`

**功能：**
- el-table：ID / 标题 / 年份 / 评分 / 操作（编辑）
- MovieFormDialog（el-dialog + el-form）
- 新增 → `POST /api/admin/movies`，编辑 → `PUT /api/admin/movies/:id`
- 表单校验（标题必填、年份 1900-2026）

**Git commit：** `feat: 添加管理端电影管理页 + 新增/编辑弹窗`

### Step 5.5 — 评论管理

**文件：** `src/views/admin/CommentManagePage.vue`

**功能：**
- el-table：ID / 用户名 / 电影名 / 内容（截断） / 时间 / 删除按钮
- el-popconfirm 确认删除 → `DELETE /api/admin/comments/:id`

**Git commit：** `feat: 添加管理端评论管理页`

### Step 5.6 — 评分记录

**文件：** `src/views/admin/RatingRecordPage.vue`

**功能：**
- el-table + 筛选（用户ID、电影ID）+ 分页
- 纯只读

**Git commit：** `feat: 添加管理端评分记录页`

### Step 5.7 — 推荐结果查看

**文件：** `src/views/admin/RecommendViewPage.vue`

**功能：**
- 输入/选择用户ID → `GET /api/admin/recommendations/:userId`
- 表格列：排名 / 电影名 / scoreMix / scoreUserCF / scoreItemCF / jobId
- 分页

**Git commit：** `feat: 添加管理端推荐结果查看页`

### Step 5.8 — 评估看板

**文件：**
- `src/views/admin/MetricsPage.vue`
- `src/components/admin/MetricChart.vue`

**功能：**
- el-select 选择批次（success 状态的 recommend_job）
- MetricChart（vue-echarts）：Precision@K / Recall@K 分组柱状图 + Coverage / Novelty 柱状图
- el-table 汇总表格

**Git commit：** `feat: 添加管理端评估看板页 + 图表组件`

### Step 5.9 — Element Plus 按需引入确认

确认 element-plus 只在 `/admin/*` 路由加载时才引入（通过 manualChunks 独立打包），用户端不受影响。

**验证：** `npm run build`，确认 element-plus 和 echarts 各自独立 chunk，用户端页面 chunk 不包含 element-plus。

**Git commit：** `chore: 确认 Element Plus / ECharts 独立 chunk 配置`

---

## Phase 6: 收尾集成

### Step 6.1 — App.vue 根组件串联

**文件：** `src/App.vue`

**功能：**
- `<AppHeader />`（用户端路由显示，管理端隐藏）
- `<router-view />`
- `<AppFooter />`（用户端路由显示，管理端隐藏）
- `onMounted` 时调用 `authStore.initFromStorage()`

根据 `route.path` 是否以 `/admin` 开头决定是否显示用户端壳组件。

**Git commit：** `feat: 串联根组件（AppHeader + router-view + AppFooter）`

### Step 6.2 — 构建验证 + 路由联调

**操作：**
- `npm run build` 确保构建成功
- `npm run dev` 手动浏览全部路由：
  - `/` 首页、`/login` 登录、`/register` 注册
  - `/movies` 列表、`/movies/1` 详情
  - `/recommendations` 推荐、`/profile` 个人中心
  - `/admin/dashboard` 控制台、`/admin/users` 用户管理
  - `/admin/movies` 电影管理、`/admin/comments` 评论管理
  - `/admin/ratings` 评分记录、`/admin/recommendations/1` 推荐查看
  - `/admin/metrics` 评估看板

**Git commit：** `chore: 构建验证 + 路由联调`

---

## 依赖关系图

```
Phase 1 (脚手架)
  └→ Phase 2.1 (样式) → Phase 2.2 (类型) → Phase 2.3 (工具) → Phase 2.4 (API) → Phase 2.5 (路由+Store)
                                                                                        └→ Phase 3 (通用组件)
                                                                                              └→ Phase 4.1 (登录注册)
                                                                                              └→ Phase 4.2 (首页)
                                                                                              └→ Phase 4.3 (电影列表)
                                                                                              └→ Phase 4.4 (电影详情)
                                                                                              └→ Phase 4.5 (推荐页)
                                                                                              └→ Phase 4.6 (个人中心)
                                                                                              └→ Phase 4.7 (Composable)
                                                                                              
Phase 2.5 + Phase 3 完成后即可开始 Phase 5:
  Phase 5.1 (管理端布局) → Phase 5.2~5.8 (各管理页面可并行)
  Phase 5.9 (Element Plus 确认)

Phase 4 + Phase 5 全部完成 → Phase 6 (收尾)
```

---

## 每个 commit 后的验证清单

| 验证项 | 说明 |
|---|---|
| `npx vue-tsc --noEmit` | 类型检查通过 |
| `npm run build` | 构建成功（Phase 1 后开始执行） |
| `npm run dev` | 开发服务器正常启动 |
| 手动浏览器验证 | 对应步骤的页面/组件可正常渲染 |
