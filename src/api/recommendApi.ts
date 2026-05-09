import http from './request'
import type { ApiResponse } from '@/types/api'
import type { RecommendRes } from '@/types/recommend'

export const recommendApi = {
  getList(params: { page: number; size: number }) {
    return http.get<ApiResponse<RecommendRes>>('/user/recommendations', { params })
  }
}
