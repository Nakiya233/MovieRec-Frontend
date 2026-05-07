import http from './request'
import type { ApiResponse } from '@/types/api'
import type { LoginReq, RegisterReq, LoginRes } from '@/types/user'

export const authApi = {
  login(data: LoginReq) {
    return http.post<ApiResponse<LoginRes>>('/auth/login', data)
  },
  register(data: RegisterReq) {
    return http.post<ApiResponse<{ userId: number }>>('/auth/register', data)
  }
}
