import http from './request'
import type { ApiResponse } from '@/types/api'

export interface RatingReq {
  movieId: number
  score: number
}

export interface RatingRes {
  id: number
  movieId: number
  score: number
  avgRating: number
}

export const ratingApi = {
  submit(data: RatingReq) {
    return http.post<ApiResponse<RatingRes>>('/user/ratings', data)
  }
}
