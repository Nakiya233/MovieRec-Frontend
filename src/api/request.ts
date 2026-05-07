import axios from 'axios'
import type { ApiResponse } from '@/types/api'
import { getToken, removeToken, removeUser } from '@/utils/token'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器：注入 JWT
http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一错误处理
http.interceptors.response.use(
  (response) => {
    const body: ApiResponse = response.data
    if (body.code !== 0) {
      return Promise.reject(body)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      removeUser()
      // 延迟跳转避免与 Pinia 初始化冲突
      setTimeout(() => {
        window.location.href = '/login'
      }, 0)
    }
    return Promise.reject(error)
  }
)

export default http
