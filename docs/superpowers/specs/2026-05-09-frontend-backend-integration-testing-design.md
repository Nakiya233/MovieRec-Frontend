# 前后端联调测试方案

## 背景

- 后端 (Spring Boot 3.4.11) 代码已编写完成但未启动
- 前端 (Vue 3 + Vite) API 调用代码已编写但未与后端实际验证
- 数据库 `movie_rec` (MySQL) 已建库建表有数据
- Redis 已就绪
- 目标：在浏览器中走通全部业务流程，完成毕业设计验收

## 技术栈总览

| 组件 | 技术 | 端口 |
|------|------|------|
| 后端 | Spring Boot 3.4.11 + MyBatis-Plus + MySQL + Redis + JWT | 8080 |
| 前端 | Vue 3 + Vite + Element Plus + Pinia + ECharts + Tailwind CSS | 5173 |
| API 文档 | Knife4j / SpringDoc | `/swagger-ui.html` |
| 代理 | Vite proxy `/api` → `localhost:8080` | - |

## 联调步骤

### 第 1 步：启动后端

```bash
cd backend/
./mvnw spring-boot:run
```

验证：
- `GET http://localhost:8080/v3/api-docs` 返回 API 文档 JSON → 启动成功
- `http://localhost:8080/swagger-ui.html` Swagger UI 可访问

后端依赖并启动失败场景：
- MySQL 未启动 → 检查 MySQL 服务，确认数据库 `movie_rec` 存在
- Redis 未启动 → 检查 Redis 服务 (`redis-cli ping`)
- 端口 8080 被占 → `lsof -i :8080` / `netstat -ano | findstr 8080`

### 第 2 步：启动前端

```bash
cd frontend/
npm run dev
```

浏览器访问 `http://localhost:5173`

### 第 3 步：Swagger 接口核对（联调关键）

访问 `http://localhost:8080/swagger-ui.html`，与 `src/api/` 目录下的前端调用逐一比对：

- 接口路径是否一致
- 请求方法 (GET/POST/PUT/DELETE) 是否一致
- 请求参数名和格式是否一致
- 响应字段名是否一致（Java 驼峰 vs 前端字段名）

前端 API 文件清单：
- `src/api/authApi.ts` — 登录、注册
- `src/api/movieApi.ts` — 电影列表、详情、搜索
- `src/api/ratingApi.ts` — 评分提交与查询
- `src/api/commentApi.ts` — 评论提交与查询
- `src/api/recommendApi.ts` — 推荐结果
- `src/api/adminApi.ts` — 管理端各接口

### 第 4 步：浏览器流程验证

| 序号 | 流程 | 验证点 |
|------|------|--------|
| 1 | 注册 → 登录 | 注册表单字段齐全、token 正确存储、登录后路由跳转 |
| 2 | 首页浏览 | 电影列表渲染、分页切页、搜索/筛选功能 |
| 3 | 电影详情 | 评分组件交互、评论提交与列表刷新 |
| 4 | 推荐页 | 推荐结果正常加载、空数据兜底展示 |
| 5 | 管理端-用户管理 | 列表、搜索、封禁/解封 |
| 6 | 管理端-电影管理 | 列表、新增/编辑弹窗、删除 |
| 7 | 管理端-评论管理 | 列表、审核通过/驳回 |
| 8 | 管理端-评分记录 | 列表、查询 |
| 9 | 管理端-推荐查看 | 推荐结果查看 |
| 10 | 管理端-评估看板 | 图表数据加载、ECharts 渲染 |

每走通一个流程就打勾标注。遇到报错打开浏览器 DevTools (F12) → Network 面板查看具体接口状态码和错误信息。

## 成功标准

全部 10 个流程在浏览器中走通，无控制台报错。
