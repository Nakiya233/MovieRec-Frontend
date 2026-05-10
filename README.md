# 电影推荐系统 — 前端

毕业设计项目，基于 Vue 3 构建的电影推荐系统前端，支持用户浏览、搜索、评分、评论与个性化推荐，以及管理端数据管理与算法评估。

## 技术栈

- **框架**: Vue 3 + TypeScript + Vite
- **样式**: Tailwind CSS + Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **图表**: ECharts + vue-echarts
- **HTTP**: Axios
- **工具**: dayjs、@vueuse/core

## 功能概览

**用户端**
- 注册 / 登录
- 电影列表浏览（关键词搜索、类型筛选、排序）
- 电影详情（评分、评论）
- 提交评分 / 评论
- 个性化推荐
- 个人中心（评分记录、评论记录）

**管理端**
- 数据仪表盘
- 用户管理（封禁 / 解封）
- 电影管理（CRUD）
- 评论治理（查看 / 删除）
- 评分记录查看
- 推荐任务触发与结果查看
- 算法评估看板

## 项目结构

```
src/
├── api/          # API 请求层
├── components/   # 公共组件 (common/) 与管理端组件 (admin/)
├── composables/  # 组合式函数 (useAuth, useToast, useDebounce...)
├── router/       # 路由配置 (用户端 + 管理端)
├── stores/       # Pinia 状态管理
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数 (format, token, validators)
├── views/        # 页面组件 (user/ 用户端, admin/ 管理端)
├── App.vue
└── main.ts
```

## 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器 (默认 http://localhost:5173)
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 环境变量

开发环境配置位于 `.env.development`：

```env
VITE_API_BASE_URL=/api
```

开发服务器通过 Vite proxy 将 `/api` 请求代理至后端 `http://localhost:8080`。

## 后端依赖

本项目需要配合后端服务使用，默认代理到 `http://localhost:8080`。后端 API 文档参见 `docs/api-docs.json`。
