# Admin Login Page Design

## Summary

新增独立的管理员登录页面 `/admin/login`，UI 风格为简洁后台登录页，复用现有 `/auth/login` API。

## Route

- **Path:** `/admin/login`
- **Name:** `AdminLogin`
- **Component:** `src/views/admin/AdminLoginPage.vue`
- **Meta:** `{ guestOnly: true }`

## Component: AdminLoginPage.vue

- 居中卡片式布局，浅灰/深色后台风格
- 品牌标识 + "管理后台" 副标题
- 仅用户名 + 密码两个字段，无注册切换
- 错误/提示信息区域

## Login Flow

1. 调用 `auth.login(username, password)`（复用同一 API）
2. 成功后检查 `auth.isAdmin`
3. `isAdmin === true` → `router.push('/admin/dashboard')`
4. `isAdmin === false` → `auth.logout()` + 显示 "无权限访问管理后台"

## Route Guard Adjustment

`router.beforeEach` 中新增：已登录管理员访问 `/admin/login` 时直接跳转 `/admin/dashboard`，而不是被 `guestOnly` 规则重定向到首页。
